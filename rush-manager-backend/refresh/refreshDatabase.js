const express = require('express')
const request = require('request')
const app = express()
const port = 9000
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


//   //how you call app.py
//   request('http://127.0.0.1:5000/', {
//     json: true
//   }, (err, res, body) => {
//     if (err) {
//       return console.log(err);
//     }
    
//     console.log(body);
//   });
    
  })


  
async function refresh() {
  await new Promise(r => setTimeout(r, 2000));
  while(true) {
    await new Promise(r => setTimeout(r, 2000));
    console.log("refresh");
    request('http://127.0.0.1:5000/refreshDatabase', {
        json: true
      }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        
        
      });
  }

}

refresh()
  