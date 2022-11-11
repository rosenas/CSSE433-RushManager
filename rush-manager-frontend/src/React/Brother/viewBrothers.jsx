import React from "react";
import { useState, useEffect } from 'react';
import { FormCheck, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import "../../CSS/index.css"
import AWS from 'aws-sdk'

const S3_BUCKET = 'rushee-images';
const REGION = 'us-east-2';

AWS.config.update({
  accessKeyId: 'AKIA3OZ5F5ALHBCZERER',
  secretAccessKey: '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'
})



const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})


function ViewBrothers(props){
    const [brothers, setBrothers] = useState([])
    const [requestedBrothersList, setRequestedBrothersList] = useState([])
    const [ourBrothers, setOurBrothers] = useState(true)
    const [requestedBrothers, setRequestedBrothers] = useState(false)
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const [modal, setModal] = useState(false)



    var doc = {'first': "",
          'last': "",
          'username': "",
          'password': "",
          'email': "",
          'major': "",
          'phone': "",
          'housing': "",
          'photoURL': "",
          interests: {
            'football': false,
            'soccer': false,
            'baseball': false,
            'golf': false,
            'basketball': false,
            'gpe': false,
            'gaming': false,
            'swimming': false,
            'lifting': false,
            'running': false,
            'eating': false,
            'bickic': false,
            'clash': false,
            'basket': false,
            'ducks': false,
          }
        };


    
    const getBrothers = () => {
      fetch('http://localhost:8000/getBrothers',{
                  headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                })
              .then(response=> response.json())
              .then(data=>{
                setBrothers(data)
                var filteredBrother = data.filter(rushee => {
                    if(rushee.type === "brother" || rushee.type === "admin") {
                      return rushee
                    }
                  }
                )
                setBrothers(filteredBrother)

                var filt = data.filter(rushee => {
                    if(rushee.type === "requestedBrother") {
                      return rushee
                    }
                  }
                )
                setRequestedBrothersList(filt)
              })
    }

    const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
    }
  
  
    const uploadFile = (file) => {
      doc.photoURL = "https://rushee-images.s3.us-east-2.amazonaws.com/" + encodeURIComponent(file.name)
      const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name
      };
  
      myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err) => {
          if (err) console.log(err)
        })
    }
    


    const handleAddBrother = () => {
      setModal(true)
    }

    let photo;
    const handleSetPhoto = (_photo) => {
      console.log(photo);
      photo = _photo
    }

    const handleClose = () => {
      setModal(false);
    }

    const handleCancel = () => {
      setModal(false);
    }

    const handleSubmit = () => {
      // console.log(doc)
      uploadFile(photo)
      fetch("http://localhost:8000/addBrother", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doc)
        }).then(response => response.json())
        .then(data=>{
          getBrothers()      
          handleClose()
          console.log(data);
      })

    }

  //   if(brothers.length == 0){
  //       getBrothers()
  //       console.log()
      
  // }

  useEffect(() => {
    getBrothers()
  }, [])

    const AddBrotherModal=  () => {
      return(
        
          <Modal show={modal} onHide={handleClose}>
              <Modal.Header closeButton />
              <Modal.Title className="Modal-Title">
                  Add a Brother
              </Modal.Title>
              <Modal.Body>
                  <div>
                    
                      <div className="Modal-Input">
                          <label for="Event"><b>First Name</b></label>
                          <input type="text" placeholder="Enter First Name" name="Brother Name" onChange={e => doc.first = e.target.value} required />
                          <label for="Event"><b>Last Name</b></label>
                          <input type="text" placeholder="Enter Last Name" name="Brother Name" onChange={e => doc.last = e.target.value} required />
                          <label for="Event"><b>Username</b></label>
                          <input type="text" placeholder="Enter Username" name="Brother Name" onChange={e => doc.username = e.target.value} required />
                          <label for="Event"><b>Password</b></label>
                          <input type="text" placeholder="Enter Password" name="Brother Name" onChange={e => doc.password = e.target.value} required />
                          <label for="Event"><b>Email</b></label>
                          <input type="text" placeholder="Enter Email" name="Brother Name" onChange={e => doc.email = e.target.value} required />
                          <label for="Event"><b>Phone Number</b></label>
                          <input type="text" placeholder="Enter Phone Number" name="Brother Name" onChange={e => doc.phone = e.target.value} required />
                          <label for="Event"><b>Major</b></label>
                          <input type="text" placeholder="Enter Major" name="Brother Name" onChange={e => doc.major = e.target.value} required />
                          <label for="Event"><b>Residence Hall</b></label>
                          <input type="text" placeholder="Enter Residence Hall" name="Brother Name" onChange={e => doc.housing = e.target.value} required />
                          <label for="Date"><b>Photo</b></label>
                          <input type="file" placeholder="Upload Photo" name="photo" onChange={e => handleSetPhoto(e.target.files[0])} required />
                          <div>
                <h4 style={{marginLeft:20, marginTop: 10}}>Please select your interests:</h4>
                <div style={{display: "flex"}}>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Football</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.football = !doc.interests.football}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Soccer</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.soccer = !doc.interests.soccer}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Baseball</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.baseball = !doc.interests.baseball}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Golf</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.golf = !doc.interests.golf}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Basketball</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.basketball = !doc.interests.basketball}/>
                  </div>
                </div>

                <div style={{display: "flex"}}>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>GPE</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.gpe = !doc.interests.gpe}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Gaming</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.gaming = !doc.interests.gaming}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Swimming</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.swimming = !doc.interests.swimming}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Lifting</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.lifting = !doc.interests.lifting}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Running</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.running = !doc.interests.running}/>
                  </div>
                </div>

                <div style={{display: "flex"}}>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Eating</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.eating = !doc.interests.eating}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>BIC/KIC</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.bickic = !doc.interests.bickic}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Clash</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.clash = !doc.interests.clash}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Basket Weaving</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.basket = !doc.interests.basket}/>
                  </div>
                  <div style={{marginLeft:20}}>
                    <label for="Event"><b>Competitive Duck Herding</b></label>
                    <FormCheck placeholder="check me" onChange={e => doc.interests.ducks = !doc.interests.ducks}/>
                  </div>
                </div>
                </div>
                      
                      </div>
                      
                      <div className="Modal-Buttons">
                          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                          <Button variant="primary" onClick={handleSubmit}>Add</Button>
                      </div>
                      
                  </div>
              </Modal.Body>

          </Modal>
      
      )
    
  } 

  const handleOurBrothers = () => {
    console.log("Our Brothers")
    setRequestedBrothers(false)
    setOurBrothers(true)
  }

  const handleRequestedBrothers = () => {
    console.log("Req Brothers")
    setRequestedBrothers(true)
    setOurBrothers(false)
  }

    

    return (
        <>
        <h1 className="title">Brothers</h1>

        {props.accountType === "admin" &&
        <>
        
        <div className= "add">
        <ToggleButtonGroup
          color="primary"
          name="toggle"
  // value={alignment}
          exclusive
  // onChange={handleChange}
          aria-label="Platform"
        >
        <ToggleButton active={ourBrothers} onClick={handleOurBrothers} value="all">Our Brothers</ToggleButton>
        <ToggleButton active={requestedBrothers} value="ourList" onClick={handleRequestedBrothers} >Requested Brothers</ToggleButton>
      </ToggleButtonGroup>
        
        </div>
        <div className= "add">
            <Button variant="light" className="add_button"onClick={handleAddBrother}>Add Brother</Button>
        </div>
        </>
        }
        <div className="container">
        
         {brothers && ourBrothers && brothers.map((brother) => <BrotherCard brother={brother} getBrothers = {getBrothers} accountType = {props.accountType}/>)}
         {requestedBrothersList && requestedBrothers && requestedBrothersList.map((brother) => <BrotherCard getBrothers = {getBrothers} brother={brother} accountType = {props.accountType}/>)}
        
        </div>
        
        

        <AddBrotherModal/>
        </>
    )

}



