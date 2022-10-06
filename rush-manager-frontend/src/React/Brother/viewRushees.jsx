import React from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../../CSS/index.css"



function ViewRushees(){

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
            console.log("test");
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
        
        </>
    )

}

function RusheeCard(props){
  return (
    <Card style={{ width: '12rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" alt="Rushee Picture Here"/>
      <Card.Body>
        <Card.Title>{props.rushee.name}</Card.Title>
        <Card.Text>
            {props.rushee.info}
        </Card.Text>
        <div>
          <Button variant="outline-info">Leave a comment</Button>
          <Button variant="outline-success">Like</Button>
        </div>
      
      </Card.Body>
    </Card>
  );
}


export default ViewRushees
