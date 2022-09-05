from datetime import datetime, timezone, time
from dateutil.relativedelta import relativedelta

from flask import Flask, request
from flask_restx import Api, Resource
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
from plaid.model.transactions_sync_request import TransactionsSyncRequest

# Universal Data Model Imports
from dataModels.businesses.Campaign import Campaign
from dataModels.universal.Category import Category
from dataModels.universal.GenericUser import GenericUser

# Tryvestor Data Model Imports
from dataModels.tryvestors.Loyalty import Loyalty, defaultLoyaltiesBusinessesByCategory
from dataModels.tryvestors.UserItem import UserItem, UserAccount
from dataModels.tryvestors.UserTransaction import UserTransaction
from dataModels.tryvestors.TryvestorWithAddress import Tryvestor, TryvestorAddress, encryptSSN

# Business Data Model Imports
from dataModels.businesses.Business import Business, encryptEIN
from dataModels.businesses.BusinessItem import BusinessItem

# User Types IMport
from dataModels.universal.UserTypes import TRYVESTOR, BUSINESS

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

    @staticmethod
    def getBusinessesByMerchantName(merchantName):
        merchantName = str(merchantName)
        toReturn = db.collection("businesses").where(u'merchantNames', u'array_contains', merchantName).get()
        return toReturn


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
        campaigns = db.collection("businesses").document(businessID).collection("campaigns").order_by(
            'startDate', direction=firestore.Query.DESCENDING).get()
        toReturn = []
        for campaign in campaigns:
            toReturn.append(Campaign.readFromFirebaseFormat(campaign.to_dict(), campaign.id).writeToDict())
        return toReturn


@busApi.route("/<string:businessID>/businessItems")
class SpecificBusinessItems(Resource):
    def get(self, businessID):
        print(businessID)
        businessItems = db.collection("tryvestors").document(businessID).collection("businessItems").order_by(
            'creationDate', direction=firestore.Query.DESCENDING).get()
        toReturn = []
        for businessItem in businessItems:
            toReturn.append(UserItem.readFromFirebaseFormat(businessItem.to_dict(), businessItem.id).writeToDict())
        return toReturn

    @staticmethod
    def addNewBusinessItem(businessItemData):
        # UID extraction
        businessID = businessItemData.pop("UID")

        # Initializing firestore doc
        businessItemDoc = db.collection("businesses").document(businessID).collection("businessItems").document()

        # Cleaning loyalty data, updating the doc, and returning the created cleanedLoyalty object upon success
        cleanedBusinessItem = BusinessItem.createFromDict(businessItemData, businessItemDoc.id)
        businessItemDoc.set(cleanedBusinessItem.writeToFirebaseFormat())
        cleanedBusinessItemReturnDict = cleanedBusinessItem.writeToDict()
        return cleanedBusinessItemReturnDict


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
        selectedLoyaltiesByCategory = AllTryvestors.addingLoyaltiesByCategoryToTryvestor()

        tryvestorToReturn = cleanedTryvestor.writeToDict()
        tryvestorToReturn["selectedLoyaltiesByCategory"] = selectedLoyaltiesByCategory
        return tryvestorToReturn

    @staticmethod
    def addingLoyaltiesByCategoryToTryvestor(tryDoc):
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


