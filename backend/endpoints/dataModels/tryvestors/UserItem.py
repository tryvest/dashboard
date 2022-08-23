from datetime import datetime, timezone


class UserItem:
    def __init__(self, userItemID, plaidAccessToken, plaidItemID, plaidRequestID, cursor, creationDate, isActive):
        self.userItemID = userItemID
        self.plaidAccessToken = plaidAccessToken
        self.plaidItemID = plaidItemID
        self.plaidRequestID = plaidRequestID
        self.cursor = cursor
        self.creationDate = creationDate
        self.isActive = isActive

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userItemID):
        return UserItem(
            userItemID=str(userItemID),
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
    def readFromDict(sourceDict, userItemID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return UserItem.readFromFirebaseFormat(sourceDict, userItemID)

    @staticmethod
    def createFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['cursor'] = None
        sourceDict['isActive'] = True
        return UserItem.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["userItemID"] = self.userItemID
        return toReturn
