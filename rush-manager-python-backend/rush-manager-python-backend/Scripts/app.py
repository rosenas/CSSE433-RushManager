from hashlib import new
from pickle import NONE
from flask import request
from flask import Flask
from neo4j import GraphDatabase

import redis 
import bcrypt
import json
app = Flask(__name__)

#temp values for rushees
global rushees 
rushees = []
global events 
events = []
global brothers 
brothers = []

# uri = "neo4j://localhost:7687"
# driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

try:
  print("TRYING")
  driver = GraphDatabase.driver(encrypted=False, uri="bolt://433-09.csse.rose-hulman.edu:7687",auth=("neo4j", "h6u4%kr"))
  print("DONE")
except:
  None

# def neoInit(tx):
#   tx.run("CREATE (a:Interest {name: $football})", football = "clash")
#   tx.run("CREATE (a:Interest {name:$football})", football = "basket")
#   tx.run("CREATE (a:Interest {name:$football})", football = "ducks")
#   tx.run("CREATE (a:Interest {name:$football})", football = "basketball")
#   tx.run("CREATE (a:Interest {name:$football})", football = "golf")
#   tx.run("CREATE (a:Interest {name:$football})", football = "gpe")
#   tx.run("CREATE (a:Interest {name:$football})", football = "swimming")
#   tx.run("CREATE (a:Interest {name:$football})", football = "gaming")
#   tx.run("CREATE (a:Interest {name:$football})", football = "lifting")
#   tx.run("CREATE (a:Interest {name:$football})", football = "running")
#   tx.run("CREATE (a:Interest {name:$football})", football = "eating")
#   tx.run("CREATE (a:Interest {name:$football})", football = "bickic")

# with driver.session(database="neo4j") as session:
#   res = session.execute_write(neoInit)


import couchdb
db = None
def couchInit():
  global db
  couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
  # couch = None
  try:
    db = couch['shardtest']
  #   doc = {"type": "Admin",
  # "password": "$2b$12$f7wO2tTYQXL7q544OnjnnOlTqGKYg8h.SzBTjoiTl/RmsgJCLrmhG",
  # "username": "admin"}
  #   db.save(doc)
  except:
    db = None
    print("couch down")
  
couchInit()

# redis = redis.Redis()

redis = redis.Redis(host="433-09.csse.rose-hulman.edu", port=6379 )

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
          # print("ADDINTERESTS")
          try:
            driver.verify_connectivity()
            try:
              with driver.session(database="neo4j") as session:
                res = session.execute_write(neo4jAddUserAndInterests, split[2], split[3], split[4], split[5], split[6])
            except: res = False
          except:
            # print("DRIVER NOT CONNECTED")
            res = False
          
          #res = neo4jAddInterests(split[2], split[3], split[4], split[5])
          if res:
            line = "DONE%&%" + split[1] + "%&%" + split[2] + "%&%" + split[3] + "%&%" + split[4] + "%&%" + split[5] + "%&%" + split[6]
            newFile.append(line)
          else:
            # print(line)
            newFile.append(line)
        elif(split[1] == "deleteUser"):
          res = False
          try:
            with driver.session(database="neo4j") as session:
              res = session.execute_write(neo4jDeleteUser, split[2], split[3])
          except: res = False
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
  # print(newFile)
  f.writelines(newFile)
  f.close()
  # print(newFile)
  return []


def neo4jAddUserAndInterests(tx, type, username, first, last, interests):
  try:
    driver.verify_connectivity()
  except:
    # print("HERE")
    return False
    # return ["NEO4J is down: recommendation feature not available"]

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
  try:
    driver.verify_connectivity()
  except:
    return False

  if not driver:
    return False
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
  res = []
  if request.method == 'POST':
    data = request.get_json().get('body')
  username = data.get('username')

  try:
    driver.verify_connectivity()
  except:
    return ["NEO4J is down: recommendation feature not available"]

  try:
    with driver.session(database="neo4j") as session:
      res = session.execute_read(neo4jGetBrotherRec, username)
  except:
    print("HERE")
    return ["NEO4J is down: recommendation feature not available"]
  return res


def neo4jGetBrotherRec(tx, username):
  try:
    driver.verify_connectivity()
  except:
    return ["NEO4J is down: recommendation feature not available"]
  
  try:
    res = tx.run("MATCH (r:Rushee {username: $username})-[i:interested_in]->(s:Interest)<-[in:interested_in]-(c:Brother) WITH r, c, count(*) as sum WHERE sum>3 RETURN sum, r, c.username", username=username)
    data = []
    for item in res:
      data.append(item["c.username"])
    returnData = []
    for user in data:
      userQuery = {'selector': {'$and': [{'type': "brother"}, {'username': user}]}}
      brother = db.find(userQuery)
      for doc in brother:
        returnData.append(doc)

    print(returnData)
    return returnData
  except:
    return ["NEO4J is down: recommendation feature not available"]
  



