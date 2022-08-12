from datetime import datetime, timezone


class TermResponse:
    def __init__(self, tryvestorID, verificationStatus, termResponseID, creationDate):
        self.tryvestorID = tryvestorID
        self.verificationStatus = verificationStatus
        self.termResponseID = termResponseID
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, termResponseID):
        return TermResponse(
            termResponseID=str(termResponseID),
            tryvestorID=str(sourceDict["tryvestorID"]),
            verificationStatus=int(sourceDict["verificationStatus"]),
            creationDate=sourceDict["creationDate"]
        )

    def writeToFirebaseFormat(self):
        return {
            "tryvestorID": self.tryvestorID,
            "verificationStatus": self.verificationStatus,
            "creationDate": self.creationDate
        }

    @staticmethod
    def readFromDict(sourceDict, termResponseID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict["creationDate"])
        return TermResponse.readFromFirebaseFormat(sourceDict, termResponseID)

    @staticmethod
    def createFromDict(sourceDict, termResponseID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        return TermResponse.readFromDict(sourceDict, termResponseID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["termResponseID"] = self.termResponseID
        return toReturn