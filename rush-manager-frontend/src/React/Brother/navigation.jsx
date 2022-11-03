import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState } from 'react';

function Navigation(props){
    
    let searchValue = ""
    // const [searchRushees, setSearchRushees] = useState(false)
    // const [search, setSearch] = useState([])
    const handleSearch = () => {
    let data = {'body': searchValue}
    fetch("http://127.0.0.1:8000/searchRushee", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data=>{
          props.setDisplaySearch(true)
          props.setSearchRes(data)
      })
    }

    return (
        <Nav variant="tabs">
             <Nav.Item>
                <Nav.Link >
                    <NavLink to="/rushees" >Rushees</NavLink>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>
                    <NavLink to="/rushEvents">Rush Events</NavLink> 
                </Nav.Link>
            </Nav.Item>
            {/* {console.log("ACC TYPE:" + props.accountType)} */}
           
            <Nav.Item>
            <Nav.Link>
                <NavLink to="/viewBrothers">Brothers</NavLink> 
            </Nav.Link>
        </Nav.Item>
            
            {props.accountType === "admin" &&
            <Nav.Item>
            <Nav.Link>
                <NavLink to="/rushEvents">Administration</NavLink> 
            </Nav.Link>
        </Nav.Item>
            }
            <Form>
            <Form.Control
              type="search"
              placeholder="Search"
              className="search_bar form-control"
              aria-label="Search"
              onChange={e => searchValue = e.target.value}
            />
            </Form>
            <Button variant="outline-secondary" className="search_button" onClick={handleSearch}>
                Search
            </Button>
        </Nav>
    )

   
}

export default Navigation
