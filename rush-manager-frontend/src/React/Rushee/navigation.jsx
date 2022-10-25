import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


function Navigation(){

    return (
        <Nav variant="tabs">
             <Nav.Item>
                <Nav.Link >
                    <NavLink to="/Contact">FIJI Info</NavLink>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>
                    <NavLink to="/rushEvents">Rush Events</NavLink> 
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>
                    <NavLink to="/viewBrothers">Brothers</NavLink> 
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )

   
}

export default Navigation
