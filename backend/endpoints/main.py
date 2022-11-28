from datetime import datetime, timezone, time
from dateutil.relativedelta import relativedelta

from flask import Flask, request
from flask_restx import Api, Resource
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
from plaid.model.client_user_id import ClientUserID
from plaid.model.generic_country_code import GenericCountryCode
from plaid.model.id_number_type import IDNumberType
from plaid.model.identity_verification_create_request import IdentityVerificationCreateRequest
from plaid.model.identity_verification_get_request import IdentityVerificationGetRequest
from plaid.model.identity_verification_request_user import IdentityVerificationRequestUser
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.user_address import UserAddress
from plaid.model.user_id_number import UserIDNumber
from plaid.model.user_name import UserName

# Universal Data Model Imports
from dataModels.businesses.Campaign import Campaign
from dataModels.universal.Category import Category
from dataModels.universal.GenericUser import GenericUser
from dataModels.universal.Institution import Institution

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


@api.route("/categories/<string:categoryID>")
class SpecificCategory(Resource):
    def get(self, categoryID):
        category = db.collection("categories").document(categoryID).get().to_dict()
        returnVal = Category.readFromFirebaseFormat(category, categoryID).writeToDict()
        return returnVal


@api.route("/institution")
class Institutions(Resource):
    @staticmethod
    def addNewInstitutionToFirestore(plaidInstitutionID, institutionDocRef):
        # Getting information from plaid in the first place
        request = InstitutionsGetByIdRequest(
            institution_id=plaidInstitutionID,
            country_codes=list(map(lambda x: CountryCode(x), ["US"]))
        )
        plaidApiResponse = client.institutions_get_by_id(request)

        # Converting data from plaid into more standard terms
        source = {
            "plaidCountryCodes": [str(x) for x in plaidApiResponse["institution"]["country_codes"]],
            "plaidInstitutionName": plaidApiResponse["institution"]["name"],
            "plaidRequestID": plaidApiResponse["request_id"],
        }

        # New institution creation
        insObjNew = Institution.createFromDict(sourceDict=source, institutionID=plaidInstitutionID)
        institutionDocRef.set(insObjNew.writeToFirebaseFormat())


@api.route("/institution/<string:institutionID>")
class SpecificInstitution(Resource):
    def get(self, institutionID):
        insDocAsDict = db.collection("institutions").document(institutionID).get().to_dict()
        insObj = Institution.readFromFirebaseFormat(insDocAsDict, institutionID)
        return insObj.writeToDict()


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

        tryvestorsWithTransactions, numShares = SpecificBusiness.getAllTryvestorsAndEquity(businessID)
        numEquityInDollars = numShares / businessObj.totalShares * businessObj.valuation

        # Adding some summarizing data for the business object
        summaryData = {
            "numTryvestors": len(tryvestorsWithTransactions),
            "amountEquityAwardedInDollars": numEquityInDollars,
            "amountEquityAwardedInShares": numShares,
        }
        businessDict["summaryData"] = summaryData
        businessDict["tryvestorsWithTransactions"] = tryvestorsWithTransactions

        return businessDict

    def patch(self, businessID):
        businessUpdateData = request.json
        busDoc = db.collection('businesses').document(businessID)
        busDoc.update(businessUpdateData)

    @staticmethod
    def getAllTryvestorsAndEquity(businessID):
        allTransactionsForBusiness = db.collection_group("userTransactions").where("businessID", "==",
                                                                                   businessID).stream()
        tryvestorsAndTheirTransactions = {}
        totalNumberOfSharesAwarded = 0

        for trans in allTransactionsForBusiness:
            transObj = UserTransaction.readFromFirebaseFormat(sourceDict=trans.to_dict(), userTransactionID=trans.id)
            tempTryvestorID = trans.reference.parent.parent.get().id
            if tryvestorsAndTheirTransactions.get(tempTryvestorID) is None:
                tryvestorsAndTheirTransactions[tempTryvestorID] = []
            tryvestorsAndTheirTransactions[tempTryvestorID].append(transObj.writeToDict())
            totalNumberOfSharesAwarded += transObj.numFractionalShares

        return tryvestorsAndTheirTransactions, totalNumberOfSharesAwarded


