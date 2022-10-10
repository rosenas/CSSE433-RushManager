from urllib import request
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
  return "Connected to python!"


@app.route("/getRushees")
def getRushees():
  return "Getting the rushees"


@app.route("/getEvents")
def getEvents():
  return "Getting the events"

#TODO need to figure out how to do post request 
@app.route("/addEvent", methods = ['POST'])
def addEvent():
  if request.method == 'POST':
    data = request.form
    print(data["test"]) 
    return "Adding an event"

if __name__ == "__main__":
  app.run()