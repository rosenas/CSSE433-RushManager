import React from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import "../../CSS/index.css"



function ViewRushees(){

    const [modal, setModal] = useState(false)

    let rushee;
    const handleAddRushee = () => {
      setModal(true)
    }

    const handleSetRusheeName = (name) => {
      rushee = name
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
                          <label for="Event"><b>Rushee Name</b></label>
                          <input type="text" placeholder="Enter Rushee Name" name="Rushee Name" onChange={e => handleSetRusheeName(e.target.value)} required />

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

    const [rushees, setRushees] = useState([])

    if(rushees.length == 0){
        fetch('http://localhost:8000/getRushees',{
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        })
        .then(response=> response.json())
        .then(data=>{
            setRushees(data)
            console.log(data)
        })
    }

    return (
        <>
        <h1 className="title">Rushees</h1>
        <div className="container">
            {rushees && rushees.map((rushee) => <RusheeCard rushee={rushee}/>)}
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
          {props.rushee.name}
        </Modal.Title>
        <Modal.Body>
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
        <Card.Title>{props.rushee.name}</Card.Title>
        <Card.Text>
            {//TODO make this a drop down
            props.rushee.info
            }
        </Card.Text>
        <Card.Text>
          Likes: {props.rushee.likes}
        </Card.Text>
        <div className="Rushee-Buttons">
          <Button variant="outline-dark " onClick={handleAddAComment}>Comment</Button>
          <Like_Button/>
          <Button variant="outline-dark" onClick={handleViewComments}>More Info</Button>
        </div>
      </Card.Body>
      <LeaveAComment_Modal/>
      <ViewAComment_Modal/>
    </Card>
   
  );
}


export default ViewRushees
