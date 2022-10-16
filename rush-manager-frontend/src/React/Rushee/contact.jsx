import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useState } from "react";





function Contact(){

    const _rushChairs = [
        {
            "name": "James Morehouse",
            "phone": "847-769-7820"
        },
        {
            "name": "Blake Deckard",
            "phone": "312-493-7129"
        }
    ]

    const [rushChairs, setRushChairs] = useState([])

    if(rushChairs.length == 0){
        setRushChairs(_rushChairs)
    }

    

    return(
        <>
            <h1 className="title">Contact us</h1>
            <div>
            {rushChairs && rushChairs.map((rushChair) => <RushChair rushChair={rushChair}/>)}
            
            </div>
           
        </>
    )
}


function RushChair(props){
    return (
        <Card style={{ width: '30rem' }}>
            <Card.Body>
                <Card.Title>{props.rushChair.name}</Card.Title>
                <Card.Text>
                    {props.rushChair.phone}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}



export default Contact