@busApi.route("/<string:businessID>/campaigns")
class SpecificBusinessCampaigns(Resource):
    def get(self, businessID):
        limit = request.args.get("limit")
        if limit is not None:
            limit = int(limit)

        if limit is not None and limit <= 0:
            return "Limit number is bad, please send >= 1, or don't include if you want all to be returned"

        toReturn = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(businessID, limit=limit)
        return toReturn

    def post(self, businessID):
        campaignData = request.json
        campaignDoc = db.collection("businesses").document(businessID).collection("campaigns").document()
        cleanedCampaign = Campaign.createFromDict(campaignData, campaignDoc.id).writeToFirebaseFormat()
        campaignDoc.set(cleanedCampaign)
        return campaignDoc.id

    @staticmethod
    def returnAllCampaignsForSpecificBusiness(businessID, limit=None):
        if limit is not None and limit >= 0:
            campaigns = db.collection("businesses").document(str(businessID)).collection("campaigns").order_by(
                'startDate', direction=firestore.Query.DESCENDING).limit(int(limit)).stream()
        else:
            campaigns = db.collection("businesses").document(str(businessID)).collection("campaigns").order_by(
                'startDate', direction=firestore.Query.DESCENDING).stream()
        toReturn = []
        for campaign in campaigns:
            temp = Campaign.readFromFirebaseFormat(campaign.to_dict(), campaign.id).writeToDict()
            toReturn.append(temp)
        return toReturn


@busApi.route("/<string:businessID>/businessItems")
class SpecificBusinessItems(Resource):
    def get(self, businessID):
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
        # selectedLoyaltiesByCategory = AllTryvestors.addingLoyaltiesByCategoryToTryvestor(tryDoc=tryDoc)

        tryvestorToReturn = cleanedTryvestor.writeToDict()
        # tryvestorToReturn["selectedLoyaltiesByCategory"] = selectedLoyaltiesByCategory
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
            campaignsForBusiness = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(businessID, limit=1)
            campaignID = campaignsForBusiness[0]["campaignID"]

            # Making it so user can immediately change loyalty (since these are defaults), and adding a loyalty per category
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
            return selectedLoyaltiesByCategory


