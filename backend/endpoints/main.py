from datetime import datetime, timezone, time
from dateutil.relativedelta import relativedelta

from flask import Flask, request
from flask_restx import Api, Resource, fields
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# Universal Data Model Imports
from dataModels.businesses.Campaign import Campaign
from dataModels.universal.Category import Category
from dataModels.universal.GenericUser import GenericUser

# Tryvestor Data Model Imports
from dataModels.tryvestors.Loyalty import Loyalty, defaultLoyaltiesBusinessesByCategory
from dataModels.tryvestors.UserInstitution import UserInstitution
from dataModels.tryvestors.UserTransaction import UserTransaction
from dataModels.tryvestors.TryvestorWithAddress import Tryvestor, TryvestorAddress, encryptSSN

# Business Data Model Imports
from dataModels.businesses.Business import Business, encryptEIN
from dataModels.businesses.BusinessInstitution import BusinessInstitution

from random import randint, choice

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


# Categories
@api.route("/categories")
class Categories(Resource):
    def get(self):
        allCategories = Categories.getAllCategoriesHelper()
        return allCategories

    def post(self):
        categoryData = request.json
        categoryDoc = db.collection("categories").document()
        categoryData["categoryName"] = categoryData["categoryName"].lower()
        cleanedCategory = Category.createFromDict(categoryData, categoryDoc.id).writeToFirebaseFormat()
        categoryDoc.set(cleanedCategory)

    @staticmethod
    def getAllCategoriesHelper():
        categories = db.collection('categories').get()
        toReturn = []
        for category in categories:
            cleanedCategory = Category.readFromFirebaseFormat(category.to_dict(), category.id).writeToDict()
            toReturn.append(cleanedCategory)
        return toReturn


@busApi.route("")  # http://127.0.0.1:5000/api/businesses
class AllBusinesses(Resource):
    def get(self):
        sortBy = request.args.get("sortBy")
        allBusinesses = AllBusinesses.getAllBusinessesHelper()

        if sortBy == "category":
            return AllBusinesses.organizeBusinessesByCategoryHelper(allBusinesses)

        # default return all
        return allBusinesses

    def post(self):
        businessData = request.json

        genericUserDictForBusiness = {
            'userType': 'business'
        }
        userDoc = db.collection("users").document(businessData["businessID"])
        userFirebaseInfo = GenericUser.readFromFirebaseFormat(sourceDict=genericUserDictForBusiness,
                                                              userID=userDoc.id).writeToFirebaseFormat()
        userDoc.set(userFirebaseInfo)

        # Encrypt EIN
        businessData["EIN"] = encryptEIN(businessData["EIN"])

        busDoc = db.collection("businesses").document(userDoc.id)
        toAdd = Business.createFromDict(sourceDict=businessData, businessID=busDoc.id).writeToFirebaseFormat()
        busDoc.set(toAdd)
        return busDoc.id

    @staticmethod
    def getAllBusinessesHelper():
        businesses = db.collection("businesses").stream()
        toReturn = []
        for business in businesses:
            singleBusDict = Business.readFromFirebaseFormat(business.to_dict(), business.id).writeToDict()
            toReturn.append(singleBusDict)
        return toReturn

    @staticmethod
    def organizeBusinessesByCategoryHelper(allBusinesses):
        # Initializing return object
        businessesByCategory = {}

        # Populating return object with arrays for each cateogry that exists
        categories = db.collection('categories').get()
        for category in categories:
            cleanedCategory = Category.readFromFirebaseFormat(category.to_dict(), category.id)
            businessesByCategory[cleanedCategory.categoryID] = []

        # Reading through all businesses and organizing them by categoryID
        for business in allBusinesses:
            businessAsObj = Business.readFromDict(business, business["businessID"])
            businessesByCategory[businessAsObj.categoryID].append(businessAsObj.writeToDict())

        # Return grouped Stuff
        return businessesByCategory


