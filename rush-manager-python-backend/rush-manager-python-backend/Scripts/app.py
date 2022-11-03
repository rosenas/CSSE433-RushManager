from hashlib import new
from pickle import NONE
from flask import request
from flask import Flask
from neo4j import GraphDatabase

# from redisearch import Client

import time
import redis 
# from redisearch import Client, TextField, NumericField, FT
import redis 
import bcrypt
import json
app = Flask(__name__)

uri = "neo4j://localhost:7687"
# uri= "neo4j://433-09.csse.rose-hulman.edu:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))



def neoInit(tx):
  None
  # tx.run("CREATE (a:Interest {name: $football})", football = "clash")
  # tx.run("CREATE (a:Interest {name:$football})", football = "basket")
  # tx.run("CREATE (a:Interest {name:$football})", football = "ducks")
  # tx.run("CREATE (a:Interest {name:$football})", football = "basketball")
  # tx.run("CREATE (a:Interest {name:$football})", football = "golf")
  # tx.run("CREATE (a:Interest {name:$football})", football = "gpe")
  # tx.run("CREATE (a:Interest {name:$football})", football = "swimming")
  # tx.run("CREATE (a:Interest {name:$football})", football = "gaming")
  # tx.run("CREATE (a:Interest {name:$football})", football = "lifting")
  # tx.run("CREATE (a:Interest {name:$football})", football = "running")
  # tx.run("CREATE (a:Interest {name:$football})", football = "eating")
  # tx.run("CREATE (a:Interest {name:$football})", football = "bickic")

# with driver.session(database="neo4j") as session:
#   res = session.execute_write(neoInit)
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

#137.112.104.255:7474

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
          # print(split)
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
        elif(split[1] == "changeFratInterest"):
          res = couchChangeFratInterest((split[2]).strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "likeRushee"):
          res = couchLikeRushee((split[2]).strip(), split[3].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "dislikeRushee"):
          res = couchDislikeRushee((split[2]).strip(), split[3].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "changeBid"):
          res = couchChangeBid((split[2]).strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] 
            newFile.append(line)
          else:
            newFile.append(line)
        elif(split[1] == "addComment"):
          res = couchAddComment((split[2]).strip(), split[3].strip(), split[4].strip())
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] + "%&%" + split[4] 
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
        elif(split[1] == "delUser"):
          if(split[2] == "rushee"):
            res = redisDeleteRushee(split[2], split[3].replace("\n", ""))
            if res:
              line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3]
              newFile.append(line)
            else:
              newFile.append(line)
      elif(split[0] == "NEO4J"):
        if(split[1] == "addInterests"):
          res = False
          with driver.session(database="neo4j") as session:
            res = session.execute_write(neo4jAddUserAndInterests, split[2], split[3], split[4], split[5], split[6])
          #res = neo4jAddInterests(split[2], split[3], split[4], split[5])
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] + "%&%" + split[4] + "%&%" + split[5] + "%&%" + split[6]
            newFile.append(line)
          else:
            newFile.append(line)
          None
        elif(split[1] == "deleteUser"):
          res = False
          with driver.session(database="neo4j") as session:
            res = session.execute_write(neo4jDeleteUser, split[2], split[3])
          #res = neo4jAddInterests(split[2], split[3], split[4], split[5])
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3]
            newFile.append(line)
          else:
            newFile.append(line)
          None
      else: #already done
        newFile.append(line)
        None
      
    f.close()
  f = open("queue.txt", "wt")
  f.truncate(0)
  f.writelines(newFile)
  return []


def neo4jAddUserAndInterests(tx, type, username, first, last, interests):
  interests = json.loads(interests)
  if(type == "rushee"):
    tx.run("CREATE (a:Rushee {username: $username, first: $first, last: $last})", 
      username=username, first=first, last=last)
    for field in interests:
      if(interests.get(field)):
        query = ("MATCH (a:Rushee), (b:Interest {name:$interest}) WHERE a.username = $username CREATE (a)-[r:interested_in]->(b)")
        tx.run(query, interest=field, username=username)
  elif(type == "brother"):
    tx.run("CREATE (a:Brother {username: $username, first: $first, last: $last})", 
      username=username, first=first, last=last)
    for field in interests:
      if(interests.get(field)):
        query = ("MATCH (a:Brother), (b:Interest {name:$interest}) WHERE a.username = $username CREATE (a)-[r:interested_in]->(b)")
        tx.run(query, interest=field, username=username)
  
  # print(interests)
  return True

def neo4jDeleteUser(tx, type, username):
  # print(type + " " + username)
  username = username.replace("\n", "")
  if(type == "rushee"):
    # print("here")
    res1 = tx.run("MATCH (r:Rushee {username: $username})-[i:interested_in]->(in:Interest) DELETE i", username=username)
    res2 = tx.run("MATCH (a:Rushee {username: $username}) DETACH DELETE a", username=username)
    
    # for item in res1:
    #   print(item)
    # print(" ")
    # for item in res2:
    #   print(item)
  elif(type == "brother"):
    tx.run("MATCH (r:Brother {username: $username})-[i:interested_in]->(in:Interest) DELETE i", username=username)
    tx.run("MATCH (a:Brother {username: $username}) DETACH DELETE a", username=username)

  return True

