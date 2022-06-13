import datetime
from flask import Flask, request
from flask_restx import Api, Resource, fields
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

cred = credentials.Certificate("valued-throne-350421-firebase-adminsdk-8of5y-cc6d986bb9.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

baseRoute = "/api"
businessRoute = "/businesses"
tryvestorRoute = "/tryvestors"
api = Api(app=app, prefix=baseRoute)
busApi = api.namespace("businesses", description="For business side requests")
tryApi = api.namespace("tryvestors", description="For tryvestor side requests")


class Business:
    def __init__(self, docID, name, description, topics, valuation, totalShares, media, logo, tagline):
        self.tagline = tagline
        self.logo = logo
        self.media = media
        self.totalShares = totalShares
        self.valuation = valuation
        self.topics = topics
        self.description = description
        self.name = name
        self.docID = docID

    @staticmethod
    def fromDict(sourceDict, busID):
        return Business(
            tagline=sourceDict["tagline"],
            logo=sourceDict["logo"],
            media=sourceDict["media"],
            totalShares=sourceDict["totalShares"],
            valuation=sourceDict["valuation"],
            topics=sourceDict["topics"],
            description=sourceDict["description"],
            name=sourceDict["name"],
            docID=busID
        )

    def toDict(self):
        return {
            "name": self.name,
            "description": self.description,
            "topics": self.topics,
            "valuation": self.valuation,
            "totalShares": self.totalShares,
            "media": self.media,
            "logo": self.logo,
            "tagline": self.tagline,
            "docID": self.docID
        }

    def asJson(self):
        return self.toDict()


class TermDocument:
    def __init__(self, termID, formLink, description, resultsLink, businessID, numSharesAward):
        self.termID = termID
        self.formLink = formLink
        self.description = description
        self.resultsLink = resultsLink
        self.businessID = businessID
        self.numSharesAward = numSharesAward

    @staticmethod
    def fromDict(sourceDict, termDocID):
        return TermDocument(
            formLink=sourceDict["formLink"],
            description=sourceDict["description"],
            resultsLink=sourceDict["resultsLink"],
            businessID=sourceDict["businessID"],
            numSharesAward=sourceDict["numSharesAward"],
            termID=termDocID
        )

    def toDict(self):
        return {
            "businessID": self.businessID,
            "description": self.description,
            "numSharesAward": self.numSharesAward,
            "formLink": self.formLink,
            "resultsLink": self.resultsLink
        }

    def asJson(self):
        return self.toDict()


class TermResponse:
    def __init__(self, tryID, verificationStatus, termResponseID):
        self.tryID = tryID
        self.verificationStatus = verificationStatus
        self.termResponseID = termResponseID

    @staticmethod
    def fromDict(sourceDict, termResponseID):
        return TermResponse(
            termResponseID=termResponseID,
            tryID=sourceDict["tryvestorID"],
            verificationStatus=sourceDict["verificationStatus"],
        )

    def toDict(self):
        return {
            "tryvestorID": self.tryID,
            "verificationStatus": self.verificationStatus,
            "termResponseID": self.termResponseID
        }

    def asJson(self):
        return self.toDict()


class Tryvestor:
    def __init__(self, docID, firstName, lastName, username, interests):
        self.docID = docID
        self.firstName = firstName
        self.lastName = lastName
        self.username = username
        self.interests = interests

    @staticmethod
    def fromDict(sourceDict, tryID):
        return Tryvestor(
            docID=tryID,
            firstName=sourceDict["firstName"],
            lastName=sourceDict["lastName"],
            username=sourceDict["username"],
            interests=sourceDict["interests"]
        )

    def toDict(self):
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "username": self.username,
            "interests": self.interests,
            "tryvestorID": self.docID
        }

    def asJson(self):
        return self.toDict()


@busApi.route("")  # http://127.0.0.1:5000/api/businesses
class AllBusinesses(Resource):
    def get(self):
        businesses = db.collection("businesses").stream()
        result = []
        for business in businesses:
            singleBusDict = Business.fromDict(business.to_dict(), business.id).toDict()
            result.append(singleBusDict)
        return result

    def post(self):
        businessData = request.json
        busDoc = db.collection("businesses").document()
        toAdd = Business.fromDict(sourceDict=businessData, busID=busDoc.id)
        busDoc.set(toAdd.toDict())
        return busDoc.id


