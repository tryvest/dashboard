import datetime
from flask import Flask, request
from flask_restx import Api, Resource
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

cred = credentials.Certificate("valued-throne-350421-firebase-adminsdk-8of5y-cc6d986bb9.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

flaskApp = Flask(__name__)
CORS(flaskApp)

baseRoute = "/api"
businessRoute = "/businesses"
tryvestorRoute = "/tryvestors"
api = Api(app=flaskApp, prefix=baseRoute)
busApi = api.namespace('businesses', description="For business side requests")
tryApi = api.namespace('tryvestors', description="For tryvestor side requests")


class Business:
    def __init__(self, docID, name, description, topics, valuation, totalShares, termDocuments, media, logo, tagline):
        self.tagline = tagline
        self.logo = logo
        self.media = media
        self.termDocuments = termDocuments
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
            termDocuments=sourceDict["termDocuments"],
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
            "termDocuments": self.termDocuments,
            "media": self.media,
            "logo": self.logo,
            "tagline": self.tagline
        }

    def asJson(self):
        return self.toDict()


class TermDocument:
    def __init__(self, termID, formLink, description, resultsLink, companyID, numSharesAward):
        self.termID = termID
        self.formLink = formLink
        self.description = description
        self.resultsLink = resultsLink
        self.companyID = companyID
        self.numSharesAward = numSharesAward

    @staticmethod
    def fromDict(sourceDict, termDocID):
        return TermDocument(
            formLink=sourceDict['formLink'],
            description=sourceDict['description'],
            resultsLink=sourceDict['resultsLink'],
            companyID=sourceDict['companyID'],
            numSharesAward=sourceDict['numSharesAward'],
            termID=termDocID
        )

    def toDict(self):
        return {
            "companyID": self.companyID,
            "description": self.description,
            "numSharesAward": self.numSharesAward,
            "formLink": self.formLink,
            "resultsLink": self.resultsLink
        }

    def asJson(self):
        return self.toDict()


class TermResponse:
    def __init__(self, tryID, verificationStatus):
        self.tryID = tryID
        self.verificationStatus = verificationStatus

    @staticmethod
    def fromDict(sourceDict, termResponseID):
        return TermResponse(
            tryID=sourceDict['tryvestorID'],
            verificationStatus=sourceDict['verificationStatus'],
        )

    def toDict(self):
        return {
            "tryvestorID": self.tryID,
            "verificationStatus": self.verificationStatus
        }

    def asJson(self):
        return self.toDict()


class Tryvestor:
    def __init__(self, docID, name, username, interests):
        self.docID = docID
        self.name = name
        self.username = username
        self.interests = interests

    @staticmethod
    def fromDict(sourceDict, tryID):
        return Tryvestor(
            docID=tryID,
            name=sourceDict["name"],
            username=sourceDict["username"],
            interests=sourceDict["interests"]
        )

    def toDict(self):
        return {
            "name": self.name,
            "username": self.username,
            "interests": self.interests
        }

    def asJson(self):
        return self.toDict()


@busApi.route("/")  # http://127.0.0.1:5000/api/businesses/
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
        businessData["termDocuments"] = []
        busDoc = db.collection('businesses').document()
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
        result = Business.fromDict(businessDict, businessID)
        return result.asJson()


@tryApi.route("/")
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
        tryDoc = db.collection('tryvestors').document(tryvestorData["uid"])
        toAdd = Tryvestor.fromDict(sourceDict=tryvestorData, tryID=tryDoc.id)
        tryDoc.set(toAdd.toDict())
        return tryDoc.id


