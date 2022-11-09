import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Popup from 'reactjs-popup';
import { useState } from 'react';

function Navigation(props){
    let searchValue = ""
    console.log("NAV PROPS")
    console.log(props)
    // const [searchRushees, setSearchRushees] = useState(false)
    const [search, setSearch] = useState("")
    const handleSearch = event => {
        
    let data = {'body': search}
    fetch("http://127.0.0.1:8000/searchRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data=>{
        console.log(props)
        if(data[0] === "REDIS is currently down: search feature disabled"){
            console.log(data[0])
            props.setRedisDown(true)
        } else{
            console.log("DATA")
            console.log(data)
            props.setDisplaySearch(true)
            props.setSearchRes(data)
            console.log(props.dis)


        }
          
      })
    }

    return (
       
        <Nav variant="tabs">
            {console.log(props)}
             {props.accountType !== "requestedBrother" &&
             <Nav.Item>
                <Nav.Link >
                    <NavLink to="/rushees" >Rushees</NavLink>
                </Nav.Link>
            </Nav.Item>}
            {props.accountType !== "requestedBrother" &&
            <Nav.Item>
                <Nav.Link>
                    <NavLink to="/rushEvents">Rush Events</NavLink> 
                </Nav.Link>
            </Nav.Item>}
            
            {props.accountType !== "requestedBrother" &&
            <Nav.Item>
            <Nav.Link>
                <NavLink to="/viewBrothers">Brothers</NavLink> 
            </Nav.Link>

        </Nav.Item>}
        
            
            {props.accountType === "admin" &&
            <Nav.Item>
            <Nav.Link>
                <NavLink accountType={props.accountType} to="/contact">Administration</NavLink> 
            </Nav.Link>
        </Nav.Item>
            }

{props.accountType !== "requestedBrother" &&
            <Form>
            <Form.Control
              type="search"
              placeholder="Search for Rushee"
              className="search_bar form-control"
              aria-label="Search"
              onChange={e => setSearch(e.target.value)}
            //   onSubmit={handleSearch} 
            //   onChange={e => searchValue = e.target.value}
            />
            </Form>}
            {props.accountType !== "requestedBrother" &&
            <Button type="submit" variant="outline-secondary" className="search_button" onClick={handleSearch}>
                Search
            </Button>}
        </Nav>
    )

   
}

export default Navigation
