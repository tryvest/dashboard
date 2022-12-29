from datetime import datetime, timezone

class UserInvestment:
    def __init__(self, userInvestmentID, userItemID, userAccountID, businessID, businessCampaignID, creationDate, numFractionalShares, investmentAmount, withdrawn):
        self.userInvestmentID = userInvestmentID
        self.userItemID = userItemID
        self.userAccountID = userAccountID
        self.businessID = businessID
        self.businessCampaignID = businessCampaignID
        self.numFractionalShares = numFractionalShares
        self.creationDate = creationDate
        self.investmentAmount = investmentAmount
        self.withdrawn = withdrawn

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userInvestmentID):
        return UserInvestment(
            userInvestmentID=str(userInvestmentID),
            userItemID=str(sourceDict["userItemID"]),
            userAccountID=str(sourceDict["userAccountID"]),
            businessID=str(sourceDict["businessID"]),
            businessCampaignID=str(sourceDict["businessCampaignID"]),
            numFractionalShares=float(sourceDict["numFractionalShares"]),
            creationDate=sourceDict["creationDate"],
            investmentAmount=float(sourceDict["investmentAmount"]),
            withdrawn=bool(sourceDict["withdrawn"])
        )

    def writeToFirebaseFormat(self):
        return {
            "userItemID": self.userItemID,
            "userAccountID": self.userAccountID,
            "businessID": self.businessID,
            "businessCampaignID": self.businessCampaignID,
            "numFractionalShares": self.numFractionalShares,
            "creationDate": self.creationDate,
            "investmentAmount": self.investmentAmount,
            "withdrawn": self.withdrawn,
        }

    @staticmethod
    def readFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return UserInvestment.readFromFirebaseFormat(sourceDict, userTransactionID)

    @staticmethod
    def createFromDict(sourceDict, userTransactionID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['withdrawn'] = False
        return UserInvestment.readFromDict(sourceDict, userTransactionID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["userInvestmentID"] = self.userInvestmentID
        return toReturn