@tryApi.route("/<string:tryvestorID>")
class SpecificTryvestor(Resource):
    def get(self, tryvestorID):
        # Getting data from firebase
        tryvestorDocRef = db.collection("tryvestors").document(tryvestorID)
        tryvestorDoc = tryvestorDocRef.get()
        if not tryvestorDoc.exists:
            return "Error"
        tryvestorDict = tryvestorDoc.to_dict()

        # Converting / filtering the base demographic data of tryvestor
        tryvestor = Tryvestor.readFromFirebaseFormat(sourceDict=tryvestorDict, tryvestorID=tryvestorID).writeToDict()

        # Additional Data for Tryvestor Dash BELOW

        # Starting with getting companies into desired format
        allTryvestorTransactions = tryvestorDocRef.collection("userTransactions").order_by('creationDate',
                                                                                           direction=firestore.Query.DESCENDING).get()
        businessesTryvestorIsIn = {}
        totalAmountStockback = 0  # Only piece of summary data for now
        for tryvestorTransaciton in allTryvestorTransactions:
            # First, find amount of money spent for that transaction, then add transaction to business and then add
            # to total, also find most recent
            userTransactionObj = UserTransaction.readFromFirebaseFormat(
                sourceDict=tryvestorTransaciton.to_dict(), userTransactionID=tryvestorTransaciton.id)

            # Initializing business first time a transaction is seen within this loop from this particular business
            if businessesTryvestorIsIn.get(userTransactionObj.businessID) is None:
                mostRecentCampaign = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(
                    businessID=userTransactionObj.businessID, limit=1)[0]
                recentCampaignObj = Campaign.readFromDict(sourceDict=mostRecentCampaign,
                                                          campaignID=mostRecentCampaign["campaignID"])
                businessDocRef = db.collection("businesses").document(userTransactionObj.businessID)
                businessObj = Business.readFromFirebaseFormat(sourceDict=businessDocRef.get().to_dict(),
                                                              businessID=businessDocRef.id)
                businessesTryvestorIsIn[userTransactionObj.businessID] = {
                    "currentPercentStockback": recentCampaignObj.stockBackPercent,
                    "amountSpent": 0,
                    "businessLogo": businessObj.logo
                }
            # Thing to do for company per transaction
            businessesTryvestorIsIn[userTransactionObj.businessID]["amountSpent"] += \
                userTransactionObj.plaidTransactionAmount * userTransactionObj.percentStockback
            totalAmountStockback += userTransactionObj.plaidTransactionAmount * userTransactionObj.percentStockback

        # Loop through the 10 transactions and add necessary data
        recentTryvestorTransactionsFormatted = []
        for i in range(min(10, len(allTryvestorTransactions))):
            formattedRecentTransaction = SpecificTryvestorTransactions.convertToTransactionTableFormat(
                tryvestorTransaction=allTryvestorTransactions[i], tryvestorUID=tryvestorID)
            recentTryvestorTransactionsFormatted.append(formattedRecentTransaction)

        # Summary Data Compilation
        tryvestorSummaryData = {
            "totalAmountStockback": totalAmountStockback
        }

        # Adding all desired data into tryvestor object
        tryvestor["summaryData"] = tryvestorSummaryData
        tryvestor["recentTransactions"] = recentTryvestorTransactionsFormatted
        tryvestor["businessesInvestedIn"] = businessesTryvestorIsIn
        '''
        tryvestorObj = {
            ...currentData,
            summaryData: {
                totalStockback: Total amount of money in stock back (simply take % and amount from each transaction and add it up)
,
            }
            recentTransactions:[limit to ~10 transactions]
                - Each transaction should have: 
                logo link from institution, 
                logo link from business, 
                date of transaction, 
                amount in transaction, 
                % stockback, 
                amount of money invested in business
            }
        Companies the tryvestor is in:
         - Company ID, Current campaign stockback %, Amount stockback from that specific company
        '''

        return tryvestor

    def patch(self, tryvestorID):
        tryvestorUpdateData = request.json
        # If updating address, making sure it's formatted properly
        if tryvestorUpdateData.get("address") is not None:
            tryvestorUpdateData["address"] = TryvestorAddress.fromDict(tryvestorUpdateData["address"]).toDict()

        # If updating SSN - don't. delete it
        if tryvestorUpdateData.get("SSN") is not None:
            # prefix, suffix = encryptSSN(tryvestorUpdateData["SSN"])
            # tryvestorUpdateData["SSNPrefix"] = prefix
            # tryvestorUpdateData["SSNSuffix"] = suffix
            del tryvestorUpdateData["SSN"]

        tryDoc = db.collection('tryvestors').document(tryvestorID)
        tryDoc.update(tryvestorUpdateData)


