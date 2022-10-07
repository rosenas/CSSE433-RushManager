import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";


function Navigation(){

    return (
        <Nav variant="tabs">
             <Nav.Item>
                <Nav.Link >
                    <NavLink to="/rushees">Rushees</NavLink>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>
                    <NavLink to="/rushEvents">Rush Events</NavLink> 
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )

   
}

export default Navigation
