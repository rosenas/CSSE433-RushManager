import React from "react";
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import "../../CSS/index.css"




function RushEvents(){

    const [events, setEvents] = useState([])

    if(events.length == 0){
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

    return (
        <>
        <h1 className="title">Rush Events</h1>
        <div className="container">
            {events && events.map((rushee) => <RushEvent rushee={rushee}/>)}
        </div>
        
        </>
    )

}

function RushEvent(props){

  const [rsvp, setRSVP] = useState(false)

    const handleRSVP = () => {
        setRSVP(true)
    }

    const handleUnRSVP = () => {
        setRSVP(false)
    }

    const RSVP_Button = () => {
        if(rsvp){
          return(
            <Button onClick={handleUnRSVP} variant="outline-danger">Un-RSVP</Button>
          )
          
        }
        else{
          return(
            <Button onClick={handleRSVP} variant="outline-success">RSVP</Button>
          )
          
        }
    }


  return (
    <Card style={{ width: '12rem' }}>
      <Card.Body>
        <Card.Title>{props.rushee.name}</Card.Title>
        <Card.Text>
            {props.rushee.date}
            <div>
              <RSVP_Button />
            </div>
        </Card.Text>
       
        
      </Card.Body>
    </Card>
  );
}


export default RushEvents