@app.route("/getRecs", methods = ['POST'])
def getRecs():
  # print("Get recs")
  if request.method == 'POST':
    data = request.get_json().get('body')
    
  username = data.get('username')
  res = []
  with driver.session(database="neo4j") as session:
    res = session.execute_read(neo4jGetBrotherRec, username)
  return res

def neo4jGetBrotherRec(tx, username):
  res = tx.run("MATCH (r:Rushee {username: $username})-[i:interested_in]->(s:Interest)<-[in:interested_in]-(c:Brother) WITH r, c, count(*) as sum WHERE sum>3 RETURN sum, r, c.username", username=username)
  data = []
  for item in res:
    #print(item["c.username"])
    data.append(item["c.username"])
  returnData = []
  for user in data:
    userQuery = {'selector': {'$and': [{'type': "brother"}, {'username': user}]}}
    brother = db.find(userQuery)
    for doc in brother:
      returnData.append(doc)

  # print(returnData)
  return returnData
  



@app.route("/")
def hello():
  #queue("Connected")
  # with driver.session(database="neo4j") as session:
  #   res = session.execute_read(neo4jGetBrotherRec, "j")

  return "Connected to python!"

# def redisAddBrother(name, username):
#   # redis.hset(redisBrotherHash, name, username)
#   # redisGetBrothers()
#   redis.sadd(name, username)
#   return True

# def redisDeleteBrother(name, username):
#   # redis.hdel(redisBrotherHash, name)
#   # redisGetBrothers()
#   redis.srem(name, username)
#   return True

# def redisGetBrothers():
#   # print("getting redis brothers")
#   None
#   # brothers = redis.hgetall(redisBrotherHash)
#   # print(brothers)

def redisAddRushee(name, username):
  # print(name, username)
  #queue("REDIS%&%addAsUser%&%rushee%&%" + name + "%&%" + username)
  # redis.hset(redisRusheeHash, name, username)
  # redisGetRushees()
  redis.sadd(name, username)
  return True

def redisDeleteRushee(name, username):
  # print(name)
  # redis.hdel(redisRusheeHash, name)
  # redisGetRushees()
  redis.srem(name, username)
  return True

def redisGetRushees():
  # print("getting redis rushees")
  None
  # rushees = redis.hgetall(redisRusheeHash)
  # print(rushees)

@app.route("/searchRushee", methods = ['POST'])
def redisSearch():
  # redis.sadd("j", "j")
  # redis.sadd("j", "jj")
  if request.method == 'POST':
    data = request.get_json().get('body')
    
  name = data.get('body')
  # print(name)
  res = redis.smembers(name)
  data = []
  for item in res:
    # print(item.decode('utf-8'))
    userQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': item.decode('utf-8')}]}}   
    couch = db.find(userQuery)
    for item in couch:
      data.append(item)
  # print(data)
  return data
 
 
 
 
 #res = db.find(userQuery)
  # name = data.get('first') + " " + data.get('last')
  # try:
  #   rushee = redis.hget(redisRusheeHash, name).decode('utf-8')
  #   userQuery = {'selector': {'username': rushee}}
  #   res = db.find(userQuery)
  #   data = []
  #   for item in res:
  #     data.append(item)
  #   # print(data)
  #   return data

  # except:
  #   return []
  
  
  

