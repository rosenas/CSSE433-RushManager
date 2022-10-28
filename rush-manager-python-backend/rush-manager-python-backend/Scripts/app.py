from hashlib import new
from pickle import NONE
from flask import request
from flask import Flask
import time
import bcrypt
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
        if(split[1] == "addUser"):
          res = couchAddUser(json.loads(split[2]))
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
        elif(split[1] == "changeUserType"):
          print(split)
          res = couchChangeUserType(split[3].strip(), split[2].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "deleteBrother"):
          res = couchDeleteBrother((split[2]).strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "addEvent"):
          res = couchAddEvent((split[2]).strip(), split[3].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "deleteEvent"):
          res = couchDeleteEvent((split[2]).strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2]
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "changeRSVP"):
          res = couchRSVP((split[2]).strip(), split[3].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] 
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



@app.route("/login", methods = ['POST'])
def login():
  #admin, password

  #hashedPass = b'$2b$12$6hTNWdMElHpFGqLWJDo3cOp2SuYmg1d6ft54naXiS67/3cJeM6ky6'
  #from a rush chairs "add rushee button"
  data = ""
  #print("Logging in")
  password = ""
  if request.method == 'POST':
    data = request.get_json().get('body')
    #print(data)
    #print(data.get('username'))
    #print(data.get('password'))
    password = data.get('password').encode('utf-8')

  salt = bcrypt.gensalt()
  hash = bcrypt.hashpw("password".encode('utf-8'), salt)
  print(hash)
  getQuery = {'selector': {'username': data.get('username')}}   
  res = db.find(getQuery)
  user = None
  for doc in res:
    user = doc
  if(user):
    userHashedPass = user['password'].encode('utf-8')
    res = bcrypt.checkpw(password, userHashedPass)
    #print(res)
    return {'result': res, 'accountType': user['type'], 'username': user['username']}
  else:
    return {'result': False, 'accountType': "", 'username': "", 'message': "No user found."}
  #return {'result': res, 'accountType': "Admin", 'username': "rippy"}

@app.route("/createUser", methods = ['POST'])
def createUser():
  #from a rush chairs "add rushee button"
  data = ""
  print("CREATE USER")
  if request.method == 'POST':
    data = request.get_json().get('body')

  if(data.get('accountType') == "brother"):
    addUser(data, "requestedBrother")
  if(data.get('accountType') == "rushee"):
    addUser(data, "requestedRushee")
  return []
  

@app.route("/getRushees")
def getRushees():
  readQueue()
  type = "rushee"
  getQuery = {'selector': {'type': type}}
  res = db.find(getQuery)
  data = []
  for doc in res:
    data.append(doc)
  return data

@app.route("/getOurRushees")
def getOurRushees():
  print("GETTING RUSHEES")
  readQueue()
  type = "rushee"
  getQuery = {'selector': {'$and': [{'type': type}, {'fraternityInfo': {"FIJI": {'interested':True}}}]}}   
  res = db.find(getQuery)
  data = []
  for doc in res:
    data.append(doc)
  return data

def addUser(data, type):
  salt = bcrypt.gensalt()
  hashed = bcrypt.hashpw(data.get("password").encode('utf-8'), salt).decode('utf-8')
  if(type == "brother"):
    doc = {
    "type": type,
    "first": data.get('first'),
    "last": data.get('last'),
    "email": data.get('email'),
    "major": data.get('major'),
    "password": hashed,
    "housing": data.get('housing'),
    "interests": [],
    "fraternity": "FIJI",
    "username": data.get('username'),
    "phone": data.get('phone'),
  }
  else:
    doc = {
      "type": type,
      "first": data.get('first'),
      "last": data.get('last'),
      "email": data.get('email'),
      "major": data.get('major'),
      "password": hashed,
      "housing": data.get('housing'),
      "interests": [],
      "interestedInFIJI": False,
      "username": data.get('username'),
      "phone": data.get('phone'),
      "fraternityInfo": {
        "FIJI":
        {
          "frat": "FIJI", 
          "bidStatus": False,
          "rating": 'none',
          "comments": [],
          "likes": [],
          "interested": True,
          "needsDiscussion": False
        }
      }
    }
  if(type == "requestedRushee"):
    doc['type'] = "rushee"
    doc['fraternityInfo']["FIJI"]['interested'] = False
  elif(type == "requestedBrother"):
    doc['type'] = "requestedBrother"
    doc['fraternityInfo']["FIJI"]['interested'] = False
  queue("TODO%&%" + "addUser%&%" + json.dumps(doc))
  return True

@app.route("/addRushee", methods = ['POST'])
def addRushee():
  #from a rush chairs "add rushee button"
  data = ""
  print("ADDING RUSHEE")
  if request.method == 'POST':
    data = request.get_json().get('body')
  addUser(data, "rushee")
  #queue("TODO%&%changeUserType%&%rushee%&%" + data.get('username'))
  
  
  return "Rushee added"


