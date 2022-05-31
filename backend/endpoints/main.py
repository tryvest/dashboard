from flask import Flask
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

@busApi.route("/")
class busHello(Resource):
    def get(self):
        return 'Business Hello, Get!'

    def post(self):
        return 'Business Hello, Post!'

@tryApi.route("/")
class tryHello(Resource):
    def get(self):
        return 'Tryvestor Hello, Get!'

    def post(self):
        return 'Tryvestor Hello, Post!'


flaskApp.run()