@app.route("/login", methods = ['POST'])
def login():
  # redisAddRushee("Jared", "Petrisko")
  #queue("REDIS%&%addAsUser%&%rushee%&%" + "jake" + "%&%" + "jakey1")
  
  # redisGetRushees()
  # redisGetBrothers()
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
  # print("CREATE USER")
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
  # print("GETTING RUSHEES")
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
  if(type == "brother" or type == "requestedBrother"):
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
    queue("NEO4J%&%addInterests%&%brother%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))

  elif(type == "rushee" or type == "requestedRushee"):
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
    queue("NEO4J%&%addInterests%&%rushee%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))
    queue("REDIS%&%addAsUser%&%rushee%&%" + data.get('first') + " " + data.get('last') + "%&%" + data.get('username'))
   
  if(type == "requestedRushee"):
    doc['type'] = "requestedRushee"
    doc['fraternityInfo']["FIJI"]['interested'] = False

  elif(type == "requestedBrother"):
    doc['type'] = "requestedBrother"
  queue("TODO%&%" + "addUser%&%" + json.dumps(doc))
  
  return True

@app.route("/addRushee", methods = ['POST'])
def addRushee():
  #from a rush chairs "add rushee button"
  data = ""
  # print("ADDING RUSHEE")
  if request.method == 'POST':
    data = request.get_json().get('body')
    # print(data)
  addUser(data, "rushee")
  return "Rushee added"


@app.route("/addAsBrother", methods = ['POST'])
def addAsBrother():
  #from a rush chairs "add rushee button"
  data = ""
  # print("ADDING AS BROTHER")
  if request.method == 'POST':
    data = request.get_json().get('body')
  # print(data)
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
  # print(data)
  query = data.get('query') #username
  queue("TODO%&%" + "deleteRushee%&%" + query)
  queue("REDIS%&%delUser%&%rushee%&%" + data.get('first') + " " + data.get('last'))
  queue("NEO4J%&%deleteUser%&%rushee%&%" + query)
  
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
  # print("ADDING BROTHER")
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
  queue("NEO4J%&%" + "deleteUser%&%brother%&%" +  data)
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
  # for row in res:
  #   print(row['first'], row['last'], row['email'], row['username'])

# @app.route("/searchRushee")
# def searchRushee():
#   #need name, username, etc
#   inp = ""
#   fullname = inp
#   fullname = fullname.split(' ')
#   if(len(fullname) == 1):
#     fullname.append("A") #handles only giving a first / last name, not a full name
#   findBrother = {'selector': {'$and': [{'type': "brother"}, {'$or': [{'$and': [{'first': fullname[0].strip()}, {'last': fullname[1].strip()}]}, {'email': inp}, {'username': inp}, {'first': inp}, {'last': inp}]}]}}
#   res = db.find(findBrother)
#   for row in res:
#     print(row['first'], row['last'], row['email'], row['username'])




#   @app.route("/addEvent", methods = ['POST'])
# def addEvent():
  
#   if request.method == 'POST':
#     data = request.get_json()
#     queue("adding event, " + data['test'])
#     print(data["test"]) 
#     return "Adding an event"


@app.route("/changeFratInterest", methods = ['POST'])
def changeFratInterest():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body').get('query')

  queue("TODO%&%changeFratInterest%&%" + inp)
  # rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': inp}]}}
  # res = db.find(rusheeQuery)
  # for row in res:
  #   doc = db.get(row.id)
  #   doc['fraternityInfo']["FIJI"]['interested'] = not doc['fraternityInfo']["FIJI"]['interested']
  #   db.save(doc)
  return []

def couchChangeFratInterest(username):
  if not db:
    return False
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': username}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['interested'] = not doc['fraternityInfo']["FIJI"]['interested']
    db.save(doc)
  return True


@app.route("/likeRushee", methods = ['POST'])
def likeRushee():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')
  queue("TODO%&%likeRushee%&%" + brother + "%&%" + rushee)
  return []

def couchLikeRushee(brother, rushee):
  if not db:
    return False
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['likes'].append(brother)
    db.save(doc)
  return True


@app.route("/dislikeRushee", methods = ['POST'])
def dislikeRushee():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')
  queue("TODO%&%dislikeRushee%&%" + brother + "%&%" + rushee)
  return []

def couchDislikeRushee(brother, rushee):
  if not db:
    return False
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['likes'].remove(brother)
    db.save(doc)
  return True


@app.route("/changeBid", methods = ['POST'])
def changeBid():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('query')
  queue("TODO%&%changeBid%&%" + rushee)
  return []

def couchChangeBid(rushee):
  if not db:
    return False
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['bidStatus'] = not doc['fraternityInfo']["FIJI"]['bidStatus']
    db.save(doc)
  return True

# @app.route("/addRating")
# def addRating():
#   #we dont use this on the front end yet 
#   #need rushee's username, rating
#   inp = ""
#   rating = ""
#   rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
#   res = db.find(rusheeQuery)
#   for row in res:
#     doc = db.get(row.id)
#     doc['fraternityInfo']["FIJI"]['rating'] = rating
#     db.save(doc)

# @app.route("/needsDiscussion")
# def needsDiscussion():
#   #we dont use this on the front end yet 
#   #need rushee's username
#   inp = ""
#   rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': inp}, {'username': inp}]}]}}
#   res = db.find(rusheeQuery)
#   for row in res:
#     doc = db.get(row.id)
#     doc['fraternityInfo']["FIJI"]['needsDiscussion'] = not doc['fraternityInfo']["FIJI"]['needsDiscussion']
#     db.save(doc)

@app.route("/addComment", methods = ['POST'])
def addComment():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  comment = inp.get('comment')
  user = inp.get('user')
  queue("TODO%&%addComment%&%" + rushee + "%&%" + user + "%&%" + comment )
  return {}

def couchAddComment(rushee, user, comment):
  if not db:
    return False
  rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
  res = db.find(rusheeQuery)
  comment = {'comment': comment, 'user': user}
  for row in res:
    doc = db.get(row.id)
    doc['fraternityInfo']["FIJI"]['comments'].append(comment)
    db.save(doc)
    # print(doc)
  return True

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
  # print("ADD EVENT")
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
  # print(data)

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
  # print("DEL EVENT")
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