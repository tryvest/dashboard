from datetime import datetime, timezone


class BusinessInstitution:
    def __init__(self, businessInstitutionID, plaidItemAccessToken, cursor, creationDate):
        self.businessInstitutionID = businessInstitutionID
        self.plaidItemAccessToken = plaidItemAccessToken
        self.cursor = cursor
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, businessInstitutionID):
        return BusinessInstitution(
            businessInstitutionID=str(businessInstitutionID),
            plaidItemAccessToken=str(sourceDict["plaidItemAccessToken"]),
            cursor=str(sourceDict["cursor"]),
            creationDate=sourceDict['creationDate'],
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidItemAccessToken": self.plaidItemAccessToken,
            "cursor": self.cursor,
            "creationDate": self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict, businessInstitutionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return BusinessInstitution.readFromFirebaseFormat(sourceDict, businessInstitutionID)

    @staticmethod
    def createFromDict(sourceDict, loyaltyID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return BusinessInstitution.readFromDict(sourceDict, loyaltyID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["businessInstitutionID"] = self.businessInstitutionID
        return toReturn