@tryApi.route("/<string:tryvestorID>/userItems")
class SpecificTryvestorItems(Resource):
    def get(self, tryvestorID):
        print(tryvestorID)
        userItems = db.collection("tryvestors").document(tryvestorID).collection("userItems").order_by(
            'creationDate', direction=firestore.Query.DESCENDING).get()
        toReturn = []
        for userItem in userItems:
            toReturn.append(UserItem.readFromFirebaseFormat(userItem.to_dict(), userItem.id).writeToDict())
        return toReturn

    @staticmethod
    def addNewUserItem(userItemData):
        # UID extraction
        tryvestorID = userItemData.pop("UID")

        # Initializing firestore doc
        userItemDoc = db.collection("tryvestors").document(tryvestorID).collection("userItems").document()

        # Adding accounts into the user data
        plaidAccessToken = userItemData["plaidAccessToken"]
        allAccounts, plaidInstitutionID = SpecificTryvestorItems.getAccountsForItemAsArray(plaidAccessToken)
        userItemData["userAccounts"] = allAccounts
        userItemData["plaidInstitutionID"] = plaidInstitutionID

        # Cleaning loyalty data, updating the doc, and returning the created cleanedLoyalty object upon success
        cleanedUserItem = UserItem.createFromDict(userItemData, userItemDoc.id) # TODO figuring out why this shit gae
        userItemDoc.set(cleanedUserItem.writeToFirebaseFormat())
        cleanedUserItemReturnDict = cleanedUserItem.writeToDict()
        print("near the return")
        print(cleanedUserItemReturnDict)
        return cleanedUserItemReturnDict

    @staticmethod
    def getAccountsForItemAsArray(plaidAccessToken):
        request = AuthGetRequest(
            access_token=plaidAccessToken
        )
        response = client.auth_get(request)

        plaidInstitutionID = response["item"]["institution_id"]

        accountsArr = []
        for account in response["accounts"]:
            # Fields necessary to make a new account (unwrapped from raw plaid response of an account)
            plaidAccountID = account["account_id"]
            plaidAccountName = account["name"]
            plaidAccountOfficialName = account["official_name"]
            plaidAccountMask = account["mask"]
            plaidAccountSubtype = account["subtype"]
            plaidAccountType = account["type"]

            userAccountDataTemp = {
                "plaidAccountID": plaidAccountID,
                "plaidAccountName": plaidAccountName,
                "plaidAccountOfficialName": plaidAccountOfficialName,
                "plaidAccountMask": plaidAccountMask,
                "plaidAccountSubtype": plaidAccountSubtype,
                "plaidAccountType": plaidAccountType
            }
            userAccountCleaned = UserAccount.createFromDict(userAccountDataTemp).writeToDict()
            accountsArr.append(userAccountCleaned)
        return accountsArr, plaidInstitutionID


    @staticmethod
    def updateUserItemCursor(tryvestorID, userItemID, newCursor):
        userItemDoc = db.collection("tryvestors").document(str(tryvestorID)).collection("userItems").document(
            str(userItemID))
        userItemDoc.update({
            "cursor": str(newCursor)
        })


@tryApi.route("/<string:tryvestorID>/userTransactions")
class SpecificTryvestorTransactions(Resource):
    # Get all of a specific tryvestor's transactions stored in firebase
    def get(self, tryvestorID):
        allUserTransactions = db.collection('tryvestors').document(tryvestorID).collection("userTransactions").stream()
        toReturn = []
        for userTransaction in allUserTransactions:
            userTransactionObj = UserTransaction.readFromFirebaseFormat(
                sourceDict=userTransaction.to_dict(), userTransactionID=userTransaction.id
            )
            cleanedUserTransactionObj = userTransactionObj.writeToDict()
            toReturn.append(cleanedUserTransactionObj)

        return toReturn


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
        # print(tryDict['address'])
        # tryDict['DOB'] = datetime.fromisoformat(datetime.combine(datetime.now(tz=timezone.utc).date()
        #   - timedelta(days=365*tryDict["age"]), time(tzinfo=timezone.utc), tzinfo=timezone.utc).isoformat())
        # pre, suf = encryptSSN(str(randint(100000000, 999999999)))
        # tryDict['SSNPrefix'] = pre
        # tryDict['SSNSuffix'] = suf
        # tryDict['SSNVerificationStatus'] = 0
        # tryDict['IDVerificationStatus'] = 0
        # tryDict["IDLink"] = "http://tryvest.us"
        # tryDict["defaultUserItemID"] = None
        tryDict["defaultUserItemID"] = tryDict["defaultUserItemID"]
        tryDict["DOB"] = datetime.fromisoformat(tryDict["DOB"])
        fixedTryvestor = Tryvestor.readFromFirebaseFormat(tryDict, tryvestorDoc.id).writeToFirebaseFormat()
        tryvestorDoc.reference.set(fixedTryvestor)


