const express = require('express')
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

let rushees = [
  {
    "name": "Ari Rosen",
    "info": "Interested"
    },
  {
    "name": "Grant Ripperda",
    "info": "Bid"
  },
  {
    "name": "Jared Petrisko",
    "info": "Interested"
  },
  {
    "name": "Dalton Busboom",
    "info": "Just Started rushing"
  }, 
  {
    "name": "Garrett Loyed",
    "info": "Not rushing"
  }

]

let events = [
  {
    "name": "Monday Night Football",
    "date": "9/27"
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