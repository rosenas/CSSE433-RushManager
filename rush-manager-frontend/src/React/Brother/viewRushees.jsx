import React from "react";
import { useState } from 'react';
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


function ViewRushees(props) {
  
  const [run, setRun] = useState(false)
  const [rushees, setRushees] = useState([])
  
  // console.log(props.searchRes)


  
  // if(props.displaySearch && !run) {
  //   console.log("HERE")
  //   setRun(true)
  //   setRushees(props.searchRes)
  //   console.log(props.searchRes)
  // }

  const [filteredRusheeList, setFilteredRusheeList] = useState([])

  //toggle flags
  const [allRushees, setAllRushees] = useState(true)
  const [ourRushees, setOurRushees] = useState(false)
  const [rusheesWithBids, setRusheesWithBids] = useState(false)

  const [modal, setModal] = useState(false)

  const [events, setEvents] = useState([])

    const getEvents = () => {
      fetch('http://localhost:8000/getEvents',{
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        })
        .then(response=> response.json())
        .then(data=>{
            // console.log("test");
            setEvents(data)
            // console.log(data)
        })
    }

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    if(events.length == 0){
        getEvents()
    }

  var doc = {
    'first': "",
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

  const getRushees = () => {
    fetch('http://localhost:8000/getRushees', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setRushees(data)
        filterRushees(data)
      })
  }

  async function filterRushees(data) {
    let filt = []
    if (allRushees) {
      setFilteredRusheeList(data)
    } else if (ourRushees) {
      filt = data.filter(rushee => {
        if (rushee.fraternityInfo["FIJI"].interested) {
          return rushee
        }
      });
      setFilteredRusheeList(filt)
    } else if (rusheesWithBids) {
      filt = data.filter(rushee => {
        if (rushee.fraternityInfo["FIJI"].bidStatus) {
          return rushee
        }
      });
      setFilteredRusheeList(filt)
    }
  }

  const handleAddRushee = () => {
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
    console.log(doc.interests)
  }

  const handleAllRushees = () => {
    setFilteredRusheeList(rushees)
    setAllRushees(true)
    setOurRushees(false)
    setRusheesWithBids(false)
    props.setDisplaySearch(false)
  }

  const handleOurRushees = () => {
    const filt = rushees.filter(rushee => {
      if (rushee.fraternityInfo["FIJI"].interested) {
        return rushee
      }
    });
    props.setDisplaySearch(false)
    setFilteredRusheeList(filt)
    setAllRushees(false)
    setRusheesWithBids(false)
    setOurRushees(true)
    
  }

  const handleRusheesWithBids = () => {
    const filt = rushees.filter(rushee => {
      if (rushee.fraternityInfo["FIJI"].bidStatus) {
        return rushee
      }
    });
    setFilteredRusheeList(filt)
    setRusheesWithBids(true)
    setAllRushees(false)
    setOurRushees(false)
    props.setDisplaySearch(false)
  }


  const handleSubmit = () => {
    uploadFile(photo)
    // console.log(doc)
    fetch("http://localhost:8000/addRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doc)
    })
      .then(respnse => {
        getRushees()
        handleClose()
      }
      )
  }

  const [football, setFootball] = useState(false)

  const handleFootball = () => {
    // setFootball(!football)
    // console.log(doc.interests)
  }

  const [int, setInt] = useState({
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
  })


  if (rushees.length == 0) {
    getRushees()
  }

  const AddRushEvent_Rushee = () => {
    return (
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Title className="Modal-Title">
          Add a Rushee
        </Modal.Title>
        <Modal.Body>
          <div>

            <div className="Modal-Input">
              <label for="Event"><b>First Name</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.first = e.target.value} required />
              <label for="Event"><b>Last Name</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.last = e.target.value} required />
              <label for="Event"><b>Username</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.username = e.target.value} required />
              <label for="Event"><b>Password</b></label>
              <input type="text" placeholder="Enter Password" name="Rushee Name" onChange={e => doc.password = e.target.value} required />
              <label for="Event"><b>Email</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.email = e.target.value} required />
              <label for="Event"><b>Phone Number</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.phone = e.target.value} required />
              <label for="Event"><b>Major</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.major = e.target.value} required />
              <label for="Event"><b>ResHall</b></label>
              <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.housing = e.target.value} required />
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
               
                {/* <div style={{margin:20}}> */}

              {/* <Button active={football} onClick={e => interests.football = !interests.football}>Football</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.soccer = !interests.soccer}>Soccer</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.baseball = !interests.baseball}>Baseball</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.golf = !interests.golf}>Golf</Button>
              </div>
              <div style={{margin:20}}>
              <Button onClick={e => interests.basketball = !interests.basketball}>Basketball</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.gpe = !interests.gpe}>GPE</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.gaming = !interests.footgamingball}>Gaming</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.swimming = !interests.swimming}>Swimming</Button>
              </div>
              <div style={{margin:20}}>
              <Button onClick={e => interests.lifting = !interests.lifting}>Lifting</Button>
              <Button style={{marginLeft:20}} onClick={e => interests.running = !interests.running}>Running</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.eating = !interests.eating}>Eating</Button>
              <Button style={{marginLeft:20}}onClick={e => interests.bickic = !interests.bickic}>BIC/KIC</Button>
              
              </div>
              <Button style={{marginLeft:20}}onClick={handleFootball}>PRINT</Button>
              </div> */}
              {/* <label for="Date"><b>Photo</b></label>
              <input type="file" placeholder="Upload Photo" name="photo" onChange={e => handleSetPhoto(e.target.files[0])} required />  */}
              {/* </div> */}

            <div className="Modal-Buttons">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>Add</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
      <h1 className="title">Rushees</h1>
      <div className="add">
        <ToggleButtonGroup
          color="primary"
          name="toggle"
          exclusive="true"
          aria-label="Platform"
        >
          <ToggleButton active={allRushees} onClick={handleAllRushees} value="all">All Rushees</ToggleButton>
          <ToggleButton active={ourRushees} value="ourList" onClick={handleOurRushees} >Our List</ToggleButton>
          <ToggleButton active={rusheesWithBids} value="bids" onClick={handleRusheesWithBids} >Bids</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="container">
        {console.log(props.displaySearch)}
        {console.log(rushees)}
        {props.displaySearch && props.searchRes.map((rushee) => <RusheeCard events={events} accountInfo={props.accountInfo} rushee={rushee} rusheesWithBids={rusheesWithBids} ourRushees={ourRushees} allRushees={allRushees} getRushees={getRushees} accountType={props.accountType} />)}
        {rushees && !props.displaySearch && filteredRusheeList.map((rushee) => <RusheeCard events={events} accountInfo={props.accountInfo} rushee={rushee} rusheesWithBids={rusheesWithBids} ourRushees={ourRushees} allRushees={allRushees} getRushees={getRushees} accountType={props.accountType} />)}
      </div>
      {
        props.accountType === "admin" &&
        <div className="add">
          <Button variant="light" className="add_button" onClick={handleAddRushee}>Add Rushee</Button>
        </div>
      }
      <AddRushEvent_Rushee />
    </>
  )
}

