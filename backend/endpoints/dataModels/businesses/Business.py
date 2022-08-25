from datetime import datetime, timezone


class Business:
    def __init__(self, businessID, name, merchantNames, tagline, description, logo, totalShares, valuation, categoryID,
                 websiteLink, creationDate, EIN, EINPhotoSubmissionLink, EINVerificationStatus):
        self.businessID = businessID
        self.name = name
        self.merchantNames = *merchantNames,
        self.tagline = tagline
        self.description = description
        self.logo = logo
        self.totalShares = totalShares
        self.valuation = valuation
        self.categoryID = categoryID
        self.websiteLink = websiteLink
        self.EIN = EIN
        self.EINPhotoSubmissionLink = EINPhotoSubmissionLink
        self.EINVerificationStatus = EINVerificationStatus
        self.creationDate = creationDate
        print(type(self.merchantNames))

    @staticmethod
    def readFromFirebaseFormat(sourceDict, businessID):
        return Business(
            businessID=businessID,
            name=str(sourceDict["name"]),
            merchantNames=(sourceDict['merchantNames']),
            tagline=str(sourceDict["tagline"]),
            description=str(sourceDict["description"]),
            logo=str(sourceDict["logo"]),
            totalShares=int(sourceDict["totalShares"]),
            valuation=int(sourceDict["valuation"]),
            categoryID=str(sourceDict["categoryID"]),
            websiteLink=str(sourceDict["websiteLink"]),
            EIN=str(sourceDict["EIN"]),
            EINPhotoSubmissionLink=str(sourceDict["EINPhotoSubmissionLink"]),
            EINVerificationStatus=int(sourceDict["EINVerificationStatus"]),
            creationDate=sourceDict["creationDate"],
        )

    def writeToFirebaseFormat(self):
        return {
            "name": self.name,
            "merchantNames": self.merchantNames,
            "tagline": self.tagline,
            "description": self.description,
            "logo": self.logo,
            "totalShares": self.totalShares,
            "valuation": self.valuation,
            "categoryID": self.categoryID,
            "websiteLink": self.websiteLink,
            "EIN": self.EIN,
            "EINPhotoSubmissionLink": self.EINPhotoSubmissionLink,
            "EINVerificationStatus": self.EINVerificationStatus,
            'creationDate': self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict, businessID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict["creationDate"])
        return Business.readFromFirebaseFormat(sourceDict, businessID)

    @staticmethod
    def createFromDict(sourceDict, businessID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['EINVerificationStatus'] = 0
        return Business.readFromDict(sourceDict, businessID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["businessID"] = self.businessID
        return toReturn


def encryptEIN(rawEIN):
    cleanedEIN = ''.join(c for c in rawEIN if c.isdigit())
    return cleanedEIN