@busApi.route("/<string:businessID>")
class SpecificBusiness(Resource):
    def get(self, businessID):
        # Reading Business data from Firebase
        business = db.collection("businesses").document(businessID).get()
        if not business.exists:
            return "Error"
        businessDict = business.to_dict()

        # Filtering the business demographics data
        businessObj = Business.readFromFirebaseFormat(businessDict, businessID)
        businessDict = businessObj.writeToDict()

        return businessDict

    def patch(self, businessID):
        businessUpdateData = request.json
        busDoc = db.collection('businesses').document(businessID)
        print(businessUpdateData)
        busDoc.update(businessUpdateData)


@busApi.route("/<string:businessID>/campaigns")
class SpecificBusinessCampaigns(Resource):
    def get(self, businessID):
        toReturn = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(businessID)
        return toReturn

    def post(self, businessID):
        campaignData = request.json
        campaignDoc = db.collection("businesses").document(businessID).collection("campaigns").document()
        cleanedCampaign = Campaign.createFromDict(campaignData, campaignDoc.id).writeToFirebaseFormat()
        campaignDoc.set(cleanedCampaign)
        return campaignDoc.id

    @staticmethod
    def returnAllCampaignsForSpecificBusiness(businessID):
        campaigns = db.collection("businesses").document(businessID).collection("campaigns").order_by('startDate',
                                                                                                      direction=firestore.Query.DESCENDING).get()
        toReturn = []
        for campaign in campaigns:
            toReturn.append(Campaign.readFromFirebaseFormat(campaign.to_dict(), campaign.id).writeToDict())
        return toReturn


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
        # Initializing data for tryvestor post request
        tryvestorData = request.json

        # Making the generic user object and setting in firebase
        genericUserDictForTryvestor = {
            'userType': 'tryvestor'
        }
        userDoc = db.collection("users").document(tryvestorData["UID"])
        userFirebaseInfo = GenericUser.readFromFirebaseFormat(sourceDict=genericUserDictForTryvestor,
                                                              userID=userDoc.id).writeToFirebaseFormat()
        userDoc.set(userFirebaseInfo)

        # Making the tryvestor document using the provided Tryvestor UID and setting the doc with the data
        tryDoc = db.collection("tryvestors").document(tryvestorData["UID"])
        cleanedTryvestor = Tryvestor.createFromDict(sourceDict=tryvestorData, tryvestorID=tryDoc.id)
        tryDoc.set(cleanedTryvestor.writeToFirebaseFormat())

        # Setting the default loyalties for all categories and initializing array of history of loyalties
        categories = Categories.getAllCategoriesHelper()
        selectedLoyaltiesByCategory = {}
        for category in categories:
            categoryID = category["categoryID"]

            # Getting all businesses organized by category
            allBusinesses = AllBusinesses.getAllBusinessesHelper()
            allBusinessesByCategory = AllBusinesses.organizeBusinessesByCategoryHelper(allBusinesses)

            # Finding the business ID, if we have one set then good, otherwise choose a random business:
            if defaultLoyaltiesBusinessesByCategory.get(categoryID) is not None:
                businessID = defaultLoyaltiesBusinessesByCategory[categoryID]
            else:
                businessID = choice(allBusinessesByCategory[categoryID])

            # Finding the most recent campaign for a business
            campaignsForBusiness = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(businessID)
            campaignID = campaignsForBusiness[0]["campaignID"]

            # Making it so user can immediately change loyalty, and adding a loyalty per category
            sourceDict = {
                "businessID": businessID,
                "categoryID": categoryID,
                "campaignID": campaignID,
                "unlockDate": datetime.now(timezone.utc).isoformat(),
                "endDate": None
            }
            loyaltyDoc = tryDoc.collection("loyalties").document()
            newLoyalty = Loyalty.createFromDict(sourceDict, loyaltyDoc.id)
            selectedLoyaltiesByCategory[categoryID] = [newLoyalty.writeToDict()]
            loyaltyDoc.set(newLoyalty.writeToFirebaseFormat())

        tryvestorToReturn = cleanedTryvestor.writeToDict()
        tryvestorToReturn["selectedLoyaltiesByCategory"] = selectedLoyaltiesByCategory
        return tryvestorToReturn


