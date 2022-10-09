from ctypes import sizeof
import couchdb
#couch = couchdb.Server()
couch = couchdb.Server('http://testUser:password@localhost:5984/')

db = couch['testdb'] # existing


getRushees = {'selector': {'type': 'rushee'}}


def main():
    while(True):
        inp = str(input("~"))
        if(inp == "e"):
            break

        elif(inp == "ar"):
            first = str(input("First: "))
            last = str(input("Last: "))
            username = str(input("Username: "))
            phone = str(input("Phone: "))
            email = str(input("Email: "))
            major = str(input("Major: "))
            reshall = str(input("Residence Hall:" ))

            doc = {
                'type': 'rushee',
                'first': first,
                'last': last,
                'email': email,
                'major': major,
                'reshall': reshall,
                'fraternitiesInterestedIn': [],
                'username': username,
                'phone': phone,
                'fraternityInfo': {
                    'FIJI':
                    {
                    'frat': 'FIJI', 
                    'bidStatus': 'none',
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }, 
                    'SIGNU':
                    {
                    'frat': 'SIGNU', 
                    'bidStatus': 'none',
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }, 
                    'ATO':
                    {
                    'frat': 'ATO', 
                    'bidStatus': 'none',
                    'rating': 'none',
                    'comments': [],
                    'interested': False,
                    'needsDiscussion': 'no'
                    }
                }
            }
            db.save(doc)

        elif(inp == "get"):
            res = db.find(getRushees)
            for row in res:
                print(row)

        elif(inp == "find"):
            inp = str(input("Search criteria: "))

            findRushee = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'$and': [{'first': inp}, {'last': inp}]}, {'email': inp}, {'username': inp}, {'first': inp}, {'last': inp}]}]}}
            res = db.find(findRushee)
            for row in res:
                print(row['first'], row['last'], row['email'], row['username'])

        elif(inp == "addI"):
            frat = str(input("Frat: "))
            rushee = str(input("Rushee: "))
            findRushee = {'selector': {'$and': [{'type': 'rushee'}, {'$or': [{'email': rushee}, {'username': rushee}]}]}}
            res = db.find(findRushee)
            for row in res:
                doc = db.get(row.id)
                doc['fraternityInfo'][frat]['interested'] = True
                db.save(doc)
                #res = db.find(findRushee)
                #for row in res:
                    #print(row['fraternityInfo'])
        
        elif(inp == "intIn"):
            #rushees a frat is interested in
            frat = str(input("Frat: "))
            findRushee = {'selector': {'$and': [{'type': 'rushee'}, {'fraternityInfo': {frat: {'interested':True}}}]}}
            res = db.find(findRushee)
            for doc in res:
                print(doc)
main()