function RusheeCard(props) {
  let eventsAttended = props.events.map((event) => event.attended.includes(props.rushee.username) && event)
  eventsAttended = eventsAttended.filter((event) => event !== false)
  // console.log(eventsAttended)
  let comment = ""
  const handleAddAComment = () => {

    setCommentModal(true)
  }

  const handleClose = () => {
    setCommentModal(false)
  }


  const handleSubmit = () => {
    const loggedInUsername = props.accountInfo.username
    var info = { 'user': loggedInUsername, 'rushee': props.rushee.username, 'comment': comment}
    fetch("http://127.0.0.1:8000/addComment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
    setCommentModal(false)
  }

  const handleCancel = () => {
    handleClose()
  }

  const [commentModal, setCommentModal] = useState(false)

  const [viewComments, setViewComments] = useState(false)

  const handleLike = () => {
    const loggedInUsername = props.accountInfo.username
    // console.log(loggedInUsername)
    var info = { 'user': loggedInUsername, 'rushee': props.rushee.username }
    fetch("http://127.0.0.1:8000/likeRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
  }

  const handleDislike = () => {
    const loggedInUsername = props.accountInfo.username
    var info = { 'user': loggedInUsername, 'rushee': props.rushee.username }
    fetch("http://127.0.0.1:8000/dislikeRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
  }

  const handleViewComments = () => {
    setViewComments(true)
    getRecs()
  }

  const deleteRushee = () => {
    var info = { 'query': props.rushee.username, 'first':props.rushee.first, 'last': props.rushee.last }
    fetch("http://localhost:8000/deleteRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
  }

  const handleCloseComments = () => {
    setViewComments(false)
  }

  const Like_Button = () => {
    const likes = props.rushee.fraternityInfo["FIJI"].likes
    const username = props.accountInfo.username
    if (likes.includes(username)) {
      return (
        <Button onClick={handleDislike} variant="outline-danger" >Dislike</Button>
      )
    } else {
      return (
        <Button onClick={handleLike} variant="outline-success" >Like</Button>
      )
    }
  }

  const toggleBidStatus = () => {
    var info = { 'query': props.rushee.username }
    fetch("http://localhost:8000/changeBid", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
  }

  const Bid_Button = () => {
    if (props.rushee.fraternityInfo["FIJI"].bidStatus) {
      return (
        <Button onClick={toggleBidStatus} variant="outline-danger" >Remove Bid</Button>
      )
    } else {
      return (
        <Button onClick={toggleBidStatus} variant="outline-success" >Give Bid</Button>
      )
    }
  }

  const LeaveAComment_Modal = () => {
    return (
      <Modal show={commentModal} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Title className="Modal-Title">
          Leave A Comment About {props.rushee.name}
        </Modal.Title>
        <Modal.Body>
          <div className="Modal-Input">
            <label for="commment"><b>Comment</b></label>
            <input type="text" placeholder="Enter comment" name="Comment" onChange={e => comment = e.target.value} required />
          </div>
          <div className="Modal-Buttons">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Add</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  const handleChangeRusheeInterest = () => {
    var info = { 'query': props.rushee.username }
    fetch("http://127.0.0.1:8000/changeFratInterest", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info)
    })
      .then(respnse => {
        props.getRushees()
      }
      )
  }

  const [recs, setRecs] = useState([])

  const getRecs = () => {
    var info = { 'username': props.rushee.username }
    fetch("http://127.0.0.1:8000/getRecs", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(info)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    setRecs(data)
  })
  }

  const ViewAComment_Modal = () => {
    // let recs= [{'name': "grant"}, {'name': "ari"}]
    

    
    

    return (
      
      <Modal show={viewComments} onHide={handleCloseComments}>
        <Modal.Header closeButton />
        
        
        <Modal.Title className="Modal-Title">
          {props.rushee.first + " " + props.rushee.last}
        </Modal.Title>
        <Modal.Body>
          <div>
          
            {props.rushee.email}
          </div>
          <div>
            {props.rushee.phone}
          </div>
          <div>
            <h4>Recommended Brothers:</h4>
            {recs.map((rec) => {
              return <div>{rec.first + " " + rec.last}</div>
            })}
            </div>
          <div className="rushee_tables">
            <div>
              <h3 className="table-name">Comments</h3>
              <div className="Modal-Table">
                <table>
                  <tbody>
                    <tr>
                      <th>Brother</th>
                      <th>Comment</th>
                    </tr>
                    {props.rushee.fraternityInfo["FIJI"].comments && props.rushee.fraternityInfo["FIJI"].comments.map((comment) => {
                      return (
                        <tr>
                          <td>{comment.user}</td>
                          <td>{comment.comment}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="table-name">Events Attended</h3>
              <div className="Modal-Table">
                <table>
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <th>Event</th>
                    </tr>
                    {eventsAttended && eventsAttended.map((event) => {
                      return (
                        <tr>
                          <td>{event.date}</td>
                          <td>{event.name}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

            </div>


          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <div>
      <Card style={{ width: '12rem' }}>
      <Card.Img style={{ width: '110px' }}class="rusheePhotos" variant="top" src={props.rushee.photoURL} alt="Rushee Picture Here" />
        <Card.Body>
          <div>
            <div><h5>{props.rushee.first + " " + props.rushee.last}</h5></div>
            
            <div>{props.rushee.major}</div>
            <div>{props.rushee.housing}</div>
            <div>Likes: {props.rushee.fraternityInfo["FIJI"].likes.length}</div>
          </div>
          <div className="Rushee-Buttons">
            <Button variant="outline-dark " onClick={handleAddAComment}>Comment</Button>
            <Like_Button />
            {props.accountType === "admin" &&
            <Bid_Button />}
            <Button variant="outline-dark" onClick={handleViewComments}>More Info</Button>
            {props.accountType === "admin" && props.allRushees &&
              <Button variant="outline-dark" onClick={deleteRushee}>Delete Rushee</Button>}
            {props.accountType === "admin" && props.allRushees &&
              <Button variant="outline-dark" disabled={props.rushee.fraternityInfo["FIJI"].interested} onClick={handleChangeRusheeInterest}>Add to Our List</Button>}
            {props.accountType === "admin" && (props.ourRushees || props.rusheesWithBids) &&
              <Button variant="outline-dark" onClick={handleChangeRusheeInterest}>Remove Rushee</Button>}
          </div>
        </Card.Body>
        <LeaveAComment_Modal />
        <ViewAComment_Modal />
      </Card>
    </div>
  );
}

export default ViewRushees