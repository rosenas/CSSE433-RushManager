import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useState } from "react";





function Contact(props){
    // if(props.accountType === 'admin') {
    //     console.log("ADMIN")
    // }

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
            <div style={{justifyContent: "center"}}>
            <img style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} class="rusheePhotos" variant="top" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgQ_hEpiFXEdZ6zg8Yn1mKSRir3F8sXw6lYg&usqp=CAU"} alt="Rushee Picture Here" />
            </div>
            <div >
            {rushChairs && rushChairs.map((rushChair) => <RushChair rushChair={rushChair}/>)}
            
            </div>
           
        </>
    )
}


function RushChair(props){
    return (
        <>
        <Card style={{ width: '30rem', display: "block", marginLeft: "auto", marginRight: "auto" }}>
            <Card.Body>
                <Card.Title>{props.rushChair.name}</Card.Title>
                <Card.Text>
                    {props.rushChair.phone}
                </Card.Text>
            </Card.Body>
        </Card>
        <br></br>
        </>
    )
}



export default Contact