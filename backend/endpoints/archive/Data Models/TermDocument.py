from datetime import datetime, timezone


class TermDocument:
    def __init__(self, termDocumentID, formLink, description, resultsLink, businessID, numSharesAward, title,
                 creationDate):
        self.termDocumentID = termDocumentID
        self.formLink = formLink
        self.description = description
        self.resultsLink = resultsLink
        self.businessID = businessID
        self.numSharesAward = numSharesAward
        self.title = title
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, termDocumentID):
        return TermDocument(
            formLink=str(sourceDict["formLink"]),
            description=str(sourceDict["description"]),
            resultsLink=str(sourceDict["resultsLink"]),
            businessID=str(sourceDict["businessID"]),
            numSharesAward=float(sourceDict["numSharesAward"]),
            termDocumentID=str(termDocumentID),
            title=str(sourceDict["title"]),
            creationDate=sourceDict['creationDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "businessID": self.businessID,
            "description": self.description,
            "numSharesAward": float(self.numSharesAward),
            "formLink": self.formLink,
            "resultsLink": self.resultsLink,
            "title": self.title,
            "creationDate": self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, termDocumentID):
        sourceDict["creationDate"] = datetime.fromisoformat(sourceDict["creationDate"])
        TermDocument.readFromFirebaseFormat(sourceDict, termDocumentID)

    @staticmethod
    def createFromDict(sourceDict, termDocumentID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return TermDocument.readFromDict(sourceDict, termDocumentID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["termDocumentID"] = self.termDocumentID
        return toReturn