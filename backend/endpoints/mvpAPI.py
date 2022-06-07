from flask import Flask, request
from flask_restx import Api, Resource
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("valued-throne-350421-firebase-adminsdk-8of5y-cc6d986bb9.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

flaskApp = Flask(__name__)

baseRoute = "/api"
businessRoute = "/businesses"
tryvestorRoute = "/tryvestors"
api = Api(app=flaskApp, prefix=baseRoute)
busApi = api.namespace('businesses', description="For business side requests")
tryApi = api.namespace('tryvestors', description="For tryvestor side requests")


class Business:
    def __init__(self, docId, name, description, topics, valuation, totalShares, termGroups, logo, media):
        self.media = media
        self.logo = logo
        self.termGroups = termGroups
        self.totalShares = totalShares
        self.valuation = valuation
        self.topics = topics
        self.description = description
        self.name = name
        self.docId = docId

    def toDict(self):
        return {
            "id": self.docId,
            "name": self.name,
            "description": self.description,
            "topics": self.topics,
            "valuation": self.valuation,
            "totalShares": self.totalShares,
            "termGroups": self.termGroups,
            "logo": self.logo,
            "media": self.media,
        }

    def asJson(self):
        return self.toDict()

    @staticmethod
    def getTermGroupsJSONByCompanyID(companyID):
        returnObj = {
            "l1": "Outer layer",
            "l2": {
                "1": "Inner Layer"
            },
            "l3": [
                {
                    "1": "Inner Array Element 1"
                },
                {
                    "2": "Inner Array Element 2"
                },
            ]
        }
        return returnObj
        # NotImplementedError()


# @busApi.route("/")
# class busHello(Resource):
#     def get(self):
#         return 'Business Hello, Get!'
#
#     def post(self):
#         return 'Business Hello, Post!'


@busApi.route("/") # http://127.0.0.1:5000/api/businesses/
class AllBusinesses(Resource):
    def get(self):
        businesses = db.collection("businesses").stream()
        result = []
        for business in businesses:
            busId = business.id
            business = business.to_dict()
            toAdd = Business(
                media=business["media"],
                logo=business["logo"],
                termGroups=business["termGroups"],
                totalShares=business["totalShares"],
                valuation=business["valuation"],
                topics=business["topics"],
                description=business["description"],
                name=business["name"],
                docId=busId
            )
            result.append(toAdd.asJson())
        return result

    def post(self):
        businessData = request.json
        busDoc = db.collection('businesses').document()
        toAdd = Business(
            media=businessData["media"],
            logo=businessData["logo"],
            termGroups=[],
            totalShares=businessData["totalShares"],
            valuation=businessData["valuation"],
            topics=businessData["topics"],
            description=businessData["description"],
            name=businessData["name"],
            docId=busDoc.id
        )
        busDoc.set(toAdd.toDict())
        return busDoc.id

@busApi.route("/<string:businessID>")
class SpecificBusiness(Resource):
    def get(self, businessID):
        business = db.collection("businesses").document(businessID).get()
        if not business.exists:
            return "Error"
        business = business.to_dict()
        result = Business(
            media=business["media"],
            logo=business["logo"],
            termGroups=Business.getTermGroupsJSONByCompanyID(businessID),
            totalShares=business["totalShares"],
            valuation=business["valuation"],
            topics=business["topics"],
            description=business["description"],
            name=business["name"],
            docId=businessID
        )
        return result.asJson()


@tryApi.route("/")
class tryHello(Resource):
    def get(self):
        return 'Tryvestor Hello, Get!'

    def post(self):
        return 'Tryvestor Hello, Post!'


flaskApp.run()