from datetime import datetime, timezone, time

class Category:
    def __init__(self, categoryID, categoryName, creationDate):
        self.categoryID = categoryID
        self.categoryName = categoryName
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, categoryID):
        return Category(
            categoryID=str(categoryID),
            categoryName=str(sourceDict["categoryName"]),
            creationDate=sourceDict['creationDate'],
        )

    def writeToFirebaseFormat(self):
        return {
            "categoryName": self.categoryName,
            "creationDate": self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict, categoryID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        return Category.readFromFirebaseFormat(sourceDict, categoryID)

    @staticmethod
    def createFromDict(sourceDict, categoryID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return Category.readFromDict(sourceDict, categoryID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["categoryID"] = self.categoryID
        return toReturn