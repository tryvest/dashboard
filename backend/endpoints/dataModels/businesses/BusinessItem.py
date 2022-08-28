from datetime import datetime, timezone


class BusinessItem:
    def __init__(self, businessItemID, plaidAccessToken, plaidItemID, plaidRequestID, cursor, creationDate, isActive):
        self.businessItemID = businessItemID
        self.plaidAccessToken = plaidAccessToken
        self.plaidItemID = plaidItemID
        self.plaidRequestID = plaidRequestID
        self.cursor = cursor
        self.creationDate = creationDate
        self.isActive = isActive

    @staticmethod
    def readFromFirebaseFormat(sourceDict, businessItemID):
        return BusinessItem(
            businessItemID=str(businessItemID),
            plaidAccessToken=str(sourceDict["plaidAccessToken"]),
            plaidItemID=str(sourceDict["plaidItemID"]),
            plaidRequestID=str(sourceDict["plaidRequestID"]),
            cursor=str(sourceDict["cursor"]),
            creationDate=sourceDict['creationDate'],
            isActive=sourceDict['isActive']
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidAccessToken": self.plaidAccessToken,
            "plaidItemID": self.plaidItemID,
            "plaidRequestID": self.plaidRequestID,
            "cursor": self.cursor,
            "creationDate": self.creationDate,
            'isActive': self.isActive
        }

    @staticmethod
    def readFromDict(sourceDict, businessItemID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return BusinessItem.readFromFirebaseFormat(sourceDict, businessItemID)

    @staticmethod
    def createFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['cursor'] = None
        sourceDict['isActive'] = True
        return BusinessItem.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        print(toReturn["creationDate"])
        toReturn["businessItemID"] = self.businessItemID
        return toReturn
