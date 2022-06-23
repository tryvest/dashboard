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
    def __init__(self, businessID, name, description, topics, valuation, totalShares, media, logo, tagline):
        self.tagline = tagline
        self.logo = logo
        self.media = media
        self.totalShares = totalShares
        self.valuation = valuation
        self.topics = topics
        self.description = description
        self.name = name
        self.businessID = businessID

    @staticmethod
    def fromDict(sourceDict, businessID):
        return Business(
            tagline=str(sourceDict["tagline"]),
            logo=str(sourceDict["logo"]),
            media=sourceDict["media"],
            totalShares=float(sourceDict["totalShares"]),
            valuation=float(sourceDict["valuation"]),
            topics=sourceDict["topics"],
            description=str(sourceDict["description"]),
            name=str(sourceDict["name"]),
            businessID=str(businessID)
        )

    def toFirebaseDict(self):
        return {
            "name": self.name,
            "description": self.description,
            "topics": self.topics,
            "valuation": self.valuation,
            "totalShares": self.totalShares,
            "media": self.media,
            "logo": self.logo,
            "tagline": self.tagline,
        }

    def toDict(self):
        toReturn = self.toFirebaseDict()
        toReturn["businessID"] = self.businessID
        return toReturn


class TermDocument:
    def __init__(self, termDocumentID, formLink, description, resultsLink, businessID, numSharesAward, title):
        self.termDocumentID = termDocumentID
        self.formLink = formLink
        self.description = description
        self.resultsLink = resultsLink
        self.businessID = businessID
        self.numSharesAward = numSharesAward
        self.title = title

    @staticmethod
    def fromDict(sourceDict, termDocumentID):
        return TermDocument(
            formLink=str(sourceDict["formLink"]),
            description=str(sourceDict["description"]),
            resultsLink=str(sourceDict["resultsLink"]),
            businessID=str(sourceDict["businessID"]),
            numSharesAward=float(sourceDict["numSharesAward"]),
            termDocumentID=str(termDocumentID),
            title=str(sourceDict["title"])
        )

    def toFirebaseDict(self):
        return {
            "businessID": self.businessID,
            "description": self.description,
            "numSharesAward": float(self.numSharesAward),
            "formLink": self.formLink,
            "resultsLink": self.resultsLink,
            "title": self.title
        }

    def toDict(self):
        toReturn = self.toFirebaseDict()
        toReturn["termDocumentID"] = self.termDocumentID
        return toReturn


class TermResponse:
    def __init__(self, tryvestorID, verificationStatus, termResponseID):
        self.tryvestorID = tryvestorID
        self.verificationStatus = verificationStatus
        self.termResponseID = termResponseID

    @staticmethod
    def fromDict(sourceDict, termResponseID):
        return TermResponse(
            termResponseID=str(termResponseID),
            tryvestorID=str(sourceDict["tryvestorID"]),
            verificationStatus=int(sourceDict["verificationStatus"]),
        )

    def toFirebaseDict(self):
        return {
            "tryvestorID": self.tryvestorID,
            "verificationStatus": self.verificationStatus,
        }

    def toDict(self):
        toReturn = self.toFirebaseDict()
        toReturn["termResponseID"] = self.termResponseID
        return toReturn


class Tryvestor:
    def __init__(self, tryvestorID, firstName, lastName, username, interests):
        self.tryvestorID = tryvestorID
        self.firstName = firstName
        self.lastName = lastName
        self.username = username
        self.interests = interests

    @staticmethod
    def fromDict(sourceDict, tryvestorID):
        return Tryvestor(
            tryvestorID=str(tryvestorID),
            firstName=str(sourceDict["firstName"]),
            lastName=str(sourceDict["lastName"]),
            username=str(sourceDict["username"]),
            interests=sourceDict["interests"]
        )

    def toFirebaseDict(self):
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "username": self.username,
            "interests": self.interests,
        }

    def toDict(self):
        toReturn = self.toFirebaseDict()
        toReturn["tryvestorID"] = self.tryvestorID
        return toReturn


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
        toAdd = Business.fromDict(sourceDict=businessData, businessID=busDoc.id).toFirebaseDict()
        toAdd["creationDate"] = datetime.datetime.now()
        busDoc.set(toAdd)
        return busDoc.id


