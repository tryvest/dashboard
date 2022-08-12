from datetime import datetime, date, timezone
from flask import Flask, request
from flask_restx import Api, Resource, fields
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# Universal Data Model Imports
from dataModels.universal.Category import Category
from dataModels.universal.GenericUser import GenericUser

# Tryvestor Data Model Imports
from dataModels.tryvestors.Loyalty import Loyalty
from dataModels.tryvestors.UserInstitution import UserInstitution
from dataModels.tryvestors.UserTransaction import UserTransaction
from dataModels.tryvestors.TryvestorWithAddress import Tryvestor, TryvestorAddress

# Business Data Model Imports
from dataModels.businesses.Business import Business
from dataModels.businesses.BusinessInstitution import BusinessInstitution

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
        if tryvestorUpdateData.get("address") is not None:
            tryvestorUpdateData["address"] = TryvestorAddress.fromDict(tryvestorUpdateData["address"]).toDict()
        tryDoc = db.collection('tryvestors').document(tryvestorID)
        tryDoc.update(tryvestorUpdateData)


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
            business = Business.readFromFirebaseFormat(sourceDict=businessSnapshot.to_dict(),
                                                       businessID=businessSnapshot.id)
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

if __name__ == "__main__":
    app.run(port=5000)
