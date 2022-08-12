from datetime import datetime, timezone, time
from dateutil.relativedelta import relativedelta

defaultTimeBeforeUnlock = relativedelta(months=3)


class Loyalty:
    def __init__(self, loyaltyID, businessID, categoryID, creationDate, unlockDate, endDate):
        self.loyaltyID = loyaltyID
        self.businessID = businessID
        self.categoryID = categoryID
        self.creationDate = creationDate
        self.unlockDate = unlockDate
        self.endDate = endDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, loyaltyID):
        return Loyalty(
            loyaltyID=str(loyaltyID),
            businessID=str(sourceDict["businessID"]),
            categoryID=str(sourceDict["categoryID"]),
            creationDate=sourceDict['creationDate'],
            unlockDate=sourceDict['unlockDate'],
            endDate=sourceDict['endDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "businessID": self.businessID,
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
        sourceDict['unlockDate'] = datetime.combine(datetime.now(timezone.utc).date() + defaultTimeBeforeUnlock,
                                                    time(), tzinfo=timezone.utc).isoformat()
        sourceDict['endDate'] = None
        return Loyalty.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["unlockDate"] = self.unlockDate.isoformat()
        toReturn["endDate"] = None if self.endDate is None else self.endDate.isoformat()
        toReturn["loyaltyID"] = self.loyaltyID
        return toReturn
