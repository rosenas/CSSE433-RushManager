import React from "react";
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'react-bootstrap';
import "../../CSS/index.css"


function RushEvents(){

    const [events, setEvents] = useState([])
    const [eventName, setEventName] = useState()
    const [eventDate, setEventDate] = useState()

    let tempEventName
    let tempEventDate

    const handleSetEventName = (name) =>{
        tempEventName = name;
    }

    const handleSetEventDate = (date) =>{
        tempEventDate = date;
    }


    const [modal, setModal] = useState(false)

    const handleAddRushEvent = () => setModal(true)

    const handleClose = () => setModal(false)

    const handleSubmit = e =>{
        console.log(tempEventName);
        console.log(tempEventDate);
        const event = {
            "name": tempEventName,
            "date": tempEventDate
        }

        //make a post request to send data to store it
        fetch("http://localhost:8000/addEvent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
            .then(data => {
               
                //close the modal
                handleClose()
                //get the updated list
                fetch('http://localhost:8000/getEvents', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        setEvents(data)
                        
                        console.log(data);
                        
                        
                    })

            })


    }

    const handleCancel = e => {

        //clear the event name and date
        setEventName("")
        setEventDate("")

        handleClose()
    }

    if(events.length == 0){
        fetch('http://localhost:8000/getEvents',{
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        })
        .then(response=> response.json())
        .then(data=>{
            setEvents(data)
        })
    }

    const AddRushEvent_Modal=  () => {
        return(
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton />
                <Modal.Title className="Modal-Title">
                    Add a Rush Event
                </Modal.Title>
                <Modal.Body>
                    <div>
                        <div className="Modal-Input">
                            <label for="Event"><b>Event Name</b></label>
                            <input type="text" placeholder="Enter Event Name" name="eventName" onChange={e => handleSetEventName(e.target.value)} required />

                            <label for="Date"><b>Date</b></label>
                            <input type="text" placeholder="Enter Date" name="Date" onChange={e => handleSetEventDate(e.target.value)} required />
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
        
        <h1 className="title">Rush Events</h1>
        <div className="container">
            {events && events.map((rushee) => <RushEvent rushee={rushee}/>)}
        </div>
        <div className= "add">
            <Button variant="light" onClick={handleAddRushEvent}>Add Rush Event</Button>
        </div>
        <AddRushEvent_Modal/>
        </>
    )

}

function RushEvent(props){
  return (
    <Card style={{ width: '12rem' }}>
      <Card.Body>
        <Card.Title>{props.rushee.name}</Card.Title>
        <Card.Text>
            {props.rushee.date}
        </Card.Text>
        <Button variant="outline-info">More Info</Button>
      </Card.Body>
    </Card>
  );
}


export default RushEvents