const express = require('express')
const request = require('request')
const app = express()
const port = 8000
const cors = require("cors")
const path = require("path")
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(express.urlencoded());
app.use(express.json());
app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.static(path.join(__dirname, '/public')))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)


  //how you call app.py
  request('http://localhost:5000/', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    
    console.log(body);
  });
    
  })


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..\\rush-manager-frontend\\src\\index.js'))
})

//TODO make this a post and check for verification
app.get("/getRushees", async (req, res) => {
  res.send(rushees)
})

app.get("/getEvents", async (req, res) => {
  res.send(events)
})

app.post("/addEvent", (req, res) => {
  let name = req.body.name 
  let date = req.body.date

  events.push({"name": name, "date": date})

  console.log(req.body)
  console.log(date)

  res.send({"status": "success"})
})

let rushees = [
  {
    "name": "Ari Rosen",
    "info": "Interested",
    'likes': 3,
    'comments':[
      {
        "user": "user1",
        "comment": "He's got that dawg him"
      },
      {
        "user": "user2",
        "comment": "He's one of them ones"
      }
    ]
      

    
    },
  {
    "name": "Grant Ripperda",
    "info": "Bid",
    'likes': 6
  },
  {
    "name": "Jared Petrisko",
    "info": "Interested",
    'likes': 6
  },
  {
    "name": "Dalton Busboom",
    "info": "Just Started rushing",
    'likes': 0
  }, 
  {
    "name": "Garrett Loyed",
    "info": "Not rushing",
    'likes': 0
  },
  {
    "name": "Ethan Swanner",
    "info": "Fat",
    'likes': 3
  }

]

let events = [
  {
    "name": "Monday Night Football",
    "date": "9/27",
    "attending":[
        {
        "name": "Garrett Loyed",
        "info": "Not rushing",
        'likes': 0
      },
      {
        "name": "Ethan Swanner",
        "info": "Fat",
        'likes': 3
      }
    ]
  },
  {
    "name": "Cookout",
    "date": "9/30"
  },
  {
    "name": "Chick-Fil-A",
    "date": "10/1"
  }
]