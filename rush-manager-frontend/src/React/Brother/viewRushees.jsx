import React from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import "../../CSS/index.css"

function ViewRushees(){


    const [rushees, setRushees] = useState([])


  

    const [modal, setModal] = useState(false)

    var doc = {'first': "",
          'last': "",
          'username': "",
          'email': "",
          'major': "",
          'phone': "",
          'reshall': ""};
    const handleAddRushee = () => {
      setModal(true)
    }

    const handleSetRusheeName = (name) => {
      doc.first = name
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

    
    

    const getRushees = () => {
      fetch('http://localhost:8000/getRushees',{
                  headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                })
              .then(response=> response.json())
              .then(data=>{
                console.log("GETTING RUSHEES")
                setRushees(data)
                console.log(data)
              })
    }

    const handleSubmit = () => {
      console.log(doc)
      fetch("http://localhost:8000/addRushee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doc)
        })
        .then(respnse =>{
                console.log(respnse)
               
                //close the modal
                getRushees()
                
              handleClose()
            }
        )


    }

    if(rushees.length == 0){
      getRushees()
  }


    const AddRushEvent_Rushee=  () => {
      return(
          <Modal show={modal} onHide={handleClose}>
              <Modal.Header closeButton />
              <Modal.Title className="Modal-Title">
                  Add a Rush Event
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
                          <label for="Event"><b>Email</b></label>
                          <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.email = e.target.value} required />
                          <label for="Event"><b>Phone Number</b></label>
                          <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.phone = e.target.value} required />
                          <label for="Event"><b>Major</b></label>
                          <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.major = e.target.value} required />
                          <label for="Event"><b>ResHall</b></label>
                          <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => doc.reshall = e.target.value} required />
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
        <div className="container">
            {rushees && rushees.map((rushee) => <RusheeCard rushee={rushee} getRushees = {getRushees}/>)}
        </div>
        
        <div className= "add">
            <Button variant="light" className="add_button"onClick={handleAddRushee}>Add Rushee</Button>
        </div>
        <AddRushEvent_Rushee/>
        </>
    )

}



function RusheeCard(props){

  const handleAddAComment = () => {
    setCommentModal(true)
    console.log("test");
  }

  const handleClose = () => {
    setCommentModal(false)
  }

  const handleSetComment = (comment) => {
    
  }

  const handleSubmit = () => {
    
  }

  const handleCancel = () => {
    handleClose()
  }

  const [commentModal, setCommentModal] = useState(false)

  const [viewComments, setViewComments] = useState(false)

  const [like, setLike]= useState(false)

  const handleLike = () => {
    setLike(true)
  }

  const handleDislike = () => {
    setLike(false)
  }

  const handleViewComments = () => {
    setViewComments(true)
  }

  const deleteRushee = () => {
    console.log("deleting " + props.rushee.username)
    var info = {'query': props.rushee.username}
    fetch("http://localhost:8000/deleteRushee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(info)


        })
        .then(respnse =>{
                console.log(respnse)
               
                //close the modal
                props.getRushees()
                
              handleClose()
            }
        )
  }

  const handleCloseComments = () => {
    setViewComments(false)
  }

  const Like_Button = () => {
    if(like){
      return(
        <Button onClick={handleDislike} variant="outline-danger" >Dislike</Button>
      )
    }else{
      return(
        <Button  onClick={handleLike} variant="outline-success" >Like</Button>
      )
    }
  }

  const LeaveAComment_Modal = () => {
    return(
      <Modal show={commentModal} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Title className="Modal-Title">
          Leave A Comment About {props.rushee.name}
        </Modal.Title>
        <Modal.Body>
          <div className="Modal-Input">
            <label for="commment"><b>Comment</b></label>
            <input type="text" placeholder="Enter comment" name="Comment" onChange={e => handleSetComment(e.target.value)} required />
          </div>
          <div className="Modal-Buttons">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Add</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  const ViewAComment_Modal = () => {
    return(
      <Modal show={viewComments} onHide={handleCloseComments}>
        <Modal.Header closeButton/>
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
                    {props.rushee.comments && props.rushee.comments.map((comment) => {
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
                    {props.rushee.events && props.rushee.events.map((event) => {
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
    <Card style={{ width: '12rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" alt="Rushee Picture Here"/>
      <Card.Body>
        <Card.Title>{props.rushee.first + " " + props.rushee.last}</Card.Title>
        <Card.Text>
            {//TODO make this a drop down
            props.rushee.major}
        </Card.Text>
        {/* <Card.Text>
          {props.rushee.email}
        </Card.Text>
        <Card.Text>
          {props.rushee.phone}
        </Card.Text> */}
        <Card.Text>
          {props.rushee.reshall}
        </Card.Text>
        <Card.Text>
          Likes: {"NYI"}
        </Card.Text>
        <div className="Rushee-Buttons">
          <Button variant="outline-dark " onClick={handleAddAComment}>Comment</Button>
          <Like_Button/>
          <Button variant="outline-dark" onClick={handleViewComments}>More Info</Button>
          <Button variant="outline-dark" onClick={deleteRushee}>Delete Rushee</Button>
        </div>
      </Card.Body>
      <LeaveAComment_Modal/>
      <ViewAComment_Modal/>
    </Card>
   
  );
}


export default ViewRushees
