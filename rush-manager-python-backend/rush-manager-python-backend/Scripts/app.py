from hashlib import new
from pickle import NONE
from flask import request
from flask import Flask

# from redisearch import Client

import time
import redis 
# from redisearch import Client, TextField, NumericField, FT
import redis 
import bcrypt
import json
app = Flask(__name__)

# client = Client('myIndex')
# FT.CREATE(idx:movie ON hash PREFIX 1 "movie:" SCHEMA title TEXT SORTABLE)
# client.create_index([TextField('title', weight=5.0), TextField('body')])
# client.add_document('doc1', title = 'RediSearch', body = 'Redisearch impements a search engine on top of redis')
# res = client.search("search engine")

# print(res.total)

import couchdb
couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
try:
  db = couch['testdb']
except:
  db = None
  print("couch down")

redis = redis.Redis()
redisRusheeHash = "rusheeHash"
redisBrotherHash = "brotherHash"

# client = Client("my-index")

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
      elif(split[0] == "REDIS"):
        if(split[1] == "addAsUser"):
          if(split[2] == "rushee"):
         
            res = redisAddRushee(split[3], split[4].replace("\n", ""))
            if res:
              line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] + "%&%" + split[4]
              newFile.append(line)
            else:
              newFile.append(line)
          elif(split[2] == "brother"):
            res = redisAddBrother(split[3], split[4].replace("\n", ""))
            if res:
              line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] + "%&%" + split[4]
              newFile.append(line)
            else:
              newFile.append(line)
        elif(split[1] == "delUser"):
          if(split[2] == "rushee"):
            res = redisDeleteRushee(split[3].replace("\n", ""))
            if res:
              line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3]
              newFile.append(line)
            else:
              newFile.append(line)
          elif(split[2] == "brother"):
            res = redisDeleteBrother(split[3].replace("\n", ""))
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

def redisAddBrother(name, username):
  redis.hset(redisBrotherHash, name, username)
  redisGetBrothers()
  return True

def redisDeleteBrother(name):
  redis.hdel(redisBrotherHash, name)
  redisGetBrothers()
  return True

def redisGetBrothers():
  print("getting redis brothers")
  brothers = redis.hgetall(redisBrotherHash)
  print(brothers)

def redisAddRushee(name, username):
  print(name, username)
  #queue("REDIS%&%addAsUser%&%rushee%&%" + name + "%&%" + username)
  redis.hset(redisRusheeHash, name, username)
  redisGetRushees()
  return True

def redisDeleteRushee(name):
  print(name)
  redis.hdel(redisRusheeHash, name)
  redisGetRushees()
  return True

def redisGetRushees():
  print("getting redis rushees")
  rushees = redis.hgetall(redisRusheeHash)
  print(rushees)

@app.route("/searchRushee", methods = ['POST'])
def redisSearch():
  if request.method == 'POST':
    data = request.get_json().get('body')
    
  name = data.get('body')
  print(name)

  # name = data.get('first') + " " + data.get('last')
  try:
    rushee = redis.hget(redisRusheeHash, name).decode('utf-8')
    userQuery = {'selector': {'username': rushee}}
    res = db.find(userQuery)
    data = []
    for item in res:
      data.append(item)
    print(data)
    return data

  except:
    return []
  
  
  

@app.route("/login", methods = ['POST'])
def login():
  # redisAddRushee("Jared", "Petrisko")
  #queue("REDIS%&%addAsUser%&%rushee%&%" + "jake" + "%&%" + "jakey1")
  
  redisGetRushees()
  redisGetBrothers()
  data = ""
  password = ""
  if request.method == 'POST':
    data = request.get_json().get('body')
    password = data.get('password').encode('utf-8')

  salt = bcrypt.gensalt()
  hash = bcrypt.hashpw("password".encode('utf-8'), salt)
  getQuery = {'selector': {'username': data.get('username')}}   
  res = db.find(getQuery)
  user = None
  for doc in res:
    user = doc
  if(user):
    userHashedPass = user['password'].encode('utf-8')
    res = bcrypt.checkpw(password, userHashedPass)
    return {'result': res, 'accountType': user['type'], 'username': user['username']}
  else:
    return {'result': False, 'accountType': "", 'username': "", 'message': "No user found."}

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
  try: 
    photo = data.get('photoURL')
  except: photo = None
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
    "photoURL": data.get('photoURL')
    }
    queue("REDIS%&%addAsUser%&%brother%&%" + data.get('first') + " " + data.get('last') + "%&%" + data.get('username'))

  elif(type == "rushee"):
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
      "photoURL": data.get('photoURL'),
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
    queue("REDIS%&%addAsUser%&%rushee%&%" + data.get('first') + " " + data.get('last') + "%&%" + data.get('username'))
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
    data = request.get_json().get('body')
  # searchInput = ""
  print(data)
  query = data.get('query') #username
  queue("TODO%&%" + "deleteRushee%&%" + query)
  queue("REDIS%&%delUser%&%rushee%&%" + data.get('first') + " " + data.get('last'))

  
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
  queue("TODO%&%" + "deleteBrother%&%" + data)
  queue("REDIS%&%delUser%&%brother%&%" + data.get('first') + " " + data.get('last'))
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
  #TODO add to queue
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
  #TODO add to queue
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
  #TODO add to queue
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
  #TODO add to queue
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
  #we dont use this on the front end yet 
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
  #we dont use this on the front end yet 
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
  #TODO add to queue
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


# @app.route("/getInterestedIn")
# def getInterestedIn():
#   #returns all rushees a frat is interested in
#   findRushees = {'selector': {'$and': [{'type': 'rushee'}, {'fraternityInfo': {"FIJI": {'interested':True}}}]}}
#   res = db.find(findRushees)
#   for doc in res:
#     print(doc)
#   return "All rushees FIJI is interested in"

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