@busApi.route("/<string:businessID>")
class SpecificBusiness(Resource):
    def get(self, businessID):
        business = db.collection("businesses").document(businessID).get()
        if not business.exists:
            return "Error"
        businessDict = business.to_dict()
        businessDict = Business.fromDict(businessDict, businessID).asJson()
        termDocsRef = db.collection("termDocuments").where("businessID", "==", businessID)
        termDocsSnapshot = termDocsRef.stream()
        termDocs = []
        for doc in termDocsSnapshot:
            verifiedTermDocument = TermDocument.fromDict(doc.to_dict(), doc.id).asJson()
            termDocsResponsesSnapshot = db.collection("termDocuments").document(doc.id).collection("responses").stream()
            responsesArr = []
            for response in termDocsResponsesSnapshot:
                verifiedTermDocumentResponse = TermResponse.fromDict(response.to_dict(), response.id).asJson()
                responsesArr.append(verifiedTermDocumentResponse)
            verifiedTermDocument["responses"] = responsesArr
            termDocs.append(verifiedTermDocument)
        businessDict["termDocs"] = termDocs
        print(businessDict)
        return businessDict


@tryApi.route("")
class AllTryvestors(Resource):
    def get(self):
        tryvestors = db.collection("tryvestors").stream()
        result = []
        for tryvestor in tryvestors:
            tryID = tryvestor.id
            tryvestorDict = tryvestor.to_dict()
            singleTryJson = Tryvestor.fromDict(sourceDict=tryvestorDict, tryID=tryID).asJson()
            result.append(singleTryJson)
        return result

    def post(self):
        tryvestorData = request.json
        print(tryvestorData)
        tryDoc = db.collection("tryvestors").document(tryvestorData["uid"])
        tryDocRef = tryDoc.get()
        toAdd = Tryvestor.fromDict(sourceDict=tryvestorData, tryID=tryDoc.id)
        tryDoc.set(toAdd.toDict())
        return tryDoc.id


@tryApi.route("/<string:tryvestorID>")
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()
        tryvestor = Tryvestor.fromDict(sourceDict=tryvestorDict, tryID=tryvestorID).asJson()
        allTermResponses = db.collection_group("responses").where("tryvestorID", "==", tryvestorID).stream()
        responsesArray = []
        """
        Get all responses
        For each response:
            store the verification status
            then go up a level and store: numSharesAward, businessID, refToTermDoc
            then go to the business with given businessID and return business as dict
            then go to termDoc and return term doc as dict
        """
        for termResponseSnapshot in allTermResponses:
            toAdd = {}
            termResponse = TermResponse.fromDict(sourceDict=termResponseSnapshot.to_dict(),
                                                 termResponseID=termResponseSnapshot.id)
            termDocumentSnapshotInter = termResponseSnapshot.reference
            termDocumentSnapshot = termDocumentSnapshotInter.parent.parent.get()
            termDocument = TermDocument.fromDict(sourceDict=termDocumentSnapshot.to_dict(),
                                                 termDocID=termDocumentSnapshot.id)
            businessSnapshot = db.collection("businesses").document(termDocument.businessID).get()
            business = Business.fromDict(sourceDict=businessSnapshot.to_dict(), busID=businessSnapshot.id)
            print("gothere")
            toAdd["termDocument"] = termDocument.asJson()
            toAdd["termResponse"] = termResponse.asJson()
            toAdd["business"] = business.asJson()
            print("gothere")
            # Crucial Information
            numSharesAwarded = (termDocument.numSharesAward if termResponse.verificationStatus == 1 else 0)
            percentBusinessOwned = float(numSharesAwarded) / float(business.totalShares) * 100
            valueSharesAwarded = percentBusinessOwned / 100 * business.valuation
            businessName = business.name
            businessLogoLink = business.logo
            print("gothere")
            # Summary info that they will most likely use
            summaryInfo = {
                "numSharesAwarded": numSharesAwarded,
                "valueShares": valueSharesAwarded,
                "percentBusinessOwned": percentBusinessOwned,
                "businessName": businessName,
                "businessLogoLink": businessLogoLink,
                "verificationStatus": termResponse.verificationStatus
            }
            toAdd["summaryInfo"] = summaryInfo
            responsesArray.append(toAdd)
        tryvestor["responses"] = responsesArray
        return tryvestor