@tryApi.route("/<string:tryvestorID>")
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        # Getting data from firebase
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()

        # Converting / filtering the base demographic data of tryvestor
        tryvestor = Tryvestor.readFromFirebaseFormat(sourceDict=tryvestorDict, tryvestorID=tryvestorID).writeToDict()
        return tryvestor

    def patch(self, tryvestorID):
        tryvestorUpdateData = request.json
        # If updating address, making sure it's formatted properly
        if tryvestorUpdateData.get("address") is not None:
            tryvestorUpdateData["address"] = TryvestorAddress.fromDict(tryvestorUpdateData["address"]).toDict()

        # If updating SSN, encrypting it using the encryptSSN function
        if tryvestorUpdateData.get("SSN") is not None:
            prefix, suffix = encryptSSN(tryvestorUpdateData["SSN"])
            tryvestorUpdateData["SSNPrefix"] = prefix
            tryvestorUpdateData["SSNSuffix"] = suffix

        tryDoc = db.collection('tryvestors').document(tryvestorID)
        tryDoc.update(tryvestorUpdateData)


@tryApi.route("/<string:tryvestorID>/loyalties")
class SpecificTryvestorLoyalties(Resource):
    def get(self, tryvestorID):
        print(tryvestorID)
        loyalties = db.collection("tryvestors").document(tryvestorID).collection("loyalties").order_by('creationDate',
                                                                            direction=firestore.Query.DESCENDING).get()
        toReturn = []
        for loyalty in loyalties:
            toReturn.append(Loyalty.readFromFirebaseFormat(loyalty.to_dict(), loyalty.id).writeToDict())
        return toReturn

    def post(self, tryvestorID):
        # Initializing data dict and making firestore doc
        loyaltyData = request.json
        loyaltyDoc = db.collection("tryvestors").document(tryvestorID).collection("loyalties").document()

        # Setting unlock and end dates appropriately
        defaultTimeBeforeUnlock = relativedelta(months=3)
        loyaltyData['unlockDate'] = datetime.combine(datetime.now(timezone.utc).date() + defaultTimeBeforeUnlock,
                                                     time(), tzinfo=timezone.utc).isoformat()
        loyaltyData['endDate'] = None

        # Cleaning loyalty data, updating the doc, and returning the created cleanedLoyalty object upon success
        cleanedLoyalty = Loyalty.createFromDict(loyaltyData, loyaltyDoc.id)
        loyaltyDoc.set(cleanedLoyalty.writeToFirebaseFormat())
        return cleanedLoyalty.writeToDict()


@tryApi.route("/byUsername")
class UserIDByUsername(Resource):
    @api.doc(params={"username": {"description": "username of the user (likely email)", "type": "String"}})
    def get(self):
        inputUsername = request.args.get("username")
        users = db.collection("tryvestors").where("username", "==", inputUsername).get()
        toReturn = []
        for doc in users:
            cleanedTryvestor = Tryvestor.readFromFirebaseFormat(doc.to_dict(), doc.id).writeToDict()
            toReturn.append(cleanedTryvestor)
        return toReturn[0]["tryvestorID"]


def fixTryvestors():
    allTryvestors = db.collection('tryvestors').get()
    for tryvestorDoc in allTryvestors:
        tryDict = tryvestorDoc.to_dict()
        print(tryDict['address'])
        # tryDict['DOB'] = datetime.fromisoformat(datetime.combine(datetime.now(tz=timezone.utc).date()
        #   - timedelta(days=365*tryDict["age"]), time(tzinfo=timezone.utc), tzinfo=timezone.utc).isoformat())
        pre, suf = encryptSSN(str(randint(100000000, 999999999)))
        tryDict['SSNPrefix'] = pre
        tryDict['SSNSuffix'] = suf
        tryDict['SSNVerificationStatus'] = 0
        tryDict['IDVerificationStatus'] = 0
        tryDict["IDLink"] = "http://tryvest.us"
        tryDict["defaultPlaidItemAccessToken"] = None
        fixedTryvestor = Tryvestor.readFromFirebaseFormat(tryDict, tryvestorDoc.id).writeToFirebaseFormat()
        tryvestorDoc.reference.set(fixedTryvestor)


if __name__ == "__main__":
    app.run(port=5000)