@tryApi.route("/<string:tryvestorID>/loyalties")
class SpecificTryvestorLoyalties(Resource):
    def get(self, tryvestorID): #todo need to finish this part where I return currently loyal companies
        activeOnly = request.args.get("activeOnly")
        loyalties = db.collection("tryvestors").document(tryvestorID).collection(
            "loyalties").order_by('creationDate',direction=firestore.Query.DESCENDING).get()
        toReturn = []
        if (bool(activeOnly)):
            toReturn = {}
            categories = Categories.getAllCategoriesHelper()
            print(categories)
            numEmpty = len(categories)
            for category in categories:
                catObj = Category.readFromDict(category, category["categoryID"])
                toReturn[catObj.categoryID] = None
            for loyalty in loyalties:
                loyaltyObj = Loyalty.readFromFirebaseFormat(loyalty.to_dict(), loyalty.id)
                if (toReturn.get(loyaltyObj.categoryID) == None):
                    toReturn[loyaltyObj.categoryID] = loyaltyObj.writeToDict()
                    numEmpty -= 1
                if (numEmpty <= 0):
                    break
        else:
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
        # Finding the most recent campaign for a business
        campaignsForBusiness = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(loyaltyData["businessID"], limit=1)
        campaignID = campaignsForBusiness[0]["campaignID"]

        ## TODO WRITE CODE TO MAKE SURE OLD LOYALTY (IF ONE EXISTS) IS ENDED (aka the end date is set to today)

        # Making it so user can immediately change loyalty (since these are defaults), and adding a loyalty per category
        sourceDict = {
            "businessID": loyaltyData["businessID"],
            "categoryID": loyaltyData["categoryID"],
            "campaignID": campaignID,
            "unlockDate": loyaltyData["unlockDate"],
            "endDate": loyaltyData['endDate']
        }

        # Cleaning loyalty data, updating the doc, and returning the created cleanedLoyalty object upon success
        newLoyalty = Loyalty.createFromDict(sourceDict, loyaltyDoc.id)
        loyaltyDoc.set(newLoyalty.writeToFirebaseFormat())
        return newLoyalty.writeToDict()

@tryApi.route("/<string:tryvestorID>/loyalties/updateLoyaltyStatus")
class SpecificTryvestorLoyalties(Resource):
    def patch(self, tryvestorID):
        rjson = request.json
        initialLoyaltiesStatus = rjson["newLoyaltyStatus"]
        db.collection("tryvestors").document(tryvestorID).update({"initialLoyaltiesStatus": initialLoyaltiesStatus})

@tryApi.route("/<string:tryvestorID>/userItems")
class SpecificTryvestorItems(Resource):
    def get(self, tryvestorID):
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
        userItemData["userAccountIDs"] = allAccounts
        userItemData["plaidInstitutionID"] = plaidInstitutionID

        userDoc = db.collection("tryvestors").document(tryvestorID)
        userDoc.update({
            "defaultAccountID": allAccounts[0]["plaidAccountID"],
            "defaultItemID": userItemDoc.id
        })

        # Checking if the user item has an instution ID
        # Here we notice that insDocRef in firebase is same as plaidInstitutionID
        insDocRef = db.collection("institutions").document(plaidInstitutionID)
        insDocSnap = insDocRef.get()
        if not insDocSnap.exists:
            Institutions.addNewInstitutionToFirestore(plaidInstitutionID=plaidInstitutionID,
                                                      institutionDocRef=insDocRef)

        # Cleaning item data, updating the doc, and returning the created cleanedUserItem as dict upon success
        cleanedUserItem = UserItem.createFromDict(userItemData, userItemDoc.id)
        userItemDoc.set(cleanedUserItem.writeToFirebaseFormat())
        cleanedUserItemReturnDict = cleanedUserItem.writeToDict()
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
            plaidAccountMask = str(account["mask"])
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


@tryApi.route("/<string:tryvestorID>/userItems/<string:userItemID>")
class SpecificUserItem(Resource):
    def patch(self, tryvestorID, userItemID):
        updateData = {"itemIsActive": False}
        db.collection("tryvestors").document(tryvestorID).collection("userItems").document(userItemID).update(
            updateData)