# Function for adding default loyalties in existing
def makeTryvestorsHaveDefaultLoyalties():
    allTryvestors = db.collection('tryvestors').get()
    for tryDocSnapshot in allTryvestors:
        existingLoyalties = tryDocSnapshot.collection('loyalties').stream()
        for loyalty in existingLoyalties:
            Loyalty.readFromFirebaseFormat(loyalty.to_dict(), loyalty["loyaltyID"])
        AllTryvestors.addingLoyaltiesByCategoryToTryvestor(tryDocSnapshot.reference)


# Plaid Stuff
import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.auth_get_request import AuthGetRequest
from plaid.api import plaid_api
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
import os
import json
from flask import jsonify
from dotenv import load_dotenv

load_dotenv()

# Fill in your Plaid API keys - https://dashboard.plaid.com/account/keys
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID', "62ef0e6f20b6d70013c6dd0a")
PLAID_SECRET = os.getenv('PLAID_SECRET', "67b72d84fca21565d31219bf20b357")
# Use 'sandbox' to test with Plaid's Sandbox environment (username: user_good,
# password: pass_good)
# Use `development` to test with live users and credentials and `production`
# to go live
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
# PLAID_PRODUCTS is a comma-separated list of products to use when initializing
# Link. Note that this list must contain 'assets' in order for the app to be
# able to create and retrieve asset reports.
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions, auth').split(',')
# PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
# will be able to select institutions from.
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES', 'US, CA').split(',')
PLAID_REDIRECT_URI = None

host = plaid.Environment.Sandbox

if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox

if PLAID_ENV == 'development':
    host = plaid.Environment.Development

if PLAID_ENV == 'production':
    host = plaid.Environment.Production

configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
        'plaidVersion': '2020-09-14'
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

products = []
for product in PLAID_PRODUCTS:
    products.append(Products(product))


@api.route('/plaid/createLinkToken')
class PlaidCreateLinkToken(Resource):
    def post(self):
        try:
            request = LinkTokenCreateRequest(
                products=products,
                client_name="Plaid Quickstart",
                country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(time())
                )
            )
            if PLAID_REDIRECT_URI != None:
                request['redirect_uri'] = PLAID_REDIRECT_URI
            # create link token
            response = client.link_token_create(request)
            response = response.to_dict()

            # Defining the dictionary for the data returned by the plaid API
            returnDict = {
                "expiration": response["expiration"],
                "link_token": response["link_token"],
                "request_id": response["request_id"],
            }
            return jsonify(returnDict)

        except plaid.ApiException as e:
            return json.loads(e.body)

# This route adds items into the firebase - also flushes all transactions
@api.route('/plaid/exchangePublicToken')  # Formerly Named "/set_access_token"
class PlaidExchangePublicToken(Resource):
    def post(self):
        requestData = request.json
        publicToken = requestData["publicToken"]
        userType = requestData["userType"]

        try:
            exchange_request = ItemPublicTokenExchangeRequest(public_token=publicToken)
            exchange_response = client.item_public_token_exchange(exchange_request)
            exchangeAsDict = exchange_response.to_dict()
            exchangeAsDict['isOk'] = True

            addedTransactions, modifiedTransactions, removedTransactions, cursor = \
                PlaidUpdateTransactions.flushTransactions(accessToken=exchangeAsDict['access_token']).values()

            itemDataToAdd = {
                "UID": requestData["UID"],
                "plaidAccessToken": exchangeAsDict["access_token"],
                "plaidItemID": exchangeAsDict["item_id"],
                "plaidRequestID": exchangeAsDict["request_id"],
                "cursor": cursor
            }

            addedItem = {}

            if userType == TRYVESTOR:
                # Calls write to dict on the UserItem obj before returning it to addedItem, so readFromDict is necessary
                addedItem = SpecificTryvestorItems.addNewUserItem(userItemData=itemDataToAdd)
                # Parse the transaction for business information
                addedTrans = PlaidUpdateTransactions.addTransactionsToUser(
                    tryvestorID=requestData["UID"],
                    userItemID=addedItem["userItemID"],
                    transactions=addedTransactions
                )

            # elif userType == BUSINESS:
            #     addedItem = SpecificBusinessItems.addNewBusinessItem(businessItemData=itemDataToAdd)
            #     # addedBusinessItemObj = BusinessItem.readFromDict(sourceDict=addedItem, businessItemID=addedItem[
            #     # "businessItemID"])

            # Setting status isOk to true
            addedItem["isOk"] = True
            return addedItem

        except plaid.ApiException as e:
            return json.loads(e.body)


