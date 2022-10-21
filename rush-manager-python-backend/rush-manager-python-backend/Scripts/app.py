from hashlib import new
from flask import request
from flask import Flask
import time
import json
app = Flask(__name__)
import couchdb
couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
try:
  db = couch['testdb']
except:
  db = None
  print("couch down")


def queue(action):
  with open("queue.txt", "a") as f:
    f.write(action)
    f.write("\n")
    f.close()
    readQueue()

@app.route("/refreshDatabase")
def readQueue():
  newFile = []
  with open("queue.txt", "r+") as f:
    data = list(f)
    for line in data:
      split = line.split("%&%")
      if(split[0] == "TODO"):
        if(split[1] == "addRushee"):
          res = couchAddRushee(json.loads(split[2]))
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "deleteRushee"):
          res = couchDeleteRushee((split[2]).strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] 
            newFile.append(line)
          else:
            newFile.append(line)
      else: #already done
        newFile.append(line)
        None
      
    f.close()
  f = open("queue.txt", "wt")
  f.truncate(0)
  f.writelines(newFile)
  return []


@app.route("/")
def hello():
  #queue("Connected")
  return "Connected to python!"


@app.route("/getRushees")
def getRushees():
  print("GETTING RUSHEES")
  readQueue()
  type = "rushee"
  getQuery = {'selector': {'type': type}}          
  res = db.find(getQuery)
  data = []
  for doc in res:
    data.append(doc)
  return data



@app.route("/addRushee", methods = ['POST'])
def addRushee():
  data = ""
  print("ADDING RUSHEE")
  if request.method == 'POST':
    data = request.get_json().get('body')
  doc = {
    "type": "rushee",
    "first": data.get('first'),
    "last": data.get('last'),
    "email": data.get('email'),
    "major": data.get('major'),
    "reshall": data.get('reshall'),
    "interests": [],
    "fraternitiesInterestedIn": [],
    "username": data.get('username'),
    "phone": data.get('phone'),
    "fraternityInfo": {
      "FIJI":
      {
        "frat": "FIJI", 
        "bidStatus": False,
        "rating": 'none',
        "comments": [],
        "interested": False,
        "needsDiscussion": False
      }
    }
  }
  queue("TODO%&%" + "addRushee%&%" + json.dumps(doc))
  
  return "Rushee added"

def couchAddRushee(doc):
  if not db:
    return False
  res = db.save(doc)
  #TODO 
  #check what res returns if the save was unsuccessful
  return True

@app.route("/deleteRushee", methods = ['POST'])
def deleteRushee():

  data = ""
  if request.method == 'POST':
    data = request.get_json().get('body').get('query')
  # searchInput = ""
  queue("TODO%&%" + "deleteRushee%&%" + data)
  
  return "Rushee deleted"


def couchDeleteRushee(data):
  if not db:
    return False
  userQuery = {'selector': {'$and': [{'type': "rushee"}, {'$or': [{'email': data}, {'username': data}]}]}}
  res = db.find(userQuery)
  for doc in res:
    db.delete(doc)
  #TODO 
  #check what res returns if the save was unsuccessful
  return True
  

@app.route("/getBrothers")
def getBrothers():
  type = "brother"
  frat = "FIJI"
  getQuery = {'selector': {'$and': [{'type': type}, {'fraternity': frat}]}}        
  res = db.find(getQuery)
  for doc in res:
    print(doc)
  #return res
  return res

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




#   @app.route("/addEvent", methods = ['POST'])
# def addEvent():
  
#   if request.method == 'POST':
#     data = request.get_json()
#     queue("adding event, " + data['test'])
#     print(data["test"]) 
#     return "Adding an event"

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

@app.route("/addEvent", methods = ['POST'])
def addEvent():
  
  if request.method == 'POST':
    data = request.get_json()
    queue("adding event, " + data['test'])
    print(data["test"]) 
    return "Adding an event"

# if __name__ == "__main__":
#   app.run()
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)