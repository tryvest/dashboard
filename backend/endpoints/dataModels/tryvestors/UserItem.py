from datetime import datetime, timezone

DEFAULT_ITEM_IMAGE_URL = "" # TODO HERE


class UserItem:
    def __init__(self, userItemID, plaidAccessToken, plaidItemID, plaidRequestID, plaidInstitutionID, cursor,
                 userAccounts, creationDate, itemIsActive):
        self.userItemID = userItemID
        self.plaidAccessToken = plaidAccessToken
        self.plaidItemID = plaidItemID
        self.plaidRequestID = plaidRequestID
        self.plaidInstitutionID = plaidInstitutionID
        self.cursor = cursor
        self.creationDate = creationDate
        self.userAccounts = userAccounts
        self.itemIsActive = itemIsActive

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userItemID):
        # Map user accounts
        oldAccountArr = sourceDict['userAccounts']
        newAccountArr = []
        for account in oldAccountArr:
            newAcct = UserAccount.readFromFirebaseFormat(account)
            newAccountArr.append(newAcct)
        sourceDict['userAccounts'] = newAccountArr

        return UserItem(
            userItemID=str(userItemID),
            plaidAccessToken=str(sourceDict["plaidAccessToken"]),
            plaidItemID=str(sourceDict["plaidItemID"]),
            plaidRequestID=str(sourceDict["plaidRequestID"]),
            plaidInstitutionID=str(sourceDict["plaidInstitutionID"]),
            cursor=str(sourceDict["cursor"]),
            creationDate=sourceDict['creationDate'],
            itemIsActive=sourceDict['itemIsActive'],
            userAccounts=sourceDict['userAccounts'],
        )

    def writeToFirebaseFormat(self):
        # Map user accounts
        oldAccountArr = self.userAccounts
        newAccountArr = []
        for account in oldAccountArr:
            newAcct = UserAccount.writeToFirebaseFormat(account)
            newAccountArr.append(newAcct)

        return {
            "plaidAccessToken": self.plaidAccessToken,
            "plaidItemID": self.plaidItemID,
            "plaidRequestID": self.plaidRequestID,
            "cursor": self.cursor,
            "creationDate": self.creationDate,
            "itemIsActive": self.itemIsActive,
            "plaidInstitutionID": self.plaidInstitutionID,
            "userAccounts": newAccountArr,
        }

    @staticmethod
    def readFromDict(sourceDict, userItemID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])

        # Map user accounts
        oldAccountArr = sourceDict['userAccounts']
        newAccountArr = []
        for account in oldAccountArr:
            newAcct = UserAccount.readFromDict(account).writeToFirebaseFormat()
            newAccountArr.append(newAcct)
        sourceDict['userAccounts'] = newAccountArr

        return UserItem.readFromFirebaseFormat(sourceDict, userItemID)

    @staticmethod
    def createFromDict(sourceDict, userItemID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()

        # Map user accounts
        oldAccountArr = sourceDict['userAccounts']
        newAccountArr = []
        for account in oldAccountArr:
            newAcct = UserAccount.createFromDict(account).writeToDict()
            newAccountArr.append(newAcct)
        sourceDict['userAccounts'] = newAccountArr
        sourceDict['itemIsActive'] = True

        return UserItem.readFromDict(sourceDict, userItemID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["userItemID"] = self.userItemID

        # Map user accounts
        oldAccountArr = toReturn['userAccounts']
        newAccountArr = []
        for account in oldAccountArr:
            print("inside writeToDict of item")
            print(account)
            newAcct = UserAccount.readFromFirebaseFormat(account).writeToDict()
            newAccountArr.append(newAcct)
        toReturn['userAccounts'] = newAccountArr

        return toReturn


class UserAccount:
    def __init__(self, plaidAccountID, plaidAccountName, plaidAccountOfficialName, plaidAccountMask,
                 plaidAccountSubtype, plaidAccountType, accountIsActive, creationDate):
        self.plaidAccountID = plaidAccountID
        self.plaidAccountName = plaidAccountName
        self.plaidAccountOfficialName = plaidAccountOfficialName
        self.plaidAccountMask = plaidAccountMask
        self.plaidAccountSubtype = plaidAccountSubtype
        self.plaidAccountType = plaidAccountType
        self.accountIsActive = accountIsActive
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict):
        return UserAccount(
            plaidAccountID=str(sourceDict["plaidAccountID"]),
            plaidAccountName=str(sourceDict["plaidAccountName"]),
            plaidAccountOfficialName=str(sourceDict["plaidAccountOfficialName"]),
            plaidAccountMask=int(sourceDict["plaidAccountMask"]),
            plaidAccountSubtype=str(sourceDict["plaidAccountSubtype"]),
            plaidAccountType=str(sourceDict["plaidAccountType"]),
            accountIsActive=bool(sourceDict["accountIsActive"]),
            creationDate=sourceDict["creationDate"]
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidAccountID": self.plaidAccountID,
            "plaidAccountName": self.plaidAccountName,
            "plaidAccountOfficialName": self.plaidAccountOfficialName,
            "plaidAccountMask": self.plaidAccountMask,
            "plaidAccountSubtype": self.plaidAccountSubtype,
            "plaidAccountType": self.plaidAccountType,
            "accountIsActive": self.accountIsActive,
            "creationDate": self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return UserAccount.readFromFirebaseFormat(sourceDict)

    @staticmethod
    def createFromDict(sourceDict):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['accountIsActive'] = True
        return UserAccount.readFromDict(sourceDict)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        return toReturn