@api.route('/plaid/updateAllTransactions')
class PlaidUpdateTransactions(Resource):
    @staticmethod
    def flushTransactions(accessToken):
        # Provide a cursor from your database if you've previously
        # received one for the Item. Leave null if this is your
        # first sync call for this Item. The first request will
        # return a cursor.
        cursor = ""

        # New transaction updates since "cursor"
        added = []
        modified = []
        removed = []  # Removed transaction ids
        has_more = True

        # Iterate through each page of new transaction updates for item
        while has_more:
            transactionsRequest = TransactionsSyncRequest(
                access_token=accessToken,
                cursor=cursor,
            )
            response = client.transactions_sync(transactionsRequest)

            # Add this page of results
            added.extend(response['added'])
            modified.extend(response['modified'])
            removed.extend(response['removed'])

            has_more = response['has_more']

            # Update cursor to the next cursor
            cursor = response['next_cursor']
        toReturn = {
            "addedTransactions": added,
            "modifiedTransactions": modified,
            "removedTransactions": removed,
            "cursor": cursor
        }

        def toDictConverter(a):
            toReturnAgain = a.to_dict()
            # toReturnAgain["authorized_date"] = toReturnAgain["authorized_date"].isoformat()
            # toReturnAgain["authorized_datetime"] = toReturnAgain["authorized_datetime"].isoformat()
            # toReturnAgain["date"] = toReturnAgain["date"].isoformat()
            # toReturnAgain["datetime"] = toReturnAgain["datetime"].isoformat()
            toReturnAgain["authorized_date"] = None
            toReturnAgain["authorized_datetime"] = None
            toReturnAgain["date"] = None
            toReturnAgain["datetime"] = None
            return toReturnAgain

        addedAsDict = list(map(toDictConverter, added))

        with open("transactions.json", "w") as outfile:
            json.dump(addedAsDict, outfile)
        return toReturn

    @staticmethod
    def addTransactionsToUser(tryvestorID, userItemID, transactions):
        addedUserTransactions = []
        for userTransaction in transactions:
            # Parsing the transaction for important data and creating transaction object
            userTransactionDoc = db.collection('tryvestors').document(tryvestorID).collection(
                "userTransactions").document()

            # TODO Remove the lines below this where the merchant name is filled in if none
            merchantNameOptions = ["nasoyaki", "nas", "kingscrowd", "kings", "pikestic", "pike",
                                   "treeofstories", "tree"]
            if userTransaction["merchant_name"] is not None:
                repeatList = [userTransaction["merchant_name"]] * 100
                merchantNameOptions.extend(repeatList)
            userTransaction["merchant_name"] = choice(merchantNameOptions)
            userTransaction["merchant_name"] = userTransaction["merchant_name"].lower()

            allBusMatchingMerchantName = AllBusinesses.getBusinessesByMerchantName(userTransaction["merchant_name"])
            if len(allBusMatchingMerchantName) == 0:
                continue
            # else
            businessMatchedByMerchant = Business.readFromFirebaseFormat(
                sourceDict=allBusMatchingMerchantName[0].to_dict(),
                businessID=allBusMatchingMerchantName[0].id)
            allCampaignsForBusiness = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(
                businessMatchedByMerchant.businessID)
            businessCampaign = Campaign.readFromDict(sourceDict=allCampaignsForBusiness[0],
                                                     campaignID=allCampaignsForBusiness[0]["campaignID"])

            # Just extracting "amount" field up here
            transactionAmount = userTransaction["amount"]
            # Fields to make the user transaction object work
            businessID = businessMatchedByMerchant.businessID
            businessCampaignID = businessCampaign.campaignID
            # Amount spent / valuation for campaign * total shares in company
            numFractionalShares = (float(transactionAmount) / businessCampaign.valuationForCampaign) * \
                                  businessMatchedByMerchant.totalShares
            creationDate = datetime.now(timezone.utc)
            plaidTransactionID = userTransaction["transaction_id"]
            plaidAccountID = userTransaction["account_id"]
            plaidTransactionMerchantName = userTransaction["merchant_name"]
            plaidTransactionIsPending = userTransaction["pending"]
            plaidTransactionAmount = userTransaction["amount"]
            plaidTransactionDatetime = userTransaction["datetime"]

            userTransactionObj = UserTransaction(
                userTransactionID=userTransactionDoc.id,
                userItemID=userItemID,
                businessID=businessID,
                businessCampaignID=businessCampaignID,
                numFractionalShares=numFractionalShares,
                creationDate=creationDate,
                plaidTransactionID=plaidTransactionID,
                plaidAccountID=plaidAccountID,
                plaidTransactionMerchantName=plaidTransactionMerchantName,
                plaidTransactionIsPending=plaidTransactionIsPending,
                plaidTransactionAmount=plaidTransactionAmount,
                plaidTransactionDatetime=plaidTransactionDatetime,
                # plaidTransactionRawObject=plaidTransactionRawObject
            )
            userTransactionObjFireDict = userTransactionObj.writeToFirebaseFormat()
            userTransactionDoc.set(userTransactionObjFireDict)
            addedUserTransactions.append(userTransactionObj.writeToDict())
        return addedUserTransactions


