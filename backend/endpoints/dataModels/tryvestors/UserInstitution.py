from datetime import datetime, timezone


class UserInstitution:
    def __init__(self, userInstitutionID, plaidItemAccessToken, cursor, creationDate, isActive):
        self.userInstitutionID = userInstitutionID
        self.plaidItemAccessToken = plaidItemAccessToken
        self.cursor = cursor
        self.creationDate = creationDate
        self.isActive = isActive

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userInstitutionID):
        return UserInstitution(
            userInstitutionID=str(userInstitutionID),
            plaidItemAccessToken=str(sourceDict["plaidItemAccessToken"]),
            cursor=str(sourceDict["cursor"]),
            creationDate=sourceDict['creationDate'],
            isActive=sourceDict['isActive']
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidItemAccessToken": self.plaidItemAccessToken,
            "cursor": self.cursor,
            "creationDate": self.creationDate,
            'isActive': self.isActive
        }

    @staticmethod
    def readFromDict(sourceDict, userInstitutionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return UserInstitution.readFromFirebaseFormat(sourceDict, userInstitutionID)

    @staticmethod
    def createFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return UserInstitution.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["userInstitutionID"] = self.userInstitutionID
        return toReturn