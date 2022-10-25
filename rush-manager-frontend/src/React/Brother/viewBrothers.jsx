import React from "react";
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import "../../CSS/index.css"



function ViewBrothers(props){

  console.log(props)
    const [brothers, setBrothers] = useState([])
    const [requestedBrothersList, setRequestedBrothersList] = useState([])
    const [ourBrothers, setOurBrothers] = useState(true)
    const [requestedBrothers, setRequestedBrothers] = useState(false)
    

    const [modal, setModal] = useState(false)



    var doc = {'first': "",
          'last': "",
          'username': "",
          'email': "",
          'major': "",
          'phone': "",
          'housing': ""};


    
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
                    if(rushee.type === "brother") {
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
      console.log(doc)
      fetch("http://localhost:8000/addBrother", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doc)
        })
        .then(respnse =>{
                console.log(respnse)
               
                //close the modal
                getBrothers()
                
                
              handleClose()
            }
        )


    }

    if(brothers.length == 0){
        getBrothers()
        console.log()
      
  }

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
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.first = e.target.value} required />
                          <label for="Event"><b>Last Name</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.last = e.target.value} required />
                          <label for="Event"><b>Username</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.username = e.target.value} required />
                          <label for="Event"><b>Email</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.email = e.target.value} required />
                          <label for="Event"><b>Phone Number</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.phone = e.target.value} required />
                          <label for="Event"><b>Major</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.major = e.target.value} required />
                          <label for="Event"><b>ResHall</b></label>
                          <input type="text" placeholder="Enter Brother Name" name="Brother Name" onChange={e => doc.housing = e.target.value} required />
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
        <div className="container">
         {brothers && ourBrothers && brothers.map((brother) => <BrotherCard brother={brother} getBrothers = {getBrothers} accountType = {props.accountType}/>)}
         {requestedBrothersList && requestedBrothers && requestedBrothersList.map((brother) => <BrotherCard getBrothers = {getBrothers} brother={brother} accountType = {props.accountType}/>)}
        
        </div>
        
        {
          props.accountType === "admin" &&
        <div className= "add">
            <Button variant="light" className="add_button"onClick={handleAddBrother}>Add Brother</Button>
        </div>
        }

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

  const addAsBrother = () => {
    console.log("deleting " + props.brother.username)
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
      <Card.Img variant="top" src="holder.js/100px180" alt="Brother Picture Here"/>
      {console.log(props.brother)}
      <Card.Body>
        <Card.Title>{props.brother.first + " " + props.brother.last}</Card.Title>
        <Card.Text>
            {props.brother.major}
        </Card.Text>
        <Card.Text>
          {props.brother.housing}
        </Card.Text>
        <div className="Brother-Buttons">
          
          {props.accountType === "admin" &&
          <Button variant="outline-dark" onClick={deleteBrother}>Delete Brother</Button>}
            
            {props.accountType === "admin" && props.brother.type === "requestedBrother" &&
          <Button variant="outline-dark" onClick={addAsBrother}>Add as Brother</Button>}
          </div>
      </Card.Body>
    
    </Card>

    </div>
    
   
  );

}


export default ViewBrothers
