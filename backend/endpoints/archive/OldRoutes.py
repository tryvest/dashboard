# Announcements Routes
'''
@busApi.route('/announcements')
class AllAnnouncements(Resource):
    def get(self):
        announcements = db.collection("announcements").stream()
        toReturn = []
        for announcement in announcements:
            announcementID = announcement.id
            announcementDict = announcement.to_dict()
            singleAnnouncementJson = Announcement.readFromFirebaseFormat(sourceDict=announcementDict,
                                                                         announcementID=announcementID)
            toReturn.append(singleAnnouncementJson)
        return toReturn

    def post(self):
        print("got into here")
        announcementData = request.json
        businessID = request.json["businessID"]
        announcementDoc = db.collection("businesses").document(businessID).collection("announcements").document()
        verifiedAnnouncementJson = Announcement.createFromDict(sourceDict=announcementData,
                                                               announcementID=announcementDoc.id).writeToFirebaseFormat()
        announcementDoc.set(verifiedAnnouncementJson)
        return announcementDoc.id


@busApi.route('/announcements/<string:announcementID>')
class SpecificAnnouncement(Resource):
    def put(self, announcementID):
        try:
            announcementUpdateData = request.json
            announcementDoc = db.collection('announcements').document(announcementID)
            announcementDocSnapDict = announcementDoc.get().to_dict()
            verifiedAnnouncement = Announcement.readFromDict(sourceDict=announcementDocSnapDict,
                                                             announcementID=announcementID)
            verifiedAnnouncement.updateFromDict(announcementUpdateData)
            announcementDoc.update(verifiedAnnouncement)
            return "Successfully made changes."
        except:
            return "There was an error in updating!"
'''


# Term Documents Routes
'''
@busApi.route("/termDocuments/verifyResponse")
class VerifyResponse(Resource):
    def put(self):
        responseUpdateData = request.json
        responseDocArray = db.collection("termDocuments").document(responseUpdateData["termDocID"]).collection(
            "responses").where("tryvestorID", "==", responseUpdateData["tryvestorID"]).stream()
        responseDoc = list(responseDocArray)[0].reference
        responseDoc.update({"verificationStatus": responseUpdateData["newStatus"]})

    def get(self):
        termDocID = request.args.get("termDocID")
        tryvestorID = request.args.get("tryvestorID")
        print(termDocID)
        print(tryvestorID)
        responseDocArray = db.collection("termDocuments").document(termDocID).collection(
            "responses").where("tryvestorID", "==", tryvestorID).stream()
        toReturn = []
        for response in responseDocArray:
            cleanedResponse = TermResponse.readFromFirebaseFormat(response.to_dict(), response.id).writeToDict()
            toReturn.append(cleanedResponse)
        return toReturn
        
@busApi.route("/termDocuments/responses")
class TermDocumentUsers(Resource):
    def post(self):
        termDocUpdateData = request.json
        username = termDocUpdateData["username"]
        userDocSnapshot = db.collection("tryvestors").where("username", "==", username).stream()
        termDocResponses = db.collection("termDocuments").document(termDocUpdateData["termDocID"]).collection(
            "responses")
        userDocID = list(userDocSnapshot)[0].id
        newResponse = TermResponse.createFromDict({
            "tryvestorID": userDocID,
            "verificationStatus": 0,
        }, "FillerID").writeToFirebaseFormat()
        dateCreated, response = termDocResponses.add(newResponse)
        return response.id

    @api.doc(params={"termDocID": {"description": "firestore document id of term doc", "type": "String"}})
    def get(self):
        termDocID = request.args.get("termDocID")
        termDocResponses = db.collection("termDocuments").document(termDocID).collection("responses").stream()
        returnableResponses = []
        for response in termDocResponses:
            cleanedResponse = TermResponse.readFromFirebaseFormat(response.to_dict(), response.id).writeToDict()
            returnableResponses.append(cleanedResponse)
        return returnableResponses

@busApi.route("/termDocuments/results")
class ResultsLink(Resource):
    @api.doc(params={
        "businessID": {"description": "Firebase document id of the business to get results", "type": "String"},
        "termDocNum": {"description": "Starting at 1, which task do you want for the business", "type": "Integer"}
    })
    def get(self):
        busID = request.args.get("businessID")
        termDocNum = int(request.args.get("termDocNum"))
        termDocs = db.collection("termDocuments").where("businessID", "==", busID).order_by("creationDate").stream()
        termDocDict = list(termDocs)[termDocNum - 1].to_dict()
        return termDocDict["resultsLink"]


@busApi.route("/termDocuments")
class TermDocuments(Resource):
    def post(self):
        termDocData = request.json
        termDoc = db.collection("termDocuments").document()
        toAdd = TermDocument.createFromDict(sourceDict=termDocData, termDocumentID=termDoc.id).writeToFirebaseFormat()
        termDoc.set(toAdd)
        return termDoc.id
'''