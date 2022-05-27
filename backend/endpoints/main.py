from flask import Flask

app = Flask(__name__)
baseRoute = "/api"
businessRoute = "/businesses"
tryvestorRoute = "/tryvestor"


@app.route('/')
def hello():
    return 'Hello, World!'