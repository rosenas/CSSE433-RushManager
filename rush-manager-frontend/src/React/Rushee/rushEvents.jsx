import React from "react";
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import "../../CSS/index.css"




function RushEvents(props){
  console.log("PROPS")
  console.log(props.accountInfo.username)

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

    return (
        <>
        <h1 className="title">Rush Events</h1>
        <div className="container">
            {events && events.map((event) => <RushEvent getEvents = {getEvents} props = {props} event={event}/>)}
        </div>
        
        </>
    )

}

function RushEvent(props){
  
  const [rsvp, setRSVP] = useState(false)

    

    const handleRSVP = () => {
      var info = { 'username': props.props.accountInfo.username, 'event': props.event.name }
      fetch("http://localhost:8000/changeRSVP", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info)
      })
        .then(respnse => {
          props.getEvents()
        }
        )
    }

    const RSVP_Button = () => {
      let username = (props.props.accountInfo.username)
      // console.log(.username)
      // console.log(username)
      let rsvped = props.event.attended.includes(username)
      if (rsvped) {
        return (
          <Button onClick={handleRSVP} variant="outline-danger" >Un RSVP</Button>
        )
      } else {
        return (
          <Button onClick={handleRSVP} variant="outline-success" >RSVP</Button>
        )
      }
        // if(rsvp){
        //   return(
        //     <Button onClick={handleUnRSVP} variant="outline-danger">Un-RSVP</Button>
        //   )
          
        // }
        // else{
        //   return(
        //     <Button onClick={handleRSVP} variant="outline-success">RSVP</Button>
        //   )
          
        // }
    }


  return (
    <Card style={{ width: '12rem' }}>
      <Card.Body>
        <Card.Title>{props.event.name}</Card.Title>
        <Card.Text>
            {props.event.date}
            <div>
              <RSVP_Button />
            </div>
        </Card.Text>
       
        
      </Card.Body>
    </Card>
  );
}


export default RushEvents