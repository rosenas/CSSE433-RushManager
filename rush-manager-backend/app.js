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
  request('http://127.0.0.1:5000/', {
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
app.get("/getRushees", async (req, res1) => {
  console.log("get rushees")
  request('http://127.0.0.1:5000/getRushees', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });
})

app.get("/getBrothers", async (req, res1) => {
  console.log("get rushees")
  request('http://127.0.0.1:5000/getBrothers', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });
})








app.get("/getOurRushees", async (req, res1) => {
  console.log("get rushees")
  request('http://127.0.0.1:5000/getOurRushees', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log("res:")
    console.log(body);
    res1.send(body)
    
  });
  //res.send(rushees)
})

app.get("/getEvents", async (req, res) => {
  res.send(events)
  request('http://127.0.0.1:5000/', {
    json: true
  }, (err, res, body) => {
    if (err) {
      console.log("ERROR")
      return console.log(err);
    }
    
    console.log(body);
    //res.send(events)
  });
})

app.post("/addEvent", (req, res) => {
  let name = req.body.name 
  let date = req.body.date

  events.push({"name": name, "date": date})

  console.log(req.body)
  console.log(date)

  res.send({"status": "success"})

  request.post('http://127.0.0.1:5000/addEvent', {
    json: true,
    body: {
      test : "test"
    }
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    
    console.log(body);
  });

})

app.post("/addBrother", (req, res1) => {
  request.post('http://127.0.0.1:5000/addBrother', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Added")
    //console.log(body);
  });

})

app.post("/addRushee", (req, res1) => {
  console.log(req.body.first)
  request.post('http://127.0.0.1:5000/addRushee', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Added")
    //console.log(body);
  });

})

app.post("/changeFratInterest", (req, res1) => {
  console.log("HERE")
  request.post('http://127.0.0.1:5000/changeFratInterest', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed")
  });

})

app.post("/likeRushee", (req, res1) => {
  console.log("HERE")
  request.post('http://127.0.0.1:5000/likeRushee', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed")
  });

})

app.post("/dislikeRushee", (req, res1) => {
  console.log("HERE")
  request.post('http://127.0.0.1:5000/dislikeRushee', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed")
  });

})

app.post("/createUser", (req, res1) => {
  console.log(req.body.first)
  request.post('http://127.0.0.1:5000/createUser', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Added")
    //console.log(body);
  });

})

app.post("/deleteRushee", (req, res1) => {
  request.post('http://127.0.0.1:5000/deleteRushee', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Deleted")
    //console.log(body);
  });

})

app.post("/deleteBrother", (req, res1) => {
  request.post('http://127.0.0.1:5000/deleteBrother', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Deleted")
    //console.log(body);
  });

})

app.post("/addAsBrother", (req, res1) => {
  request.post('http://127.0.0.1:5000/addAsBrother', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed to brother")
    //console.log(body);
  });

})


app.post("/changeBid", (req, res1) => {
  request.post('http://127.0.0.1:5000/changeBid', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed")
    //console.log(body);
  });

})

app.post("/createAccount", (req, res) => {
  
})

app.post("/login", (req, res) => {
  
})

app.post("/comment", (req, res) => {
  
})

app.post("/like", (req, res) => {
  
})

app.post("/rsvp", (req, res) => {
  
})

app.get("/contactInfo", (req, res) => {
  
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
    ], 
    'events': [
      {
        "name": "Monday Night Football",
        "date": "9/27"
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