@busApi.route("/<string:businessID>")
class SpecificBusiness(Resource):
    def get(self, businessID):
        business = db.collection("businesses").document(businessID).get()
        if not business.exists:
            return "Error"
        businessDict = business.to_dict()
        businessDict = Business.fromDict(businessDict, businessID).toDict()
        termDocsRef = db.collection("termDocuments").where("businessID", "==", businessID)
        termDocsSnapshot = termDocsRef.stream()
        termDocs = []
        for doc in termDocsSnapshot:
            verifiedTermDocument = TermDocument.fromDict(doc.to_dict(), doc.id).toDict()
            termDocsResponsesSnapshot = db.collection("termDocuments").document(doc.id).collection("responses").stream()
            responsesArr = []
            for response in termDocsResponsesSnapshot:
                verifiedTermDocumentResponse = TermResponse.fromDict(response.to_dict(), response.id).toDict()
                responsesArr.append(verifiedTermDocumentResponse)
            verifiedTermDocument["responses"] = responsesArr
            termDocs.append(verifiedTermDocument)
        businessDict["termDocuments"] = termDocs
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
            singleTryJson = Tryvestor.fromDict(sourceDict=tryvestorDict, tryvestorID=tryID).toDict()
            result.append(singleTryJson)
        return result

    def post(self):
        tryvestorData = request.json
        tryDoc = db.collection("tryvestors").document(tryvestorData["uid"])
        toAdd = Tryvestor.fromDict(sourceDict=tryvestorData, tryvestorID=tryDoc.id).toFirebaseDict()
        toAdd["creationDate"] = datetime.datetime.now()
        tryDoc.set(toAdd)
        return tryDoc.id


