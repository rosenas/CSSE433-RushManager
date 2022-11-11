import React from 'react'
import Popup from 'reactjs-popup';
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FormCheck, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
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


function Login({ setToken, setAccountType, setAccountInfo }, {}) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [loginRes, setLoginRes] = useState();
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [couchDown, setCouchDown] = useState(false)
    const [noUser, setNoUser] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(password)
        let result = ""
        //check to verify login

        doc = {password: password, username: username}
        
        await fetch("http://localhost:8000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        })
        .then(response => response.json())
        .then(data => {
            result = data
            setAccountInfo(data)
            if(data.message === "No user found.") {
                setNoUser(true)
            } else if(data.message === "CouchDB is down.") {
                setCouchDown(true)
                
            }
        })
        .catch(error => {
            console.log("Couch Down")

        })
        console.log(result)
        if(result.result) {
            setToken("valid")
            setAccountType(result.accountType)
            console.log(result.username)
        }



    }


    let photo;
    const handleSetPhoto = (_photo) => {
      console.log(photo);
      photo = _photo
    }
    const handleCreateAccount = () => {
        setModal(true)

    }

    const handleCloseCouchDown = () => {
        setCouchDown(false)
    }

    const handleCloseNoUser = () => {
        setNoUser(false)
    }

    const handleClose = () => {
        setModal(false)
    }

    // const handleSubmitCreateAccount = () => {
    //     setModal(false)
       
    //     fetch("http://localhost:8000/createAccount", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
            
    //     })
    // }

    const [modal, setModal] = useState(false)
    const [unique, setUnique] = useState(false)
    const [usernameColor, setUsernameColor] = useState("green")
    const [rushee, setRushee] = useState(false)
    const [brother, setBrother] = useState(true)




    // let uniqueVar = "green"
    
    var doc = {'first': "",
            'requested': true,
            'accountType': "",
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

    
        const handleSelectBrother = () => {
            setBrother(true)
            setRushee(false)
            doc.accountType = "brother"
        }
    
        const handleSelectRushee = () => {
            setBrother(false)
            setRushee(true)
            doc.accountType = "rushee"
        }


    const handleSubmitCreateUser = () => {
        console.log("NEW USER")
        uploadFile(photo)
        console.log(doc)
        if(rushee) {
            doc.accountType = "rushee"

        } else if(brother) {
            doc.accountType = "brother"
        }
        fetch("http://localhost:8000/createUser", {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(doc)
              }).then(response => response.json())
              .then(data=>{
                setModal(false)
                console.log("HERE")
                console.log(data);
            })
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

    const CouchDownPopup = () => {
            return (
                
                <Modal show={couchDown} onHide={handleCloseCouchDown} position="right center">
                    <Modal.Header closeButton/>
                    <Modal.Title className='Modal-Title'>Couch DB is currently down</Modal.Title>
                    <Modal.Body>
                        <div>
                        Login services disabled
                        </div>
                    </Modal.Body>
                </Modal>
            )}

    const NoUserFoundPopup = () => {
        return (
                    
            <Modal show={noUser} onHide={handleCloseNoUser} position="right center">
                <Modal.Header closeButton/>
                <Modal.Title className='Modal-Title'>No user found</Modal.Title>
                <Modal.Body>
                    
                </Modal.Body>
            </Modal>
        )}
    
    const CreateAccount_Modal = () => {
        return (
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton/>
                <Modal.Title className='Modal-Title'>Create Account</Modal.Title>
                <Modal.Body>
                    <div>
                        <div className='Modal-Input'>
                        <ToggleButtonGroup
                            color="primary"
                            name="acctype"
                            style = {{width: "50px"}}
                            aria-label="Platform"
                            >
                                <ToggleButton active={brother} onClick={handleSelectBrother} value="brother">Brother</ToggleButton>
                                <ToggleButton active={rushee} onClick={handleSelectRushee} value="rushee">Rushee</ToggleButton>
                            </ToggleButtonGroup>
                            <label for="Username"><b>Username</b></label>
                            <input type="text" placeholder="Enter Username" name="Username" onChange={e => {doc.username = e.target.value
                            // checkUniqueUsername()
                            }} required/>

                            <label for="Password"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" name="Password" onChange={e => doc.password = e.target.value} required/>
                            <label for="First"><b>First Name</b></label>
                            <input type="text" placeholder="Enter First Name" name="first" onChange={e => doc.first = e.target.value} required/>
                            <label for="Last"><b>Last Name</b></label>
                            <input type="text" placeholder="Enter Last Name" name="Last" onChange={e => doc.last = e.target.value} required/>
                            <label for="Email"><b>Email</b></label>
                            <input type="text" placeholder="Enter Email" name="Email" onChange={e => doc.email = e.target.value} required/>
                            <label for="Phone"><b>Phone Number</b></label>
                            <input type="text" placeholder="Enter Phone Number" name="Phone" onChange={e => doc.phone = e.target.value} required/>
                            <label for="Major"><b>Major</b></label>
                            <input type="text" placeholder="Enter Major" name="Major" onChange={e => doc.major = e.target.value} required/>
                            <label for="housing"><b>Housing Location</b></label>
                            <input type="text" placeholder="Enter Housing Location" name="housing" onChange={e => doc.housing = e.target.value} required/>
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
                    </div>
                    <div className="Modal-Buttons">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitCreateUser}>Create Account</Button>
                    </div>
                </Modal.Body>

            </Modal>
        )

    }

    return (
        <>
            <h1 className='title createAccount'>Login to Rush Manager</h1>
            <div className='Login'>
                <label for="username"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="username" onChange={e => setUsername(e.target.value)} required />

                <label for="username"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="username" onChange={e => setPassword(e.target.value)} required />
                <Button variant="light" onClick={handleSubmit}>Login</Button>
            </div>


            <h3 className='title createAccount'>Need an Account?</h3>
            <div className='Sign-Up'>
                <Button variant="light" onClick={handleCreateAccount}>Create Account</Button>
            </div>
            <CreateAccount_Modal />
            <CouchDownPopup/>
            <NoUserFoundPopup/>
        </>

    )
}
export default Login