@app.route("/")
def hello():
  #queue("Connected")
  # with driver.session(database="neo4j") as session:
  #   res = session.execute_read(neo4jGetBrotherRec, "j")

  return "Connected to python!"

def redisAddRushee(name, username):
  if not redis:
    return False
  redis.sadd(name, username)
  split = name.split(" ")
  try:
    redis.sadd(split[0], username)
  except: None
  try:
    redis.sadd(split[1], username)
  except: None
  return True

def redisDeleteRushee(name, username):
  if not redis:
    return False
  redis.srem(name, username)
  split = name.split(" ")
  try:
    redis.srem(split[0], username)
  except: None
  try:
    redis.srem(split[1], username)
  except: None
  return True


@app.route("/searchRushee", methods = ['POST'])
def redisSearch():
  # redis.sadd("j", "j")
  # redis.sadd("j", "jj")
  # if not redis:
  #   return ["REDIS is currently down: search feature disabled"]
  if request.method == 'POST':
    data = request.get_json().get('body')
    
  name = data.get('body')
  # print(name)
  try:
    res = redis.smembers(name)
  except:
    return ["REDIS is currently down: search feature disabled"]
  data = []
  try:
    for item in res:
      # print(item.decode('utf-8'))
      userQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': item.decode('utf-8')}]}}   
      couch = db.find(userQuery)
      for item in couch:
        data.append(item)
  except:
    for item in res:
      for rushee in rushees:
        if(rushee["username"] == item.decode('utf-8')):
          data.append(rushee)

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
  global db
  # redisAddRushee("Jared", "Petrisko")
  #queue("REDIS%&%addAsUser%&%rushee%&%" + "jake" + "%&%" + "jakey1")
  couchInit()
  getRushees()
  getBrothers()
  getEvents()
  data = ""
  password = ""
  if request.method == 'POST':
    data = request.get_json().get('body')
    password = data.get('password').encode('utf-8')

  salt = bcrypt.gensalt()
  hash = bcrypt.hashpw("password".encode('utf-8'), salt)
  getQuery = {'selector': {'username': data.get('username')}}   
  res = []
  try:
    res = db.find(getQuery)
  except:
    return {'result': False, 'accountType': "", 'username': "", 'message': "CouchDB is down."}
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

  # print(data)
  if(data.get('accountType') == "brother"):
    addUser(data, "requestedBrother")
  if(data.get('accountType') == "rushee"):
    addUser(data, "requestedRushee")
  return []
  

@app.route("/getRushees")
def getRushees():
  global rushees 