@tryApi.route("/<string:tryvestorID>")
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()
        tryvestor = Tryvestor.fromDict(sourceDict=tryvestorDict, tryvestorID=tryvestorID).toDict()
        allTermResponses = db.collection_group("responses").where("tryvestorID", "==", tryvestorID).stream()
        businessesRespondedToArr = []
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

            # Term response both as a term response object and a dictionary
            termResponse = TermResponse.fromDict(sourceDict=termResponseSnapshot.to_dict(),
                                                 termResponseID=termResponseSnapshot.id)
            termResponseDict = termResponse.toDict()

            # Term document both as a term document object and a dictionary
            termResponseRef = termResponseSnapshot.reference
            termDocumentSnapshot = termResponseRef.parent.parent.get()
            termDocument = TermDocument.fromDict(sourceDict=termDocumentSnapshot.to_dict(),
                                                 termDocumentID=termDocumentSnapshot.id)
            termDocumentDict = termDocument.toDict()

            # Business both as a business object and a dictionary
            businessSnapshot = db.collection("businesses").document(termDocument.businessID).get()
            business = Business.fromDict(sourceDict=businessSnapshot.to_dict(), businessID=businessSnapshot.id)
            businessDict = business.toDict()

            # Make the response into a termDocument with nested response
            termDocumentDict["termResponse"] = termResponseDict

            # Get the business index if it exists
            indexOfBusiness = -1
            for numIndex, alreadyAddedBus in enumerate(businessesRespondedToArr):
                if business.businessID == alreadyAddedBus["businessID"]:
                    indexOfBusiness = numIndex
                    break

            statusOfTasks = termResponse.verificationStatus

            # Add and/or append termDocuments based on if the business already exists + update summary information
            if indexOfBusiness == -1:
                businessDict["termDocuments"] = [termDocumentDict]
                numSharesAwarded = termDocument.numSharesAward if termResponse.verificationStatus == 1 else 0
                numSharesPending = termDocument.numSharesAward if termResponse.verificationStatus == 0 else 0
                numSharesRejected = termDocument.numSharesAward if termResponse.verificationStatus == -1 else 0
                businessDict["interactionSummaryInfo"] = {
                    "numSharesAwarded": numSharesAwarded,
                    "numSharesPending": numSharesPending,
                    "numSharesRejected": numSharesRejected,
                    "valuePerShare": (float(business.valuation) / float(business.totalShares)),
                    "percentBusinessOwned": float(numSharesAwarded) / float(business.totalShares),
                    "businessName": business.name,
                    "businessLogoLink": business.logo,
                    "statusOfTasks": statusOfTasks
                }
                businessesRespondedToArr.append(businessDict)
                indexOfBusiness = len(businessesRespondedToArr) - 1
                print("Business Added Index" + str(indexOfBusiness))
                print("Business Added Verification Status" + str(statusOfTasks))
            else:
                # Add the term document to the businesses responded to array
                businessesRespondedToArr[indexOfBusiness]["termDocuments"].append(termDocumentDict)

                # Update the interactionSummaryInfo field of this particular business using newly added term document
                numSharesAwarded = termDocument.numSharesAward if termResponse.verificationStatus == 1 else 0
                numSharesPending = termDocument.numSharesAward if termResponse.verificationStatus == 0 else 0
                numSharesRejected = termDocument.numSharesAward if termResponse.verificationStatus == -1 else 0
                tempBusInteractionInfo = businessesRespondedToArr[indexOfBusiness]["interactionSummaryInfo"]
                print("Business Edited Index" + str(indexOfBusiness))
                print("Business Edited Verification Status Before" + str(statusOfTasks))
                busInteractionInfo = {
                    "numSharesAwarded": int(tempBusInteractionInfo["numSharesAwarded"]) + numSharesAwarded,
                    "numSharesPending": int(tempBusInteractionInfo["numSharesPending"]) + numSharesPending,
                    "numSharesRejected": int(tempBusInteractionInfo["numSharesRejected"]) + numSharesRejected,
                    "valuePerShare": (float(business.valuation) / float(business.totalShares)),
                    "percentBusinessOwned": float(int(tempBusInteractionInfo["numSharesAwarded"]) + numSharesAwarded)
                                            / float(business.totalShares),
                    "businessName": business.name,
                    "businessLogoLink": business.logo,
                    "statusOfTasks": 0 if statusOfTasks == 0 else tempBusInteractionInfo["statusOfTasks"]
                }
                print("Business Edited Verification Status After" + str(busInteractionInfo["statusOfTasks"]))
                businessesRespondedToArr[indexOfBusiness]["interactionSummaryInfo"] = busInteractionInfo
        tryvestor["businessesRespondedTo"] = businessesRespondedToArr
        return tryvestor

        '''
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
'''


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
            cleanedResponse = TermResponse.fromDict(response.to_dict(), response.id).toDict()
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
        newResponse = TermResponse.fromDict({
            "tryvestorID": userDocID,
            "verificationStatus": 0,
        }, "FillerID").toFirebaseDict()
        newResponse["creationDate"] = datetime.datetime.now()
        dateCreated, response = termDocResponses.add(newResponse)
        return response.id

    @api.doc(params={"termDocID": {"description": "firestore document id of term doc", "type": "String"}})
    def get(self):
        termDocID = request.args.get("termDocID")
        termDocResponses = db.collection("termDocuments").document(termDocID).collection("responses").stream()
        returnableResponses = []
        for response in termDocResponses:
            cleanedResponse = TermResponse.fromDict(response.to_dict(), response.id).toDict()
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
            cleanedTryvestor = Tryvestor.fromDict(doc.to_dict(), doc.id).toDict()
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
        toAdd = TermDocument.fromDict(sourceDict=termDocData, termDocumentID=termDoc.id).toFirebaseDict()
        toAdd["creationDate"] = datetime.datetime.now()
        termDoc.set(toAdd)
        return termDoc.id


if __name__ == "__main__":
    app.run(port=5000)
