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
  });
    
  })


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..\\rush-manager-frontend\\src\\index.js'))
})

//TODO make this a post and check for verification
app.get("/getRushees", async (req, res1) => {
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
  request('http://127.0.0.1:5000/getBrothers', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });
})


app.get("/getEvents", async (req, res1) => {
  request('http://127.0.0.1:5000/getEvents', {
    json: true
  }, (err, res, body) => {
    if (err) {
      console.log("ERROR")
      return console.log(err);
    }
    res1.send(body)
  });
})

app.post("/addEvent", (req, res1) => {
  let data = {"name": req.body.name,
              "date": req.body.date}
  request.post('http://127.0.0.1:5000/addEvent', {
    json: true,
    body: data
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });

})

app.post("/deleteEvent", (req, res1) => {
  let data = {"name": req.body.name}
  request.post('http://127.0.0.1:5000/deleteEvent', {
    json: true,
    body: data
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
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
  });

})

app.post("/addRushee", (req, res1) => {
  request.post('http://127.0.0.1:5000/addRushee', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Added")
  });

})

app.post("/changeFratInterest", (req, res1) => {
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
  request.post('http://127.0.0.1:5000/createUser', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Added")
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
  });

})

app.post("/changeRSVP", (req, res1) => {
  request.post('http://127.0.0.1:5000/changeRSVP', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send("Changed")
  });

})

app.post("/createAccount", (req, res) => {
  
})

app.post("/login", (req, res1) => {
  console.log(req)
  request.post('http://127.0.0.1:5000/login', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });
})

app.post("/addComment", (req, res1) => {
  console.log(req)
  request.post('http://127.0.0.1:5000/addComment', {
    json: true,
    body: req
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    res1.send(body)
  });
})



app.post("/like", (req, res) => {
  
})

app.post("/rsvp", (req, res) => {
  
})

app.get("/contactInfo", (req, res) => {
  
})