@app.route("/addAsBrother", methods = ['POST'])
def addAsBrother():
  #from a rush chairs "add rushee button"
  data = ""
  print("ADDING AS BROTHER")
  if request.method == 'POST':
    data = request.get_json().get('body')
  print(data)
  queue("TODO%&%changeUserType%&%brother%&%" + data.get('username'))
  
  
  return "Rushee added"


def couchChangeUserType(username, type):
  if not db:
    return False
  userQuery = {'selector': {'username': username}}
  res = db.find(userQuery)
  for doc in res:
    doc["type"] = type
    db.save(doc)
  return True


def couchAddUser(doc):
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
  readQueue()
  type = "brother"
  frat = "FIJI"
  getQuery = {'selector': {'$or': [{'type': "brother"}, {'type': "requestedBrother"}]}}   
  res = db.find(getQuery)
  data = []
  for doc in res:
    data.append(doc)
  return data

@app.route("/addBrother", methods = ['POST'])
def addBrother():
  #from admin's add brother button
  data = ""
  print("ADDING BROTHER")
  if request.method == 'POST':
    data = request.get_json().get('body')
  addUser(data, "brother")
  
  return "Brother added"


@app.route("/deleteBrother", methods = ['POST'])
def deleteBrother():

  data = ""
  if request.method == 'POST':
    data = request.get_json().get('body').get('query')
  # searchInput = ""
  queue("TODO%&%" + "deleteBrother%&%" + data)
  
  return "Brother deleted"


def couchDeleteBrother(data):
  if not db:
    return False
  userQuery = {'selector': {'$and': [{'$or': [{'type': "brother"}, {'type': "requestedBrother"}]}, {'$or': [{'email': data}, {'username': data}]}]}}
  res = db.find(userQuery)
  for doc in res:
    db.delete(doc)
  #TODO 
  #check what res returns if the save was unsuccessful
  return True

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


@app.route("/changeFratInterest", methods = ['POST'])
def changeFratInterest():
  #TODO add to queu
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body').get('query')
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': inp}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['interested'] = not doc['fraternityInfo']["FIJI"]['interested']
    db.save(doc)
  return []


@app.route("/likeRushee", methods = ['POST'])
def likeRushee():
  #TODO add to queu
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['likes'].append(brother)
    db.save(doc)
  return []


@app.route("/dislikeRushee", methods = ['POST'])
def dislikeRushee():
  #TODO add to queu
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['likes'].remove(brother)
    db.save(doc)
  return []




@app.route("/changeBid", methods = ['POST'])
def changeBid():
  #TODO add to queu
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('query')
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
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

@app.route("/addComment", methods = ['POST'])
def addComment():
  #need rushee's username, comment, username of brther who left comment
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': inp.get('rushee')}]}}
  res = db.find(rusheeQuery)
  comment = {'comment': inp.get('comment'), 'user': inp.get('user')}
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['comments'].append(comment)
    db.save(doc)
    print(doc)

  return {}


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
  readQueue()
  type = "event"
  getQuery = {'selector': {'type': type}}
  res = db.find(getQuery)
  data = []
  for doc in res:
    data.append(doc)
  return data
  

@app.route("/addEvent", methods = ['POST'])
def addEvent():
  print("ADD EVENT")
  data = ""
  if request.method == 'POST':
    data = request.get_json()
  queue("TODO%&%addEvent%&%" + data["name"] + "%&%" + data["date"])
  return {}

def couchAddEvent(name, date):
  if not db:
    return False
  doc = {
    "type": "event",
    "name": name,
    "date": date,
    "attended": []
  }
  res = db.save(doc)
  return True

@app.route("/changeRSVP", methods = ['POST'])
def addRSVP():
  data = ""
  
  if request.method == 'POST':
    data = request.get_json().get('body')
  print(data)

  queue("TODO%&%changeRSVP%&%" + data["event"] + "%&%" + data["username"])
  return {}

# @app.route("/removeRSVP", methods = ['POST'])
# def removeRSVP():
  
#   if request.method == 'POST':
#     data = request.get_json()

#   queue("TODO%&%removeRSVP%&%" + data["eventName"] + "%&%" + data["username"])
#   return {}

def couchRSVP(eventName, username):
  if not db:
    return False
  getQuery = {'selector': {'$and': [{'type': 'event'}, {'name': eventName}]}}
  res = db.find(getQuery)
  data = ""
  for doc in res:
    data = doc
  if(username in doc['attended']):
    data['attended'].remove(username)
  else:
    data['attended'].append(username)
  db.save(data)

  return True



@app.route("/deleteEvent", methods = ['POST'])
def deleteEvent():
  print("DEL EVENT")
  data = ""
  if request.method == 'POST':
    data = request.get_json()
  queue("TODO%&%deleteEvent%&%" + data["name"])
  return {}

def couchDeleteEvent(name):
  if not db:
    return False
  eventQuery = {'selector': {'$and': [{'type': "event"}, {'name': name}]}}
  res = db.find(eventQuery)
  ret = None
  for doc in res:
    ret = db.delete(doc)
  #TODO : Check ret
  return True

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)