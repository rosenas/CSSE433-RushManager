import React from "react";
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import "../../CSS/index.css"



function ViewRushees(props) {
  const [rushees, setRushees] = useState([])

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
            console.log("test");
            setEvents(data)
            console.log(data)
        })
    }

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
    'housing': ""
  };

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
  }

  const handleAllRushees = () => {
    setFilteredRusheeList(rushees)
    setAllRushees(true)
    setOurRushees(false)
    setRusheesWithBids(false)
  }

  const handleOurRushees = () => {
    const filt = rushees.filter(rushee => {
      if (rushee.fraternityInfo["FIJI"].interested) {
        return rushee
      }
    });
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
  }


  const handleSubmit = () => {
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
        {rushees && filteredRusheeList.map((rushee) => <RusheeCard events={events} accountInfo={props.accountInfo} rushee={rushee} rusheesWithBids={rusheesWithBids} ourRushees={ourRushees} allRushees={allRushees} getRushees={getRushees} accountType={props.accountType} />)}
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
  console.log(eventsAttended)
  let comment = ""
  const handleAddAComment = () => {

    setCommentModal(true)
  }

  const handleClose = () => {
    setCommentModal(false)
  }

  const handleSetComment = (comment) => {

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
  }

  const deleteRushee = () => {
    var info = { 'query': props.rushee.username }
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

  const ViewAComment_Modal = () => {
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
        <Card.Img variant="top" src="holder.js/100px180" alt="Rushee Picture Here" />
        <Card.Body>
          <Card.Title>{props.rushee.first + " " + props.rushee.last}</Card.Title>
          <Card.Text>
            {props.rushee.major}
          </Card.Text>
          <Card.Text>
            {props.rushee.housing}
          </Card.Text>
          <Card.Text>
            Likes: {props.rushee.fraternityInfo["FIJI"].likes.length}
          </Card.Text>
          <div className="Rushee-Buttons">
            <Button variant="outline-dark " onClick={handleAddAComment}>Comment</Button>
            <Like_Button />
            <Bid_Button />
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