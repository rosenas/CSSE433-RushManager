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
            //console.log(data)
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
            {events && events.map((rushee) => <RushEvent event={rushee}/>)}
        </div>
        <div className= "add">
            <Button variant="light" onClick={handleAddRushEvent}>Add Rush Event</Button>
        </div>
        <AddRushEvent_Modal/>
        </>
    )

}

function RushEvent(props){

    const [moreInfo, setMoreInfo] = useState(false)

    const handleMoreInfo = () => {
        setMoreInfo(true)
    }

    const handleClose = () => {
        setMoreInfo(false)
    }

    const MoreInfo_Modal = () => {
        return (
            <Modal show={moreInfo} onHide={handleClose}>
                <Modal.Header closeButton />
                <Modal.Title className="Modal-Title"> Info about {props.event.name} </Modal.Title>
                <Modal.Body>
                    <div className="Modal-Table">
                        <table>
                            <tbody>
                            <tr>
                                <th>Rushee Name</th>
                                <th>Likes</th>
                            </tr>
                                {props.event.attending && props.event.attending.map((rushee) => {
                                    return (
                                        <tr>
                                            <td>{rushee.name}</td>
                                            <td>{rushee.likes}</td>
                                            
                                        </tr>
                                    )

                            })}
                            </tbody>
                            

                        </table>
                    </div>
                </Modal.Body>
            </Modal>
       )
    }

    return (
        <Card style={{ width: '12rem' }}>
            <Card.Body>
                <Card.Title>{props.event.name}</Card.Title>
                <Card.Text>
                    {props.event.date}
                </Card.Text>
                <Button className="add_button" onClick={handleMoreInfo} variant="outline-info">More Info</Button>
            </Card.Body>
            <MoreInfo_Modal/>
        </Card>
    );
}


export default RushEvents