@busApi.route("/termDocuments/verifyResponse")
class VerifyResponse(Resource):
    def put(self):
        responseUpdateData = request.json
        responseDocArray = db.collection("termDocuments").document(responseUpdateData["termDocID"]).collection(
            "responses").where("tryvestorID", "==", responseUpdateData["tryvestorID"]).stream()
        responseDoc = list(responseDocArray)[0].reference
        responseDoc.update({"verificationStatus": responseUpdateData["newStatus"]})

    def get(self):
        termDocID = request.args.get("termDocID")
        tryvestorID = request.args.get("tryvestorID")
        print(termDocID)
        print(tryvestorID)
        responseDocArray = db.collection("termDocuments").document(termDocID).collection(
            "responses").where("tryvestorID", "==", tryvestorID).stream()
        toReturn = []
        for response in responseDocArray:
            cleanedResponse = TermResponse.fromDict(response.to_dict(), response.id).asJson()
            toReturn.append(cleanedResponse)
        return toReturn


@busApi.route("/termDocuments/responses")
class TermDocumentUsers(Resource):
    def post(self):
        termDocUpdateData = request.json
        username = termDocUpdateData["username"]
        userDocSnapshot = db.collection("tryvestors").where("username", "==", username).stream()
        termDocResponses = db.collection("termDocuments").document(termDocUpdateData["termDocID"]).collection(
            "responses")
        userDocID = list(userDocSnapshot)[0].id
        dateCreated, response = termDocResponses.add({
            "tryvestorID": userDocID,
            "verificationStatus": 0,
            "creationDate": datetime.datetime.now()
        })
        return response.id

    @api.doc(params={"termDocID": {"description": "firestore document id of term doc", "type": "String"}})
    def get(self):
        termDocID = request.args.get("termDocID")
        termDocResponses = db.collection("termDocuments").document(termDocID).collection("responses").stream()
        returnableResponses = []
        for response in termDocResponses:
            cleanedResponse = TermResponse.fromDict(response.to_dict(), response.id).asJson()
            returnableResponses.append(cleanedResponse)
        return returnableResponses


@tryApi.route("/byUsername")
class UserByUsername(Resource):
    @api.doc(params={"username": {"description": "username of the user (likely email)", "type": "String"}})
    def get(self):
        inputUsername = request.args.get("username")
        users = db.collection("tryvestors").where("username", "==", inputUsername).get()
        toReturn = []
        for doc in users:
            cleanedTryvestor = Tryvestor.fromDict(doc.to_dict(), doc.id).asJson()
            toReturn.append(cleanedTryvestor)
        return toReturn[0]


@busApi.route("/termDocuments/results")
class ResultsLink(Resource):
    @api.doc(params={
        "businessID": {"description": "Firebase document id of the business to get results", "type": "String"},
        "termDocNum": {"description": "Starting at 1, which task do you want for the business", "type": "Integer"}
                     })
    def get(self):
        busID = request.args.get("businessID")
        termDocNum = int(request.args.get("termDocNum"))
        termDocs = db.collection("termDocuments").where("businessID", "==", busID).order_by("creationDate").stream()
        termDocDict = list(termDocs)[termDocNum - 1].to_dict()
        return termDocDict["resultsLink"]


@busApi.route("/termDocuments")
class TermDocuments(Resource):
    def post(self):
        termDocData = request.json
        termDoc = db.collection("termDocuments").document()
        toAdd = TermDocument.fromDict(sourceDict=termDocData, termDocID=termDoc.id).toDict()
        toAdd["creationDate"] = datetime.datetime.now()
        termDoc.set(toAdd)
        return termDoc.id


if __name__ == "__main__":
    app.run(port=5000)
