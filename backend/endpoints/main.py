from datetime import datetime, date, timezone
from flask import Flask, request
from flask_restx import Api, Resource, fields
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# from dateutils import datetime as dtime
# from dateutils import date as dt

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
datetime.fromisoformat("2022-07-06T10:36:43.916642-08:00").astimezone(timezone.utc)

# print(db.collection('tryvestors').document('0cx8CV21EwfuyX8vRYvobkyIMWo2').update({
#     'dateOfBirth': datetime.now(timezone.utc)
# }))

class GenericUser:
    def __init__(self, userType, userID):
        self.userType = userType
        self.userID = userID

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userID):
        return GenericUser(
            userType=sourceDict["userType"],
            userID=userID,
        )

    def writeToFirebaseFormat(self):
        return {
            'userType': self.userType,
        }

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn['userID'] = self.userID
        return toReturn


class Business:
    def __init__(self, businessID, name, description, topics, valuation, totalShares, media, logo, tagline, investors,
                 targetMarket, funding, channelID, serverID, creationDate, tryvestors):
        self.tagline = tagline
        self.logo = logo
        self.media = media
        self.totalShares = totalShares
        self.valuation = valuation
        self.topics = topics
        self.description = description
        self.name = name
        self.businessID = businessID
        self.investors = investors
        self.targetMarket = targetMarket
        self.funding = funding
        self.channelID = channelID
        self.serverID = serverID
        self.creationDate = creationDate
        self.tryvestors = tryvestors

    @staticmethod
    def readFromFirebaseFormat(sourceDict, businessID):
        return Business(
            tagline=str(sourceDict["tagline"]),
            logo=str(sourceDict["logo"]),
            media=sourceDict["media"],
            totalShares=float(sourceDict["totalShares"]),
            valuation=float(sourceDict["valuation"]),
            topics=sourceDict["topics"],
            description=str(sourceDict["description"]),
            name=str(sourceDict["name"]),
            investors=sourceDict["investors"],
            targetMarket=sourceDict["targetMarket"],
            businessID=str(businessID),
            funding=int(sourceDict["funding"]),
            channelID=str(sourceDict["channelID"]),
            serverID=str(sourceDict["serverID"]),
            creationDate=sourceDict["creationDate"],
            tryvestors=sourceDict["tryvestors"]
        )

    def writeToFirebaseFormat(self):
        return {
            "name": self.name,
            "description": self.description,
            "topics": self.topics,
            "valuation": self.valuation,
            "totalShares": self.totalShares,
            "media": self.media,
            "logo": self.logo,
            "tagline": self.tagline,
            "investors": self.investors,
            "targetMarket": self.targetMarket,
            "funding": self.funding,
            "channelID": self.channelID,
            "serverID": self.serverID,
            'creationDate': self.creationDate,
            'tryvestors': self.tryvestors
        }

    @staticmethod
    def readFromDict(sourceDict, businessID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict["creationDate"])
        return Business.readFromFirebaseFormat(sourceDict, businessID)

    @staticmethod
    def createFromDict(sourceDict, businessID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return Business.readFromDict(sourceDict, businessID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["businessID"] = self.businessID
        return toReturn


class TermDocument:
    def __init__(self, termDocumentID, formLink, description, resultsLink, businessID, numSharesAward, title,
                 creationDate):
        self.termDocumentID = termDocumentID
        self.formLink = formLink
        self.description = description
        self.resultsLink = resultsLink
        self.businessID = businessID
        self.numSharesAward = numSharesAward
        self.title = title
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, termDocumentID):
        return TermDocument(
            formLink=str(sourceDict["formLink"]),
            description=str(sourceDict["description"]),
            resultsLink=str(sourceDict["resultsLink"]),
            businessID=str(sourceDict["businessID"]),
            numSharesAward=float(sourceDict["numSharesAward"]),
            termDocumentID=str(termDocumentID),
            title=str(sourceDict["title"]),
            creationDate=sourceDict['creationDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "businessID": self.businessID,
            "description": self.description,
            "numSharesAward": float(self.numSharesAward),
            "formLink": self.formLink,
            "resultsLink": self.resultsLink,
            "title": self.title,
            "creationDate": self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, termDocumentID):
        sourceDict["creationDate"] = datetime.fromisoformat(sourceDict["creationDate"])
        Business.readFromFirebaseFormat(sourceDict, termDocumentID)

    @staticmethod
    def createFromDict(sourceDict, termDocumentID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return Business.readFromDict(sourceDict, termDocumentID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["termDocumentID"] = self.termDocumentID
        return toReturn


class TermResponse:
    def __init__(self, tryvestorID, verificationStatus, termResponseID, creationDate):
        self.tryvestorID = tryvestorID
        self.verificationStatus = verificationStatus
        self.termResponseID = termResponseID
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, termResponseID):
        return TermResponse(
            termResponseID=str(termResponseID),
            tryvestorID=str(sourceDict["tryvestorID"]),
            verificationStatus=int(sourceDict["verificationStatus"]),
            creationDate=sourceDict["creationDate"]
        )

    def writeToFirebaseFormat(self):
        return {
            "tryvestorID": self.tryvestorID,
            "verificationStatus": self.verificationStatus,
            "creationDate": self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, termResponseID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict["creationDate"])
        return TermResponse.readFromFirebaseFormat(sourceDict, termResponseID)

    @staticmethod
    def createFromDict(sourceDict, termResponseID):
        sourceDict['creationDict'] = datetime.now(timezone.utc).isoformat()
        return TermResponse.readFromDict(sourceDict, termResponseID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["termResponseID"] = self.termResponseID
        return toReturn


class TryvestorAddress:
    def __init__(self, streetAddress, unitNum, city, state, postalCode, country):
        self.streetAddress = streetAddress,
        self.unitNum = unitNum,
        self.city = city,
        self.state = state,
        self.postalCode = postalCode,
        self.country = country

    @staticmethod
    def fromDict(sourceDict):
        return TryvestorAddress(
            streetAddress=str(sourceDict["streetAddress"]),
            unitNum=str(sourceDict["unitNum"]),
            city=str(sourceDict["city"]),
            state=str(sourceDict["state"]),
            postalCode=str(sourceDict["postalCode"]),
            country=str(sourceDict["country"])
        )

    def toDict(self):
        return {
            'streetAddress': self.streetAddress,
            'unitNum': self.unitNum,
            'city': self.city,
            'state': self.state,
            'postalCode': self.postalCode,
            'country': self.country
        }


class Tryvestor:
    def __init__(self, tryvestorID, firstName, lastName, username, age, profilePicture, address,
                 creationDate):
        self.tryvestorID = tryvestorID
        self.firstName = firstName
        self.lastName = lastName
        self.username = username
        self.age = age
        self.profilePicture = profilePicture
        self.address = TryvestorAddress.fromDict(address)
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, tryvestorID):
        return Tryvestor(
            tryvestorID=str(tryvestorID),
            firstName=str(sourceDict["firstName"]),
            lastName=str(sourceDict["lastName"]),
            username=str(sourceDict["username"]),
            age=int(sourceDict["age"]),
            profilePicture=str(sourceDict["profilePicture"]),
            address=sourceDict['address'],
            creationDate=sourceDict['creationDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "username": self.username,
            "age": self.age,
            'profilePicture': self.profilePicture,
            'address': self.address.toDict(),
            'creationDate': self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, tryvestorID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return Tryvestor.readFromFirebaseFormat(sourceDict, tryvestorID)

    @staticmethod
    def createFromDict(sourceDict, tryvestorID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return Tryvestor.readFromDict(sourceDict, tryvestorID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["tryvestorID"] = self.tryvestorID
        return toReturn


@api.route("/userType")
class UserType(Resource):
    @api.doc(
        params={"userID": {"description": "firestore document id of the user you want to check the type of",
                           "type": "String"}}
    )
    def get(self):
        userID = request.args.get("userID")
        userDoc = db.collection('users').document(userID).get()
        toReturn = GenericUser.readFromFirebaseFormat(userDoc.to_dict(), userDoc.id)
        return toReturn.userType


@busApi.route("")  # http://127.0.0.1:5000/api/businesses
class AllBusinesses(Resource):
    def get(self):
        businesses = db.collection("businesses").stream()
        result = []
        for business in businesses:
            singleBusDict = Business.readFromFirebaseFormat(business.to_dict(), business.id).writeToDict()
            result.append(singleBusDict)
        return result

    def post(self):
        businessData = request.json

        genericUserDictForBusiness = {
            'userType': 'business'
        }
        userDoc = db.collection("users").document(businessData["businessID"])
        userFirebaseInfo = GenericUser.readFromFirebaseFormat(sourceDict=genericUserDictForBusiness,
                                                              userID=userDoc.id).writeToFirebaseFormat()
        userDoc.set(userFirebaseInfo)

        busDoc = db.collection("businesses").document(userDoc.id)
        toAdd = Business.createFromDict(sourceDict=businessData, businessID=busDoc.id).writeToFirebaseFormat()
        busDoc.set(toAdd)
        return busDoc.id

    def put(self):
        businessUpdateData = request.json
        businessID = businessUpdateData.pop('businessID')
        busDoc = db.collection('businesses').document(businessID)
        print(businessUpdateData)
        busDoc.update(businessUpdateData)


@busApi.route("/<string:businessID>")
class SpecificBusiness(Resource):
    def get(self, businessID):
        business = db.collection("businesses").document(businessID).get()
        if not business.exists:
            return "Error"
        businessDict = business.to_dict()
        businessObj = Business.readFromFirebaseFormat(businessDict, businessID)
        businessDict = businessObj.writeToDict()
        termDocsRef = db.collection("termDocuments").where("businessID", "==", businessID)
        termDocsSnapshot = termDocsRef.stream()
        termDocs = []
        termDocIDs = []
        termDocIDToObj = {}
        tryvestorsDict = {}
        for tryvestor in businessObj.tryvestors:
            tryvestorsDict[tryvestor] = {
                "completedTasks": [],
                "pendingTasks": [],
                "rejectedTasks": []
            }
        for doc in termDocsSnapshot:
            verifiedTermDocumentObj = TermDocument.readFromFirebaseFormat(doc.to_dict(), doc.id)
            verifiedTermDocument = verifiedTermDocumentObj.writeToDict()
            termDocIDToObj[verifiedTermDocumentObj.termDocumentID] = verifiedTermDocumentObj.writeToDict()
            termDocIDs.append(verifiedTermDocumentObj.termDocumentID)
            termDocsResponsesSnapshot = db.collection("termDocuments").document(doc.id).collection("responses").stream()
            responsesArr = []
            for response in termDocsResponsesSnapshot:
                verifiedTermDocumentResponse = TermResponse.readFromFirebaseFormat(response.to_dict(), response.id)
                verifiedTermDocumentResponseDict = verifiedTermDocumentResponse.writeToDict()
                responsesArr.append(verifiedTermDocumentResponseDict)
                if verifiedTermDocumentResponse.tryvestorID not in tryvestorsDict:
                    tryvestorsDict[verifiedTermDocumentResponse.tryvestorID] = {}
                    tryvestorsDict[verifiedTermDocumentResponse.tryvestorID]["completedTasks"] = []
                    tryvestorsDict[verifiedTermDocumentResponse.tryvestorID]["rejectedTasks"] = []
                if verifiedTermDocumentResponse.verificationStatus == 1:
                    tryvestorsDict[verifiedTermDocumentResponse.tryvestorID]["completedTasks"].append(
                        verifiedTermDocumentObj.termDocumentID)
                if verifiedTermDocumentResponse.verificationStatus == -1:
                    tryvestorsDict[verifiedTermDocumentResponse.tryvestorID]["rejectedTasks"].append(
                        verifiedTermDocumentObj.termDocumentID)
            verifiedTermDocument["responses"] = responsesArr
            termDocs.append(verifiedTermDocument)

        returnTryvestors = []
        allTryvestors = businessObj.tryvestors
        numTotalTryvestors = len(allTryvestors)
        numPendingTryvestors = 0
        totalNumSharesAwarded = 0

        for key in allTryvestors:
            tempCompletedTasks = tryvestorsDict[key]['completedTasks']
            tempRejectedTasks = tryvestorsDict[key]['rejectedTasks']
            returnCompletedTasks = []
            returnRejectedTasks = []
            returnPendingTasks = []
            tempNumSharesAwardCounter = 0
            for termDocID in termDocIDs:
                if termDocID in tempCompletedTasks:
                    returnCompletedTasks.append(termDocIDToObj[termDocID])
                elif termDocID in tempRejectedTasks:
                    returnRejectedTasks.append(termDocIDToObj[termDocID])
                else:
                    returnPendingTasks.append(termDocIDToObj[termDocID])
                tempNumSharesAwardCounter += termDocIDToObj[termDocID]["numSharesAward"]
            tryvestorObjDictRaw = db.collection('tryvestors').document(key).get()
            tryvestorObjDictVerified = Tryvestor.readFromFirebaseFormat(tryvestorObjDictRaw.to_dict(),
                                                                        tryvestorObjDictRaw.id)
            tempTryvestorObj = {
                "tryvestorObj": tryvestorObjDictVerified.writeToDict(),
                "completedTasks": returnCompletedTasks,
                "pendingTasks": returnPendingTasks,
                "rejectedTasks": returnRejectedTasks,
                "verificationStatus": 0 if (len(returnPendingTasks) > 0 or len(returnRejectedTasks) > 0) else 1,
            }
            if tempTryvestorObj["verificationStatus"] == 1:
                totalNumSharesAwarded += tempNumSharesAwardCounter
            else:
                numPendingTryvestors += 1
            returnTryvestors.append(tempTryvestorObj)

        tryvestorSummaryInfo = {
            "numTotalTryvestors": numTotalTryvestors,
            "numPendingTryvestors": numPendingTryvestors,
            "numSharesIssued": totalNumSharesAwarded,
        }
        businessDict["termDocuments"] = termDocs
        businessDict["tryvestors"] = returnTryvestors
        businessDict["tryvestorSummaryInfo"] = tryvestorSummaryInfo
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
            singleTryJson = Tryvestor.readFromFirebaseFormat(sourceDict=tryvestorDict, tryvestorID=tryID).writeToDict()
            result.append(singleTryJson)
        return result

    def post(self):
        tryvestorData = request.json

        genericUserDictForTryvestor = {
            'userType': 'tryvestor'
        }
        userDoc = db.collection("users").document(tryvestorData["tryvestorID"])
        userFirebaseInfo = GenericUser.readFromFirebaseFormat(sourceDict=genericUserDictForTryvestor,
                                                              userID=userDoc.id).writeToFirebaseFormat()
        userDoc.set(userFirebaseInfo)

        tryDoc = db.collection("tryvestors").document(tryvestorData["tryvestorID"])
        toAdd = Tryvestor.createFromDict(sourceDict=tryvestorData, tryvestorID=tryDoc.id).writeToFirebaseFormat()
        tryDoc.set(toAdd)
        return tryDoc.id

    def put(self):
        tryvestorUpdateData = request.json
        tryvestorID = tryvestorUpdateData.pop('tryvestorID')
        busDoc = db.collection('tryvestors').document(tryvestorID)
        print(tryvestorUpdateData)
        busDoc.update(tryvestorUpdateData)


@tryApi.route("/<string:tryvestorID>")
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()
        tryvestor = Tryvestor.readFromFirebaseFormat(sourceDict=tryvestorDict, tryvestorID=tryvestorID).writeToDict()
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
            termResponse = TermResponse.readFromFirebaseFormat(sourceDict=termResponseSnapshot.to_dict(),
                                                               termResponseID=termResponseSnapshot.id)
            termResponseDict = termResponse.writeToDict()

            # Term document both as a term document object and a dictionary
            termResponseRef = termResponseSnapshot.reference
            termDocumentSnapshot = termResponseRef.parent.parent.get()
            termDocument = TermDocument.readFromFirebaseFormat(sourceDict=termDocumentSnapshot.to_dict(),
                                                 termDocumentID=termDocumentSnapshot.id)
            termDocumentDict = termDocument.writeToDict()

            # Business both as a business object and a dictionary
            businessSnapshot = db.collection("businesses").document(termDocument.businessID).get()
            business = Business.readFromFirebaseFormat(sourceDict=businessSnapshot.to_dict(), businessID=businessSnapshot.id)
            businessDict = business.writeToDict()

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
            cleanedResponse = TermResponse.readFromFirebaseFormat(response.to_dict(), response.id).writeToDict()
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
        newResponse = TermResponse.createFromDict({
            "tryvestorID": userDocID,
            "verificationStatus": 0,
        }, "FillerID").writeToFirebaseFormat()
        dateCreated, response = termDocResponses.add(newResponse)
        return response.id

    @api.doc(params={"termDocID": {"description": "firestore document id of term doc", "type": "String"}})
    def get(self):
        termDocID = request.args.get("termDocID")
        termDocResponses = db.collection("termDocuments").document(termDocID).collection("responses").stream()
        returnableResponses = []
        for response in termDocResponses:
            cleanedResponse = TermResponse.readFromFirebaseFormat(response.to_dict(), response.id).writeToDict()
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
            cleanedTryvestor = Tryvestor.readFromFirebaseFormat(doc.to_dict(), doc.id).writeToDict()
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
        toAdd = TermDocument.createFromDict(sourceDict=termDocData, termDocumentID=termDoc.id).writeToFirebaseFormat()
        termDoc.set(toAdd)
        return termDoc.id


if __name__ == "__main__":
    app.run(port=5000)