@tryApi.route("/<string:tryvestorID>/userItems/<string:userItemID>/<string:userAccountID>")
class SpecificUserAccount(Resource):
    def delete(self, tryvestorID, userItemID, userAccountID):
        itemDoc = db.collection("tryvestors").document(tryvestorID).collection("userItems").document(userItemID).get()
        itemDocDict = itemDoc.to_dict()

        indexToRemove = -1
        for index, i in enumerate(itemDocDict["userAccountIDs"]):
            if (i["plaidAccountID"] == userAccountID):
                indexToRemove = index

        if (indexToRemove == -1):
            return "Error"

        # I am only disabling item active status, not deleting
        removedItem = itemDocDict["userAccountIDs"][indexToRemove]
        itemDocDict["userAccountIDs"][indexToRemove]["accountIsActive"] = False
        itemDoc.reference.set(itemDocDict)

        removedItemCleaned = UserAccount.readFromFirebaseFormat(removedItem).writeToDict()
        return removedItemCleaned

    def patch(self, tryvestorID, userItemID, userAccountID):
        tryDoc = db.collection("tryvestors").document(tryvestorID).get()
        tryDocDict = tryDoc.to_dict()
        tryDocDict["defaultItemID"] = userItemID
        tryDocDict["defaultAccountID"] = userAccountID
        tryDoc.reference.set(tryDocDict)


@tryApi.route("/<string:tryvestorID>/userTransactions")
class SpecificTryvestorTransactions(Resource):
    # Get all of a specific tryvestor's transactions stored in firebase
    def get(self, tryvestorID):
        allTryvestorTransactions = db.collection('tryvestors').document(tryvestorID).collection(
            "userTransactions").stream()
        toReturn = []
        for userTransaction in allTryvestorTransactions:
            userTransactionObj = UserTransaction.readFromFirebaseFormat(
                sourceDict=userTransaction.to_dict(), userTransactionID=userTransaction.id
            )
            cleanedUserTransactionObj = userTransactionObj.writeToDict()
            toReturn.append(cleanedUserTransactionObj)

        return toReturn

    @staticmethod
    def convertToTransactionTableFormat(tryvestorTransaction, tryvestorUID):
        userTransactionObj = UserTransaction.readFromFirebaseFormat(
            sourceDict=tryvestorTransaction.to_dict(), userTransactionID=tryvestorTransaction.id)

        # Getting institutionLogo
        userItemDoc = db.collection("tryvestors").document(tryvestorUID).collection("userItems").document(
            userTransactionObj.userItemID).get()
        userItemObj = UserItem.readFromFirebaseFormat(sourceDict=userItemDoc.to_dict(), userItemID=userItemDoc.id)
        institutionDoc = db.collection("institutions").document(userItemObj.plaidInstitutionID).get()
        institutionObj = Institution.readFromFirebaseFormat(sourceDict=institutionDoc.to_dict(),
                                                            institutionID=institutionDoc.id)

        # Getting businessLogo
        businessDoc = db.collection("businesses").document(userTransactionObj.businessID).get()
        businessObj = Business.readFromFirebaseFormat(sourceDict=businessDoc.to_dict(), businessID=businessDoc.id)

        # Choosing Transaction Date TODO fix the condition for no date existing
        transactionDate = userTransactionObj.creationDate.isoformat() if \
            userTransactionObj.plaidTransactionDatetime is None else userTransactionObj.plaidTransactionDatetime.isoformat()

        # Final return transaction
        formattedTransaction = {
            "institutionLogo": institutionObj.institutionImageURL,
            "businessLogo": businessObj.logo,
            "transactionDate": transactionDate,
            "transactionAmount": userTransactionObj.plaidTransactionAmount,
            "percentStockback": userTransactionObj.percentStockback,
            "amountMoneyInvested": userTransactionObj.percentStockback * userTransactionObj.plaidTransactionAmount
        }

        return formattedTransaction

        '''
        Each transaction should have: 
                logo link from institution, 
                logo link from business, 
                date of transaction, 
                amount in transaction, 
                % stockback, 
                amount of money invested in business
        '''


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
from plaid.model.link_token_create_request_identity_verification import LinkTokenCreateRequestIdentityVerification
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
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
# Use 'sandbox' to test with Plaid's Sandbox environment (username: user_good,
# password: pass_good)
# Use `development` to test with live users and credentials and `production`
# to go live
PLAID_ENV = os.getenv('PLAID_ENV')
# PLAID_PRODUCTS is a comma-separated list of products to use when initializing
# Link. Note that this list must contain 'assets' in order for the app to be
# able to create and retrieve asset reports.
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS').split(',')
# PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
# will be able to select institutions from.
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES').split(',')
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
        reqJson = request.json
        tryvestorID = reqJson["tryvestorID"]
        try:
            plaidRequest = LinkTokenCreateRequest(
                products=products,
                client_name="Plaid Quickstart",
                country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=tryvestorID
                )
            )
            if PLAID_REDIRECT_URI != None:
                plaidRequest['redirect_uri'] = PLAID_REDIRECT_URI
            # create link token
            response = client.link_token_create(plaidRequest)
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

            print(addedTransactions)

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


