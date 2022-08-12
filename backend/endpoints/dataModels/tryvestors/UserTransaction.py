from datetime import datetime, timezone


class UserTransaction:
    def __init__(self, userTransactionID, plaidTransactionID, plaidAccountID, transactionStatus, userInstitutionID,
                 businessID,
                 valuationAtTransaction, numFractionalShares, transactionAmount, transactionDate, creationDate):
        self.userTransactionID = userTransactionID
        self.plaidTransactionID = plaidTransactionID
        self.plaidAccountID = plaidAccountID
        self.transactionStatus = transactionStatus
        self.userInstitutionID = userInstitutionID
        self.businessID = businessID
        self.valuationAtTransaction = valuationAtTransaction
        self.numFractionalShares = numFractionalShares
        self.transactionAmount = transactionAmount
        self.transactionDate = transactionDate
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userTransactionID):
        return UserTransaction(
            userTransactionID=str(userTransactionID),
            plaidTransactionID=str(sourceDict("plaidTransactionID")),
            plaidAccountID=str(sourceDict("plaidAccountID")),
            transactionStatus=int(sourceDict("transactionStatus")),
            userInstitutionID=str(sourceDict("userInstitutionID")),
            businessID=str(sourceDict("businessID")),
            valuationAtTransaction=int(sourceDict("valuationAtTransaction")),
            numFractionalShares=float(sourceDict("numFractionalShares")),
            transactionAmount=float(sourceDict("transactionAmount")),
            transactionDate=sourceDict("transactionDate"),
            creationDate=sourceDict("creationDate"),
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidTransactionID": self.plaidTransactionID,
            "plaidAccountID": self.plaidAccountID,
            "transactionStatus": self.transactionStatus,
            "userInstitutionID": self.userInstitutionID,
            "businessID": self.businessID,
            "valuationAtTransaction": self.valuationAtTransaction,
            "numFractionalShares": self.numFractionalShares,
            "transactionAmount": self.transactionAmount,
            "transactionDate": self.transactionDate,
            "creationDate": self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        sourceDict['transactionDate'] = datetime.fromisoformat(sourceDict['transactionDate'])
        return UserTransaction.readFromFirebaseFormat(sourceDict, userTransactionID)

    @staticmethod
    def createFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return UserTransaction.readFromDict(sourceDict, userTransactionID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["transactionDate"] = self.transactionDate.isoformat()
        toReturn["userTransactionID"] = self.userTransactionID
        return toReturn