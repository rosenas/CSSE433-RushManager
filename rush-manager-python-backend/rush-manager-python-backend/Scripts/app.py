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
  searchInput = ""
  userQuery = {'selector': {'$and': [{'type': "brother"}, {'$or': [{'email': searchInput}, {'username': searchInput}]}]}}
  res = db.find(userQuery)
  for doc in res:
    db.delete(doc)
  return "Brother deleted"

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
  #       'needsDiscussion': False
  #     }
  #   }
  # }
  # db.save(doc)
  return "Rushee added"

@app.route("/deleteRushee")
def deleteRushee():
  searchInput = ""
  userQuery = {'selector': {'$and': [{'type': "rushee"}, {'$or': [{'email': searchInput}, {'username': searchInput}]}]}}
  res = db.find(userQuery)
  for doc in res:
    db.delete(doc)
  return "Rushee deleted"

@app.route("/searchBrother")
def searchBrother():
  #need name, username, etc
  inp = ""
  fullname = inp
  fullname = fullname.split(' ')
  if(len(fullname) == 1):
    fullname.append("A") #handles only giving a first / last name, not a full name
  findBrother = {'selector': {'$and': [{'type': "brother"}, {'$or': [{'$and': [{'first': fullname[0].strip()}, {'last': fullname[1].strip()}]}, {'email': inp}, {'username': inp}, {'first': inp}, {'last': inp}]}]}}
  res = db.find(findBrother)
  for row in res:
    print(row['first'], row['last'], row['email'], row['username'])

@app.route("/searchRushee")
def searchRushee():
  #need name, username, etc
  inp = ""
  fullname = inp
  fullname = fullname.split(' ')
  if(len(fullname) == 1):
    fullname.append("A") #handles only giving a first / last name, not a full name
  findBrother = {'selector': {'$and': [{'type': "brother"}, {'$or': [{'$and': [{'first': fullname[0].strip()}, {'last': fullname[1].strip()}]}, {'email': inp}, {'username': inp}, {'first': inp}, {'last': inp}]}]}}
  res = db.find(findBrother)
  for row in res:
    print(row['first'], row['last'], row['email'], row['username'])

@app.route("/changeFratInterest")
def changeFratInterest():
  #need rushee's username
  inp = ""
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['interested'] = not doc['fraternityInfo']["FIJI"]['interested']
    db.save(doc)

@app.route("/changeBid")
def changeBid():
  inp = ""
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['bidStatus'] = not doc['fraternityInfo']["FIJI"]['bidStatus']
    db.save(doc)

@app.route("/addRating")
def addRating():
  #need rushee's username, rating
  inp = ""
  rating = ""
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['rating'] = rating
    db.save(doc)

@app.route("/needsDiscussion")
def needsDiscussion():
  #need rushee's username
  inp = ""
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['needsDiscussion'] = not doc['fraternityInfo']["FIJI"]['needsDiscussion']
    db.save(doc)

@app.route("/addComment")
def addComment():
  #need rushee's username, comment, username of brther who left comment
  inp = ""
  comment = ""
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['comments'].append(comment)
    db.save(doc)

@app.route("/getInterestedIn")
def getInterestedIn():
  #returns all rushees a frat is interested in
  findRushees = {'selector': {'$and': [{'type': 'rushee'}, {'fraternityInfo': {"FIJI": {'interested':True}}}]}}
  res = db.find(findRushees)
  for doc in res:
    print(doc)
  return "All rushees FIJI is interested in"

@app.route("/changeRusheeInterest")
def changeRusheeInterest():
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