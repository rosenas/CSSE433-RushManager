from urllib import request
from flask import Flask
app = Flask(__name__)
import couchdb
couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
db = couch['testdb']

@app.route("/")
def hello():
  return "Connected to python!"


@app.route("/getRushees")
def getRushees():
  type = "rushee"
  getQuery = {'selector': {'type': type}}          
  res = db.find(getQuery)
  for doc in res:
    print(doc)
  #return res
  return "Getting the rushees"

@app.route("/getBrothers")
def getRushees():
  type = "brother"
  frat = "FIJI"
  getQuery = {'selector': {'$and': [{'type': type}, {'fraternity': frat}]}}        
  res = db.find(getQuery)
  for doc in res:
    print(doc)
  #return res
  return "Getting brothers"

@app.route("/addBrother")
def addBrother():
  # doc = {
  #   'type': 'brother',
  #   'first': first,
  #   'last': last,
  #   'email': email,
  #   'major': major,
  #   'username': username,
  #   'phone': phone,
  #   'interests': [],
  #   'fraternity': fraternity
  # }
  # db.save(doc)
  return "Brother added"

@app.route("/deleteBrother")
def deleteBrother():
  None

@app.route("/addRushee")
def addRushee():
  # doc = {
  #   'type': 'rushee',
  #   'first': first,
  #   'last': last,
  #   'email': email,
  #   'major': major,
  #   'reshall': reshall,
  #   'interests': [],
  #   'fraternitiesInterestedIn': [],
  #   'username': username,
  #   'phone': phone,
  #   'fraternityInfo': {
  #     'FIJI':
  #     {
  #       'frat': 'FIJI', 
  #       'bidStatus': False,
  #       'rating': 'none',
  #       'comments': [],
  #       'interested': False,
  #       'needsDiscussion': 'no'
  #     }
  #   }
  # }
  # db.save(doc)
  return "Rushee added"

@app.route("/deleteRushee")
def deleteRushee():
  None

@app.route("/searchBrother")
def searchBrother():
  #need name, username, etc
  None

@app.route("/searchRushee")
def searchRushee():
  #need name, username, etc
  None

@app.route("/addInterest")
def addInterest():
  #need rushee's username
  None

@app.route("/changeBid")
def changeBid():
  #need rushee's username
  None

@app.route("/addRating")
def addRating():
  #need rushee's username, rating
  None

@app.route("/needsDiscussion")
def needsDiscussion():
  #need rushee's username
  None

@app.route("/addComment")
def addComment():
  #need rushee's username, comment, username of brther who left comment
  None

@app.route("/getInterestedIn")
def getInterestedIn():
  #returns all rushees a frat is interested in
  None

@app.route("/getRusheesInterestedIn")
def getRusheesInterestedIn():
  #returns all rushees that are interested in FIJI
  None

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