#   couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
# # couch = None
#   try:
#     db = couch['testdb']
#     print("Couch up")
#   except:
#     db = None
#     print("couch down")
#   print("GETTING rushees")
#   print(db)
#   try:
  # print("GET RUSHEES")
  # print(rushees)
  try:
    readQueue()
    type = "rushee"
    getQuery = {'selector': {'type': type}}
    res = db.find(getQuery)
    data = []
    for doc in res:
      data.append(doc)
    rushees = data
    print("DB UP")
    # print(rushees)
  except:
    None

  return rushees
  # except:
  #   print("DB DOWN- return local copy")
  #   print(rushees)
  #   return rushees

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
    if(type == "requestedBrother"):
      doc['type'] = "requestedBrother"
    brothers.append(doc)
    # queue("NEO4J%&%addInterests%&%brother%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))

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
    if(type == "requestedRushee"):
      doc['type'] = "rushee"
      doc['fraternityInfo']["FIJI"]['interested'] = False
    rushees.append(doc)
    # queue("NEO4J%&%addInterests%&%rushee%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))
    # queue("REDIS%&%addAsUser%&%rushee%&%" + data.get('first') + " " + data.get('last') + "%&%" + data.get('username'))
   
  # if(type == "requestedRushee"):
  #   doc['type'] = "requestedRushee"
  #   doc['fraternityInfo']["FIJI"]['interested'] = False

  # elif(type == "requestedBrother"):
  #   doc['type'] = "requestedBrother"
  queue("TODO%&%" + "addUser%&%" + json.dumps(doc))
  if(type == "rushee" or type == "requestedRushee"):
    queue("REDIS%&%addAsUser%&%rushee%&%" + data.get('first') + " " + data.get('last') + "%&%" + data.get('username'))
    queue("NEO4J%&%addInterests%&%rushee%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))
  elif(type == "brother" or type == "requestedBrother"):
    queue("NEO4J%&%addInterests%&%brother%&%" + data.get('username') + "%&%" + data.get('first') + "%&%" + data.get('last') + "%&%" + json.dumps(data.get('interests')))
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

@app.route("/isUniqueUserName", methods = ['POST'])
def uniqueUsername():
  data = ""
  if request.method == 'POST':
    data = request.get_json().get('body').get('username')
  username = data
  res = db.find({'selector': {'username': username}})
  for item in res:
    if(item['username'] == username):
      return {'isUnique': False}
    
  return {'isUnique': True}

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


@app.route("/makeBrotherAdmin", methods = ['POST'])
def makeBrotherAdmin():
  #from a rush chairs "add rushee button"
  data = ""
  # print("ADDING AS BROTHER")
  if request.method == 'POST':
    data = request.get_json().get('body')
  data = data.get('query')
  # print(data)
  # print(data)
  queue("TODO%&%changeUserType%&%admin%&%" + data)
  return "Rushee added"


def couchChangeUserType(username, type):
  #don't know if we want to deal with this offline
  #would have to do stuff w/ requested vs not etc
  if not db:
    return False
  userQuery = {'selector': {'username': username}}
  res = db.find(userQuery)
  for doc in res:
    doc["type"] = type
    db.save(doc)
  return True


def couchAddUser(doc):

  couchInit()
  try:
  # if not db:
  #   return False
    res = db.save(doc)
    #TODO 
    #check what res returns if the save was unsuccessful
    return True
  except:
    return False

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
  # print("DELETING" + data)
  couchInit()
  global rushees 
  # print(rushees)
  # for rushee in rushees:
  #   # print(rushee.get('username'))
  rushees = list(filter(lambda rushee: rushee.get('username') != data.strip(), rushees))
  # for rushee in rushees:
  #   print(rushee.get('username'))
  
  try:
    userQuery = {'selector': {'$and': [{'type': "rushee"}, {'$or': [{'email': data}, {'username': data}]}]}}
    res = db.find(userQuery)
    for doc in res:
      db.delete(doc)
    #TODO 
    #check what res returns if the save was unsuccessful
    return True
  except:
    return False
  

@app.route("/getBrothers")
def getBrothers():
  global brothers
  try:
    readQueue()
    type = "brother"
    frat = "FIJI"
    getQuery = {'selector': {'$or': [{'type': "brother"}, {'type': "admin"}, {'type': "requestedBrother"}]}}   
    res = db.find(getQuery)
    data = []
    for doc in res:
      data.append(doc)
    brothers = data
    # return data
  except:
    None

  return brothers

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
  couchInit()
  global brothers 
  # print(brothers)
  # for brother in brothers:
  #   print(brother.get('username'))
  brothers = list(filter(lambda brother: brother.get('username') != data.strip(), brothers))
  # for brother in brothers:
  #   print(brother.get('username'))
  
  try:
    userQuery = {'selector': {'$and': [{'$or': [{'type': "brother"}, {'type': "requestedBrother"}]}, {'$or': [{'email': data}, {'username': data}]}]}}
    res = db.find(userQuery)
    for doc in res:
      db.delete(doc)
    #TODO 
    #check what res returns if the save was unsuccessful
    return True
  except:
    return False

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
  #update temp list
  global rushees
  newRushees = []
  for rushee in rushees:
    if(rushee.get('username') == inp):
      rushee['fraternityInfo']["FIJI"]['interested'] = not rushee['fraternityInfo']["FIJI"]['interested']
    newRushees.append(rushee)
  rushees = newRushees

  queue("TODO%&%changeFratInterest%&%" + inp)
  return []

def couchChangeFratInterest(username):
  try:
    rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': username}]}}
    res = db.find(rusheeQuery)
    for row in res:
      doc = db.get(row.id)
      doc['fraternityInfo']["FIJI"]['interested'] = not doc['fraternityInfo']["FIJI"]['interested']
      db.save(doc)
    return True
  except: return False


@app.route("/likeRushee", methods = ['POST'])
def likeRushee():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')
  global rushees
  newRushees = []
  for item in rushees:
    if(item.get('username') == rushee):
      temp = []
      temp = item['fraternityInfo']["FIJI"]['likes']
      temp.append(brother)
      item['fraternityInfo']["FIJI"]['likes'] = temp
    newRushees.append(item)
  rushees = newRushees

  queue("TODO%&%likeRushee%&%" + brother + "%&%" + rushee)
  return []

def couchLikeRushee(brother, rushee):
  try:
    rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
    res = db.find(rusheeQuery)
    for row in res:
      doc = db.get(row.id)
      doc['fraternityInfo']["FIJI"]['likes'].append(brother)
      db.save(doc)
    return True
  except:
    return False


@app.route("/dislikeRushee", methods = ['POST'])
def dislikeRushee():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  brother = inp.get('user')

  global rushees
  newRushees = []
  for item in rushees:
    if(item.get('username') == rushee):
      temp = []
      temp = item['fraternityInfo']["FIJI"]['likes']
      temp.remove(brother)
      item['fraternityInfo']["FIJI"]['likes'] = temp
    newRushees.append(item)
  rushees = newRushees



  queue("TODO%&%dislikeRushee%&%" + brother + "%&%" + rushee)
  return []

def couchDislikeRushee(brother, rushee):
  try:
    rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
    res = db.find(rusheeQuery)
    for row in res:
      doc = db.get(row.id)
      doc['fraternityInfo']["FIJI"]['likes'].remove(brother)
      db.save(doc)
    return True
  except: return False


@app.route("/changeBid", methods = ['POST'])
def changeBid():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  inp = inp.get('query')

  #update temp list
  global rushees
  newRushees = []
  for rushee in rushees:
    if(rushee.get('username') == inp):
      rushee['fraternityInfo']["FIJI"]['bidStatus'] = not rushee['fraternityInfo']["FIJI"]['bidStatus']
    newRushees.append(rushee)
  rushees = newRushees
  
  queue("TODO%&%changeBid%&%" + inp)
  return []

def couchChangeBid(rushee):
  try:
    rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
    res = db.find(rusheeQuery)
    for row in res:
      doc = db.get(row.id)
      doc['fraternityInfo']["FIJI"]['bidStatus'] = not doc['fraternityInfo']["FIJI"]['bidStatus']
      db.save(doc)
    return True
  except:
    return False


@app.route("/addComment", methods = ['POST'])
def addComment():
  inp = ""
  if request.method == 'POST':
    inp = request.get_json().get('body')
  rushee = inp.get('rushee')
  comment = inp.get('comment')
  user = inp.get('user')
  commentobj = {'comment': comment, 'user': user}
  global rushees
  newRushees = []
  for item in rushees:
    if(item.get('username') == rushee):
      temp = []
      temp = item['fraternityInfo']["FIJI"]['comments']
      temp.append(commentobj)
      item['fraternityInfo']["FIJI"]['comments'] = temp
    newRushees.append(item)
  rushees = newRushees



  queue("TODO%&%addComment%&%" + rushee + "%&%" + user + "%&%" + comment )
  return {}

def couchAddComment(rushee, user, comment):
  try:
    rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'username': rushee}]}}
    res = db.find(rusheeQuery)
    comment = {'comment': comment, 'user': user}
    for row in res:
      doc = db.get(row.id)
      doc['fraternityInfo']["FIJI"]['comments'].append(comment)
      db.save(doc)
      # print(doc)
    return True
  except:
    return False

@app.route("/changeRusheeInterest")
def changeRusheeInterest():
  None

@app.route("/getRusheesInterestedIn")
def getRusheesInterestedIn():
  #returns all rushees that are interested in FIJI
  None

@app.route("/getEvents")
def getEvents():
  global events
#   couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
# # couch = None
#   try:
#     db = couch['testdb']
#     print("Couch up")
#   except:
#     db = None
#     print("couch down")
#   print("GETTING events")
#   print(db)
  try:
    readQueue()
    type = "event"
    getQuery = {'selector': {'type': type}}
    res = db.find(getQuery)
    data = []
    for doc in res:
      data.append(doc)
    events = data
    # return data
  except:
    None

  return events
  

@app.route("/addEvent", methods = ['POST'])
def addEvent():
  # print("ADD EVENT")
  data = ""
  if request.method == 'POST':
    data = request.get_json()
  
  queue("TODO%&%addEvent%&%" + data["name"] + "%&%" + data["date"])
  return {}

def couchAddEvent(name, date):
  doc = {
    "type": "event",
    "name": name,
    "date": date,
    "attended": []
  }
  events.append(doc)
  if not db:
    return False
  
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

#auto check queue anytime server is started
readQueue()


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)