from datetime import datetime, timezone


class Announcement:
    def __init__(self, announcementID, businessID, category, title, body, viewStatus, creationDate, lastEditDate):
        self.announcementID = announcementID
        self.businessID = businessID
        self.category = category
        self.title = title
        self.body = body
        self.viewStatus = viewStatus
        self.creationDate = creationDate
        self.lastEditDate = lastEditDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, announcementID):
        return Announcement(
            announcementID=str(announcementID),
            businessID=str(sourceDict["businessID"]),
            category=str(sourceDict["category"]),
            title=str(sourceDict["title"]),
            body=str(sourceDict["body"]),
            viewStatus=bool(sourceDict["viewStatus"]),
            creationDate=sourceDict["creationDate"],
            lastEditDate=sourceDict["lastEditDate"]
        )

    def writeToFirebaseFormat(self):
        return {
            "category": self.category,
            "title": self.title,
            "body": self.body,
            "viewStatus": self.viewStatus,
            "creationDate": self.creationDate,
            "lastEditDate": self.lastEditDate
        }

    @staticmethod
    def readFromDict(sourceDict, announcementID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict["creationDate"])
        sourceDict['lastEditDate'] = datetime.fromisoformat(sourceDict["lastEditDate"])
        return Announcement.readFromFirebaseFormat(sourceDict, announcementID)

    @staticmethod
    def createFromDict(sourceDict, announcementID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        sourceDict['lastEditDate'] = datetime.now(timezone.utc).isoformat()
        return Announcement.readFromDict(sourceDict, announcementID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["lastEditDate"] = self.lastEditDate.isoformat()
        toReturn["announcementID"] = self.announcementID
        toReturn["businessID"] = self.businessID
        return toReturn

    def updateFromDict(self, announcementUpdateData):
        self.category = str(announcementUpdateData["category"])
        self.title = str(announcementUpdateData["title"])
        self.body = str(announcementUpdateData["body"])
        self.viewStatus = bool(announcementUpdateData["viewStatus"])
        self.lastEditDate = datetime.now(timezone.utc)