# Function to test if firebase can handle adding lots of requests for docs at once
def tryFirebaseOverload():
    collectionRef = db.collection("numbers")
    for i in range(200):
        document = {
            "num": i,
            "numAsString": str(i),
            "creationDate": datetime.now(timezone.utc),
            "numInObject": {
                "numValueInNumObject": i,
                "numValueAsStringInNumObject": str(i)
            },
            "numInArray": [i, i + 1, i]
        }
        docToSet = collectionRef.document()
        docToSet.set(document)
def manuallyAddFileTransactionsToUser():
    transactions = []
    with open("transactions.json") as infile:
        transactions = json.load(infile)
    '''
    for userTransaction in transactions:

        # Just extracting "amount" field up here
        transactionAmount = userTransaction["amount"]
        # Fields to make the user transaction object work
        businessID = "doesn'tMtterButbusID"
        businessCampaignID = "doesn'tmatterbutbuscampid"
        # Amount spent / valuation for campaign * total shares in company
        numFractionalShares = 12.3
        creationDate = datetime.now(timezone.utc)
        plaidTransactionID = userTransaction["transaction_id"]
        plaidAccountID = userTransaction["account_id"]
        plaidTransactionMerchantName = userTransaction["merchant_name"]
        plaidTransactionIsPending = userTransaction["pending"]
        plaidTransactionAmount = userTransaction["amount"]
        plaidTransactionDatetime = userTransaction["datetime"]
        # print(plaidTransactionDatetime)
        # plaidTransactionRawObject = userTransaction

        userTransactionObj = UserTransaction(
            userTransactionID="Doesn't Matter Here",
            userItemID="also doesnt matter here",
            businessID=businessID,
            businessCampaignID=businessCampaignID,
            numFractionalShares=numFractionalShares,
            creationDate=creationDate,
            plaidTransactionID=plaidTransactionID,
            plaidAccountID=plaidAccountID,
            plaidTransactionMerchantName=plaidTransactionMerchantName,
            plaidTransactionIsPending=plaidTransactionIsPending,
            plaidTransactionAmount=plaidTransactionAmount,
            plaidTransactionDatetime=plaidTransactionDatetime,
            # plaidTransactionRawObject=plaidTransactionRawObject
        )

        # db.collection('tryvestors').document('0cx8CV21EwfuyX8vRYvobkyIMWo2').collection("userTransactions").add(userTransactionObj.writeToDict())

        docTemp = db.collection('tryvestors').document('0cx8CV21EwfuyX8vRYvobkyIMWo2').collection("userTransactions").document()
        docTemp.set(userTransactionObj.writeToFirebaseFormat())
        
'''

    print(PlaidUpdateTransactions.addTransactionsToUser(
        tryvestorID="0cx8CV21EwfuyX8vRYvobkyIMWo2",
        userItemID="doesn't matter here tbh",
        transactions=transactions
    ))

if __name__ == "__main__":
    app.run(port=5000)
