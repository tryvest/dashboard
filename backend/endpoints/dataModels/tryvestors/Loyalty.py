from datetime import datetime, timezone

defaultLoyaltiesBusinessesByCategory = {
    "BIiAyr9v4VSFDdtzYDkW": "EHNhQ8fUZX0vYmnHVKky",
    "TDTZwO4K22IxvtHgpRbq": "05AFSVZFZUmKqTkTUCRZ",
    "UF87cNpZonGrqe6qmSd6": "Rn8nzVxboMWEYWtqL3oq",
    "qFmRegM4u1jvGa21l8p8": "qH6LdUxPAxjwgYeTsvr0"
}


class Loyalty():
    def __init__(self, loyaltyID, businessID, campaignID, categoryID, creationDate, unlockDate, endDate):
        self.loyaltyID = loyaltyID
        self.businessID = businessID
        self.campaignID = campaignID
        self.categoryID = categoryID
        self.creationDate = creationDate
        self.unlockDate = unlockDate
        self.endDate = endDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, loyaltyID):
        return Loyalty(
            loyaltyID=str(loyaltyID),
            businessID=str(sourceDict["businessID"]),
            campaignID=str(sourceDict["campaignID"]),
            categoryID=str(sourceDict["categoryID"]),
            creationDate=sourceDict['creationDate'],
            unlockDate=sourceDict['unlockDate'],
            endDate=sourceDict['endDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "businessID": self.businessID,
            "campaignID": self.campaignID,
            "categoryID": self.categoryID,
            "creationDate": self.creationDate,
            "unlockDate": self.unlockDate,
            'endDate': self.endDate,
        }

    @staticmethod
    def readFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        sourceDict['unlockDate'] = datetime.fromisoformat(sourceDict['unlockDate'])
        sourceDict['endDate'] = None if sourceDict.get('endDate') is None else datetime.fromisoformat(
            sourceDict['endDate'])
        return Loyalty.readFromFirebaseFormat(sourceDict, loyaltyID)

    @staticmethod
    def createFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return Loyalty.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["unlockDate"] = self.unlockDate.isoformat()
        toReturn["endDate"] = None if self.endDate is None else self.endDate.isoformat()
        toReturn["loyaltyID"] = self.loyaltyID
        return toReturn
