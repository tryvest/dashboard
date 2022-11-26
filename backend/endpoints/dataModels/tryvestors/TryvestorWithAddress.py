from datetime import datetime, timezone, date, time


class Tryvestor:
    def __init__(self, tryvestorID, firstName, lastName, username, DOB, address, creationDate, SSNPrefix, SSNSuffix,
                 SSNVerificationStatus, IDVerificationStatus, IDLink, defaultAccountID, defaultItemID, plaidIdentityVerificationID):
        self.tryvestorID = tryvestorID
        self.firstName = firstName
        self.lastName = lastName
        self.username = username
        self.DOB = DOB
        self.address = address
        self.creationDate = creationDate
        self.SSNPrefix = SSNPrefix
        self.SSNSuffix = SSNSuffix
        self.SSNVerificationStatus = SSNVerificationStatus
        self.IDVerificationStatus = IDVerificationStatus
        self.IDLink = IDLink
        self.defaultAccountID = defaultAccountID
        self.defaultItemID = defaultItemID
        self.plaidIdentityVerificationID = plaidIdentityVerificationID

    @staticmethod
    def readFromFirebaseFormat(sourceDict, tryvestorID):
        print(sourceDict)
        return Tryvestor(
            tryvestorID=str(tryvestorID),
            firstName=str(sourceDict["firstName"]),
            lastName=str(sourceDict["lastName"]),
            username=str(sourceDict["username"]),
            DOB=sourceDict["DOB"],
            address=TryvestorAddress.fromDict(sourceDict['address']),
            creationDate=sourceDict['creationDate'],
            SSNPrefix=str(sourceDict["SSNPrefix"]),
            SSNSuffix=str(sourceDict["SSNSuffix"]),
            SSNVerificationStatus=int(sourceDict["SSNVerificationStatus"]),
            IDVerificationStatus=int(sourceDict["IDVerificationStatus"]),
            IDLink=str(sourceDict["IDLink"]),
            defaultAccountID=str(sourceDict["defaultAccountID"]),
            defaultItemID=str(sourceDict["defaultItemID"]),
            plaidIdentityVerificationID=str(sourceDict["plaidIdentityVerificationID"])
        )

    def writeToFirebaseFormat(self):
        print('after this')
        print(self.address)
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "username": self.username,
            "DOB": self.DOB,
            'address': self.address.toDict(),
            'creationDate': self.creationDate,
            'SSNPrefix': self.SSNPrefix,
            'SSNSuffix': self.SSNSuffix,
            'SSNVerificationStatus': self.SSNVerificationStatus,
            'IDVerificationStatus': self.IDVerificationStatus,
            'IDLink': self.IDLink,
            'defaultAccountID': self.defaultAccountID,
            'defaultItemID': self.defaultItemID,
            'plaidIdentityVerificationID': self.plaidIdentityVerificationID
        }

    @staticmethod
    def readFromDict(sourceDict, tryvestorID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        sourceDict['DOB'] = datetime.combine(date.fromisoformat(sourceDict['DOB']), time(tzinfo=timezone.utc),
                                             tzinfo=timezone.utc)
        return Tryvestor.readFromFirebaseFormat(sourceDict, tryvestorID)

    @staticmethod
    def createFromDict(sourceDict, tryvestorID):
        sourceDict['address'] = TryvestorAddress.createNewUser().toDict()
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['SSNPrefix'] = None
        sourceDict['SSNSuffix'] = None
        sourceDict['SSNVerificationStatus'] = 0
        sourceDict['IDVerificationStatus'] = 0
        sourceDict['IDLink'] = None
        sourceDict['defaultAccountID'] = None
        sourceDict['defaultItemID'] = None
        sourceDict['plaidIdentityVerificationID'] = None
        return Tryvestor.readFromDict(sourceDict, tryvestorID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["tryvestorID"] = self.tryvestorID
        toReturn['DOB'] = date.isoformat(toReturn['DOB'].date())
        del toReturn["SSNPrefix"]
        return toReturn


class TryvestorAddress:
    def __init__(self, streetAddress, unit, city, state, postalCode):
        self.streetAddress = streetAddress
        self.unit = unit
        self.city = city
        self.state = state
        self.postalCode = postalCode

    @staticmethod
    def createNewUser():
        return TryvestorAddress(
            streetAddress=None,
            unit=None,
            city=None,
            state=None,
            postalCode=None,
        )

    @staticmethod
    def fromDict(sourceDict):
        print(sourceDict)
        return TryvestorAddress(
            streetAddress=str(sourceDict["streetAddress"]),
            unit=None if (sourceDict.get("unitNum") is None or sourceDict.get("unitNum") == "") else str(
                sourceDict["unit"]),
            city=str(sourceDict["city"]),
            state=str(sourceDict["state"]),
            postalCode=str(sourceDict["postalCode"]),
        )

    def toDict(self):
        return {
            'streetAddress': self.streetAddress,
            'unit': self.unit,
            'city': self.city,
            'state': self.state,
            'postalCode': self.postalCode,
        }


def encryptSSN(rawSSN):
    cleanedSSN = ''.join(c for c in rawSSN if c.isdigit())
    return cleanedSSN[:5], cleanedSSN[5:]
