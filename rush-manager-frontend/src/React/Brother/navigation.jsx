import React from "react";
import Nav from "react-bootstrap/Nav"
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


function Navigation(){

    const handleSearch = () => {
        
    }

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
            <Form>
            <Form.Control
              type="search"
              placeholder="Search"
              className="search_bar form-control"
              aria-label="Search"
            />
            </Form>
            <Button variant="outline-secondary" className="search_button">
                Search
            </Button>
        </Nav>
    )

   
}

export default Navigation