@tryApi.route('/<string:tryvestorID>')
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()
        tryvestor = Tryvestor.fromDict(sourceDict=tryvestorDict, tryID=tryvestorID).asJson()
        allTermResponses = db.collection_group("responses").where('tryvestorID', '==', tryvestorID).stream()
        responsesArray = []
        '''
        Get all responses
        For each response:
            store the verification status
            then go up a level and store: numSharesAward, companyID, refToTermDoc
            then go to the company with given companyID and return company as dict
            then go to termDoc and return term doc as dict
        '''
        for termResponseSnapshot in allTermResponses:
            toAdd = {}
            termResponse = TermResponse.fromDict(sourceDict=termResponseSnapshot.to_dict(),
                                                 termResponseID=termResponseSnapshot.id)
            termDocumentSnapshotInter = termResponseSnapshot.reference
            termDocumentSnapshot = termDocumentSnapshotInter.parent.parent.get()
            termDocument = TermDocument.fromDict(sourceDict=termDocumentSnapshot.to_dict(),
                                                 termDocID=termDocumentSnapshot.id)
            businessSnapshot = db.collection('businesses').document(termDocument.companyID).get()
            business = Business.fromDict(sourceDict=businessSnapshot.to_dict(), busID=businessSnapshot.id)
            print('gothere')
            toAdd["termDocument"] = termDocument.asJson()
            toAdd["termResponse"] = termResponse.asJson()
            toAdd["business"] = business.asJson()
            print('gothere')
            # Crucial Information
            numSharesAwarded = (termDocument.numSharesAward if termResponse.verificationStatus == 1 else 0)
            percentCompanyOwned = float(numSharesAwarded) / float(business.totalShares) * 100
            valueSharesAwarded = percentCompanyOwned / 100 * business.valuation
            companyName = business.name
            companyLogoLink = business.logo
            print('gothere')
            # Summary info that they will most likely use
            summaryInfo = {
                "numSharesAwarded": numSharesAwarded,
                "valueShares": valueSharesAwarded,
                "percentCompanyOwned": percentCompanyOwned,
                "companyName": companyName,
                "companyLogoLink": companyLogoLink,
                "verificationStatus": termResponse.verificationStatus
            }
            toAdd["summaryInfo"] = summaryInfo
            responsesArray.append(toAdd)
        tryvestor['responses'] = responsesArray
        return tryvestor


@busApi.route('/termDocuments/verifyResponse')
class VerifyResponse(Resource):
    def put(self):
        responseUpdateData = request.json
        responseDocArray = db.collection('termDocuments').document(responseUpdateData["termDocID"]).collection(
            'responses').where('tryvestorID', '==', responseUpdateData['tryvestorID']).stream()
        responseDoc = list(responseDocArray)[0].reference
        responseDoc.update({'verificationStatus': responseUpdateData["newStatus"]})


@busApi.route('/termDocuments/responses')
class TermDocumentUsers(Resource):
    def post(self):
        termDocUpdateData = request.json
        username = termDocUpdateData['username']
        userDocSnapshot = db.collection('tryvestors').where('username', '==', username).stream()
        termDocResponses = db.collection('termDocuments').document(termDocUpdateData['termDocID']).collection(
            'responses')
        userDocID = list(userDocSnapshot)[0].id
        dateCreated, response = termDocResponses.add({
            'tryvestorID': userDocID,
            'verificationStatus': 0,
            'creationDate': datetime.datetime.now()
        })
        return response.id


@tryApi.route('/byUsername')
class UserByUsername(Resource):
    def get(self):
        inputUsername = request.args.get('username')
        users = db.collection('tryvestors').where('username', '==', inputUsername).get()
        toReturn = []
        for doc in users:
            toReturn.append(doc.to_dict())
        return toReturn


@busApi.route('/termDocuments/results')
class ResultsLink(Resource):
    def get(self):
        busID = request.args.get('businessID')
        termDocNum = int(request.args.get('termDocNum'))
        termDocs = db.collection('termDocuments').where('companyID', '==', busID).order_by('creationDate').stream()
        termDocDict = list(termDocs)[termDocNum - 1].to_dict()
        return termDocDict['resultsLink']


@busApi.route('/termDocuments')
class TermDocuments(Resource):
    def post(self):
        termDocData = request.json
        termDoc = db.collection('termDocuments').document()
        toAdd = TermDocument.fromDict(sourceDict=termDocData, termDocID=termDoc.id).toDict()
        toAdd['creationDate'] = datetime.datetime.now()
        termDoc.set(toAdd)
        return termDoc.id


def mainRunner(innerRequest):
    # Create a new app context for the internal app
    internal_ctx = flaskApp.test_request_context(path=innerRequest.full_path,
                                            method=innerRequest.method)

    # Copy main request data from original request
    # According to your context, parts can be missing. Adapt here!
    internal_ctx.request.data = innerRequest.data
    internal_ctx.request.headers = innerRequest.headers

    # Activate the context
    internal_ctx.push()
    # Dispatch the request to the internal app and get the result
    return_value = flaskApp.full_dispatch_request()
    # Offload the context
    internal_ctx.pop()

    # Return the result of the internal app routing and processing
    return return_value