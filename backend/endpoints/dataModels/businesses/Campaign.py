from datetime import datetime, timezone, time
from dateutil.relativedelta import relativedelta


class Campaign:
    def __init__(self, campaignID, stockBackPercent, maxStockReward, valuationForCampaign, startDate, endDate, creationDate):
        self.campaignID = campaignID
        self.stockBackPercent = stockBackPercent
        self.maxStockReward = maxStockReward
        self.valuationForCampaign = valuationForCampaign
        self.startDate = startDate
        self.endDate = endDate
        self.creationDate = creationDate

    @staticmethod
    def readFromFirebaseFormat(sourceDict, campaignID):
        return Campaign(
            campaignID=str(campaignID),
            stockBackPercent=float(sourceDict["stockBackPercent"]),
            maxStockReward=float(sourceDict["maxStockReward"]),
            valuationForCampaign=int(sourceDict["valuationForCampaign"]),
            startDate=sourceDict['startDate'],
            endDate=sourceDict['endDate'],
            creationDate=sourceDict['creationDate']
        )

    def writeToFirebaseFormat(self):
        return {
            "stockBackPercent": self.stockBackPercent,
            "maxStockReward": self.maxStockReward,
            "valuationForCampaign": self.valuationForCampaign,
            'startDate': self.startDate,
            'endDate': self.endDate,
            'creationDate': self.creationDate,
        }

    @staticmethod
    def readFromDict(sourceDict, campaignID):
        sourceDict['creationDate'] = datetime.fromisoformat(sourceDict['creationDate'])
        sourceDict['startDate'] = datetime.fromisoformat(sourceDict['startDate'])
        sourceDict['endDate'] = datetime.fromisoformat(sourceDict['endDate'])
        return Campaign.readFromFirebaseFormat(sourceDict, campaignID)

    @staticmethod
    def createFromDict(sourceDict, campaignID):
        sourceDict['creationDate'] = datetime.now(timezone.utc).isoformat()
        oldStartDate = datetime.fromisoformat(sourceDict['startDate'])
        sourceDict['startDate'] = datetime.combine(oldStartDate.date(), time(tzinfo=timezone.utc), tzinfo=timezone.utc).isoformat()
        oldEndDate = datetime.fromisoformat(sourceDict['endDate'])
        print(oldEndDate.date())
        sourceDict['endDate'] = datetime.combine(oldEndDate.date(), time(tzinfo=timezone.utc), tzinfo=timezone.utc).isoformat()
        return Campaign.readFromDict(sourceDict, campaignID)

    def writeToDict(self):
        toReturn = self.writeToFirebaseFormat()
        toReturn["creationDate"] = self.creationDate.isoformat()
        toReturn["startDate"] = self.startDate.isoformat()
        toReturn["endDate"] = self.endDate.isoformat()
        toReturn["campaignID"] = self.campaignID
        return toReturn