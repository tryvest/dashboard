class GenericUser:
    def __init__(self, userType, userID):
        self.userType = userType
        self.userID = userID

    @staticmethod
    def readFromFirebaseFormat(sourceDict, userID):
        return GenericUser(
            userType=sourceDict["userType"],
            userID=userID,
        )

    def writeToFirebaseFormat(self):
        return {
            'userType': self.userType,
        }

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn['userID'] = self.userID
        return toReturn