@api.route('/plaid/idv/exchangePublicToken')  # Formerly Named "/set_access_token"
class PlaidExchangeIDVPublicToken(Resource):
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

            # Setting status isOk to true
            addedItem["isOk"] = True
            return addedItem

        except plaid.ApiException as e:
            return json.loads(e.body)


@api.route('/plaid/idv/prepopulate')
class PlaidCreateIDVAndPrepopulate(Resource):
    def post(self):
        reqJson = request.json
        tryvestorID = reqJson["tryvestorID"]
        tryvestorDoc = db.collection("tryvestors").document(tryvestorID).get()
        tryvestorDocDict = tryvestorDoc.to_dict()
        tryvestorObj = Tryvestor.readFromFirebaseFormat(tryvestorDocDict, tryvestorID)
        tryvestorAddress = TryvestorAddress.fromDict(tryvestorDocDict["address"])
        tryvestorDOBAsDate = datetime.fromtimestamp(tryvestorObj.DOB.timestamp()).date()

        plaidRequest = IdentityVerificationCreateRequest(
            is_shareable=True,
            is_idempotent=True,
            template_id='idvtmp_3hjJ3yM7Nj7w2f',
            user=IdentityVerificationRequestUser(
                client_user_id=ClientUserID(tryvestorID),
                # email_address=tryvestorObj.username,
                # date_of_birth=tryvestorDOBAsDate,
                # name=UserName(
                #     given_name=tryvestorObj.firstName,
                #     family_name=tryvestorObj.lastName
                # ),
                # address=UserAddress(
                #     street=tryvestorAddress.streetAddress,
                #     street2=tryvestorAddress.unit,
                #     city=tryvestorAddress.city,
                #     region=tryvestorAddress.state,
                #     postal_code=tryvestorAddress.postalCode,
                #     country=GenericCountryCode('US')
                # ),
                # id_number=UserIDNumber(
                #     value= tryvestorObj.SSNPrefix + '' + tryvestorObj.SSNSuffix,
                #     type=IDNumberType('US_SSN')
                # )
            )
        )
        responseDict = client.identity_verification_create(plaidRequest).to_dict()
        tryvestorDoc.reference.update({"plaidIdentityVerificationID": responseDict["id"]})
        toReturn = {
            "plaidIdentityVerificationID": responseDict["id"],
        }
        return toReturn


@api.route('/plaid/idv/updateIdentityVerificationStatus')
class PlaidUpdateIdentityVerificationStatus(Resource):
    def post(self):
        reqJson = request.json
        tryvestorID = reqJson["tryvestorID"]
        plaidIdentityVerificationID = reqJson["plaidIdentityVerificationID"]
        try:
            plaidRequest = IdentityVerificationGetRequest(identity_verification_id=plaidIdentityVerificationID)
            response = client.identity_verification_get(plaidRequest)
            response = response.to_dict()
            status = response[
                "status"]  # From Plaid, Can be: active, success, failed, expired, canceled, pending_review
            updateNum = 0

            if (status == "active"):
                updateNum = 0
            elif (status == "success" or status == "pending_review"):
                updateNum = 1
            elif (status == "failed" or status == "expired" or status == "canceled"):
                updateNum = -1
            db.collection("tryvestors").document(tryvestorID).update({"IDVerificationStatus": updateNum})

            # Defining the dictionary for the data returned by the plaid API
            returnDict = {
                "plaidStats": status,
                "statusNum": updateNum
            }
            return jsonify(returnDict)

        except plaid.ApiException as e:
            return json.loads(e.body)