function BrotherCard(props){


  const deleteBrother = () => {
    console.log("deleting " + props.brother.username)
    var info = {'query': props.brother.username}
    fetch("http://localhost:8000/deleteBrother", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(info)


        })
        .then(respnse =>{
                props.getBrothers()
            }
        )
  }

  const makeAdmin = () => {
    var info = {'query': props.brother.username}
    fetch("http://localhost:8000/makeBrotherAdmin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(info)


        })
        .then(respnse =>{
                props.getBrothers()
            }
        )
  }

  const addAsBrother = () => {
    var info = {'username': props.brother.username}
    fetch("http://localhost:8000/addAsBrother", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(info)


        })
        .then(respnse =>{
                props.getBrothers()
            }
        )
  }





 


  return (
    <div>
    <Card style={{ width: '12rem' }}>
      
    <img style={{  maxHeight:"100px", display: "block", marginLeft: "auto", marginRight: "auto" }} class="rusheePhotos" variant="top" src={props.brother.photoURL} alt="Brother Picture Here" />
   
      {/* {console.log(props.brother)} */}
      <div>
        <div style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>{props.brother.first + " " + props.brother.last}</div>
        <div>
            {props.brother.major}
        </div>
        <div>
          {props.brother.housing}
        </div>
        {props.accountType === "admin" &&
        <div className="Brother-Buttons">
          
          {props.accountType === "admin" &&
          <Button variant="outline-dark" onClick={deleteBrother}>Delete Brother</Button>}
          <br></br>
          {props.accountType === "admin" && props.brother.type !== "admin" &&
          <Button variant="outline-dark" onClick={makeAdmin}>Make Admin</Button>}
          {props.accountType === "admin" && props.brother.type === "admin" &&
          <Button variant="outline-dark" onClick={addAsBrother}>Remove Admin</Button>}
            <br></br>
            {props.accountType === "admin" && props.brother.type === "requestedBrother" &&
          <Button variant="outline-dark" onClick={addAsBrother}>Add as Brother</Button>}
          </div> }
      </div>
    
    </Card>

    </div>
    
   
  );

}


export default ViewBrothers
