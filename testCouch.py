
import couchdb
#couch = couchdb.Server()
###local
#couch = couchdb.Server('http://testUser:password@localhost:5984/')
#db = couch['testdb'] # existing

###VM
couch = couchdb.Server('http://admin:couch@137.112.104.178:5984/')
db = couch['testdb']
#db = couch.create('testdb')
#db = None
#print(couch['example'])



def main():
    while(True):
        inp = str(input("~"))
        if(inp == "e"):
            break

        #add brother
        elif(inp == "ab"):
            first = str(input("First: "))
            last = str(input("Last: "))
            username = str(input("Username: "))
            #add unique username checks
            phone = str(input("Phone: "))
            email = str(input("Email: "))
            major = str(input("Major: "))
            fraternity = str(input("Fraternity: "))
            doc = {
                'type': 'brother',
                'first': first,
                'last': last,
                'email': email,
                'major': major,
                'username': username,
                'phone': phone,
                'interests': [],
                'fraternity': fraternity
            }
            db.save(doc)


        #add rushee
        elif(inp == "ar"):
            first = str(input("First: "))
            last = str(input("Last: "))
            username = str(input("Username: "))
            phone = str(input("Phone: "))
            email = str(input("Email: "))
            major = str(input("Major: "))
            reshall = str(input("Residence Hall: " ))

            doc = {
                'type': 'rushee',
                'first': first,
                'last': last,
                'email': email,
                'major': major,
                'reshall': reshall,
                'interests': [],
                'fraternitiesInterestedIn': [],
                'username': username,
                'phone': phone,
                'fraternityInfo': {
                    'FIJI':
                    {
                    'frat': 'FIJI', 
                    'bidStatus': False,
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }, 
                    'SIGNU':
                    {
                    'frat': 'SIGNU', 
                    'bidStatus': False,
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }, 
                    'ATO':
                    {
                    'frat': 'ATO', 
                    'bidStatus': False,
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }
                }
            }
            db.save(doc)

        #get all rushees/ brothers
        elif(inp == "get"):
            type = str(input("(B)rother/ (R)ushee: "))
            if(type == "B" or type == "R"):
                if(type == "B"):
                    frat = str(input("Fraternity: "))
                    type = "brother"
                    getQuery = {'selector': {'$and': [{'type': type}, {'fraternity': frat}]}}
                elif(type == "R"):
                    type = "rushee"
                    getQuery = {'selector': {'type': type}}
                
                res = db.find(getQuery)
                for row in res:
                    print(row)
            else:
                print("Invalid response")

        #find specific rushee/ brother
        elif(inp == "find"):
            type = str(input("(B)rother/ (R)ushee: "))
            if(type == "B"):
                type = "brother"
            elif(type == "R"):
                type = "rushee"
            if(type == "rushee" or type == "brother"):
                inp = str(input("Search criteria: "))
                fullname = inp
                fullname = fullname.split(' ')
                if(len(fullname) == 1):
                    fullname.append("A")
                findRushee = {'selector': {'$and': [{'type': type}, {'$or': [{'$and': [{'first': fullname[0].strip()}, {'last': fullname[1].strip()}]}, {'email': inp}, {'username': inp}, {'first': inp}, {'last': inp}]}]}}
                res = db.find(findRushee)
                for row in res:
                    print(row['first'], row['last'], row['email'], row['username'])
            else:
                print("Invalid response")

        #add that a frat is interested in a rushee
        elif(inp == "addI"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['interested'] = True
                db.save(doc)
                #res = db.find(findRushee)
                #for row in res:
                    #print(row['fraternityInfo'])

        elif(inp == "bid"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['bidStatus'] = not doc['fraternityInfo'][frat]['bidStatus']
                db.save(doc)

        elif(inp == "rating"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            rating = str(input("Rating: "))
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['rating'] = rating
                db.save(doc)

        elif(inp == "disc"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            disc = str(input("Needs Discussion (Yes/ No): ")).lower()
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['needsDiscussion'] = disc
                db.save(doc)

        elif(inp == "remInt"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['interested'] = False
                db.save(doc)

        elif(inp == "comment"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            comment = str(input("Comment: "))
            rusheeQuery = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['comments'].append(comment)
                db.save(doc)
        
        #get all rushees a frat is interested in
        elif(inp == "intIn"):
            frat = str(input("Frat: "))
            findRushee = {'selector': {'$and': [{'type': 'rushee'}, {'fraternityInfo': {frat: {'interested':True}}}]}}
            res = db.find(findRushee)
            for doc in res:
                print(doc)

        #delete rushee/ brother
        elif(inp == "del"):
            type = str(input("(B)rother/ (R)ushee: "))
            if(type == "B"):
                type = "brother"
            elif(type == "R"):
                type = "rushee"
            rushee = str(input("Rushee: "))

            rusheeQuery = {'selector': {'$and': [{'type': type}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(rusheeQuery)
            for doc in res:
                db.delete(doc)
            
main()