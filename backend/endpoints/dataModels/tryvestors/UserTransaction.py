from datetime import datetime, timezone


class UserTransaction:
    def __init__(self, userTransactionID, userItemID, businessID, businessCampaignID, numFractionalShares, creationDate,
                 plaidTransactionID, plaidAccountID, plaidTransactionMerchantName, plaidTransactionIsPending, plaidTransactionAmount,
                 plaidTransactionDatetime, percentStockback): #, plaidTransactionRawObject):
        # Personal Information
        self.userTransactionID = userTransactionID
        self.userItemID = userItemID
        self.businessID = businessID
        self.businessCampaignID = businessCampaignID
        self.numFractionalShares = numFractionalShares
        self.percentStockback = percentStockback
        self.creationDate = creationDate

        # Plaid Information
        self.plaidTransactionID = plaidTransactionID
        self.plaidAccountID = plaidAccountID
        self.plaidTransactionMerchantName = plaidTransactionMerchantName
        self.plaidTransactionIsPending = plaidTransactionIsPending
        self.plaidTransactionAmount = plaidTransactionAmount
        self.plaidTransactionDatetime = plaidTransactionDatetime

        # Raw Plaid Transaction Object (just in case) -- REMOVED B/C FIREBASE CAN'T STORE DIRECTLY
        # self.plaidTransactionRawObject = plaidTransactionRawObject

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userTransactionID):
        return UserTransaction(
            userTransactionID=str(userTransactionID),
            userItemID=str(sourceDict["userItemID"]),
            businessID=str(sourceDict["businessID"]),
            businessCampaignID=str(sourceDict["businessCampaignID"]),
            numFractionalShares=float(sourceDict["numFractionalShares"]),
            plaidTransactionID=str(sourceDict["plaidTransactionID"]),
            plaidAccountID=str(sourceDict["plaidAccountID"]),
            plaidTransactionMerchantName=str(sourceDict["plaidTransactionMerchantName"]),
            plaidTransactionIsPending=bool(sourceDict["plaidTransactionIsPending"]),
            plaidTransactionAmount=float(sourceDict["plaidTransactionAmount"]),
            plaidTransactionDatetime=sourceDict["plaidTransactionDatetime"],
            percentStockback=sourceDict["percentStockback"],
            creationDate=sourceDict["creationDate"],
            # plaidTransactionRawObject=sourceDict["plaidTransactionRawObject"]
        )

    def writeToFirebaseFormat(self):
        return {
            "userItemID": self.userItemID,
            "businessID": self.businessID,
            "businessCampaignID": self.businessCampaignID,
            "numFractionalShares": self.numFractionalShares,
            "plaidTransactionID": self.plaidTransactionID,
            "plaidAccountID": self.plaidAccountID,
            "plaidTransactionMerchantName": self.plaidTransactionMerchantName,
            "plaidTransactionIsPending": self.plaidTransactionIsPending,
            "plaidTransactionAmount": self.plaidTransactionAmount,
            "plaidTransactionDatetime": self.plaidTransactionDatetime,
            "percentStockback": self.percentStockback,
            "creationDate": self.creationDate,
            # "plaidTransactionRawObject": self.plaidTransactionRawObject
        }

    @staticmethod
    def readFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        sourceDict['plaidTransactionDatetime'] = None if sourceDict['plaidTransactionDatetime'] is None else datetime.fromisoformat(sourceDict['plaidTransactionDatetime'])
        return UserTransaction.readFromFirebaseFormat(sourceDict, userTransactionID)

    @staticmethod
    def createFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return UserTransaction.readFromDict(sourceDict, userTransactionID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["plaidTransactionDatetime"] = None if self.plaidTransactionDatetime is None else self.plaidTransactionDatetime.isoformat()
        toReturn["userTransactionID"] = self.userTransactionID
        return toReturn