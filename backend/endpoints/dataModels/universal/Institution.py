from datetime import datetime, timezone

DEFAULT_ITEM_IMAGE_URL = "https://storage.googleapis.com/for-sec/defaultBankIcon.png"

class Institution:
    def __init__(self, institutionID, plaidCountryCodes, plaidInstitutionName, plaidRequestID, institutionImageURL, creationDate):
        # Personal Information
        self.institutionID = institutionID
        self.institutionImageURL = institutionImageURL
        self.creationDate = creationDate

        # Plaid Information
        self.plaidCountryCodes = plaidCountryCodes
        self.plaidInstitutionName = plaidInstitutionName
        self.plaidRequestID = plaidRequestID

    @staticmethod
    def readFromFirebaseFormat(sourceDict, institutionID):
        return Institution(
            institutionID=str(institutionID),
            plaidCountryCodes=sourceDict["plaidCountryCodes"],
            plaidInstitutionName=str(sourceDict["plaidInstitutionName"]),
            plaidRequestID=str(sourceDict["plaidRequestID"]),
            institutionImageURL=str(sourceDict["institutionImageURL"]),
            creationDate=sourceDict["creationDate"],
        )

    def writeToFirebaseFormat(self):
        return {
            "plaidCountryCodes": self.plaidCountryCodes,
            "plaidInstitutionName": self.plaidInstitutionName,
            "plaidRequestID": self.plaidRequestID,
            "institutionImageURL": self.institutionImageURL,
            "creationDate": self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict, institutionID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return Institution.readFromFirebaseFormat(sourceDict, institutionID)

    @staticmethod
    def createFromDict(sourceDict, institutionID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        if sourceDict.get("institutionImageURL") is None:
            sourceDict["institutionImageURL"] = DEFAULT_ITEM_IMAGE_URL
        return Institution.readFromDict(sourceDict, institutionID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["institutionID"] = self.institutionID
        return toReturn