@api.route('/plaid/idv/createLinkToken')
class PlaidCreateIDVLinkToken(Resource):

    def post(self):
        reqJson = request.json
        tryvestorID = reqJson["tryvestorID"]
        try:
            plaidRequest = LinkTokenCreateRequest(
                products=[Products("identity_verification")],
                client_name="Plaid Quickstart",
                country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=tryvestorID
                ),
                identity_verification=LinkTokenCreateRequestIdentityVerification(
                    template_id="idvtmp_3hjJ3yM7Nj7w2f"
                )
            )
            if PLAID_REDIRECT_URI != None:
                plaidRequest['redirect_uri'] = PLAID_REDIRECT_URI
            # create link token
            response = client.link_token_create(plaidRequest)
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
        while has_more and len(added) < 100:
            transactionsRequest = TransactionsSyncRequest(
                access_token=accessToken,
                cursor=cursor,
            )
            response = client.transactions_sync(transactionsRequest)

            print(response)

            # Add this page of results
            added.extend(response['added'])
            modified.extend(response['modified'])
            removed.extend(response['removed'])

            print(added)

            has_more = response['has_more']

            print(has_more)

            # Update cursor to the next cursor
            cursor = response['next_cursor']

            print(cursor)

        # Now putting together data to return
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
            # if userTransaction["merchant_name"] is not None:
            #     repeatList = [userTransaction["merchant_name"]] * 100
            #     merchantNameOptions.extend(repeatList)
            userTransaction["merchant_name"] = choice(merchantNameOptions)
            userTransaction["merchant_name"] = userTransaction["merchant_name"].lower()

            allBusMatchingMerchantName = AllBusinesses.getBusinessesByMerchantName(userTransaction["merchant_name"])
            if len(allBusMatchingMerchantName) == 0 or userTransaction["amount"] <= 0:
                continue
            # else
            businessMatchedByMerchant = Business.readFromFirebaseFormat(
                sourceDict=allBusMatchingMerchantName[0].to_dict(),
                businessID=allBusMatchingMerchantName[0].id)
            recentCampaignsForBusiness = SpecificBusinessCampaigns.returnAllCampaignsForSpecificBusiness(
                businessMatchedByMerchant.businessID, limit=1)
            if len(recentCampaignsForBusiness) == 0:
                continue
            businessCampaign = Campaign.readFromDict(sourceDict=recentCampaignsForBusiness[0],
                                                     campaignID=recentCampaignsForBusiness[0]["campaignID"])
            # Just extracting "amount" field up here
            transactionAmount = userTransaction["amount"]
            # Fields to make the user transaction object work
            businessID = businessMatchedByMerchant.businessID
            businessCampaignID = businessCampaign.campaignID
            percentStockback = businessCampaign.stockBackPercent
            # Amount spent * percentStockback / valuation for campaign * total shares in business
            numFractionalShares = (float(
                transactionAmount) * percentStockback / businessCampaign.valuationForCampaign) * \
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
                percentStockback=percentStockback,
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
        # Amount spent / valuation for campaign * total shares in business
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


def checkQueryOrder():
    data = db.collection("tryvestors").order_by("firstName", direction=firestore.Query.DESCENDING).limit(
        2).get()
    for doc in data:
        print(doc.to_dict()["firstName"])


def fixBusinesses():
    allBus = db.collection("businesses").stream()
    for bus in allBus:
        bus.reference.update({
            "tryvestorRequirements": None
        })


def fixAccounts():
    allItems = db.collection("tryvestors").document("0cx8CV21EwfuyX8vRYvobkyIMWo2").collection("userItems").stream()
    for item in allItems:
        itemDict = item.to_dict()
        newItem = {"userAccountIDs": itemDict["userAccounts"], **itemDict}
        item.reference.set(newItem)


if __name__ == "__main__":
    app.run(port=5000)