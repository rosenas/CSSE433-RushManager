import React from "react";
import { NavLink } from "react-router-dom";


function Navigation(){

    return(
        <div className="navigation">
            <nav variant= "tabs" className="navbar navbar-expand">
                <div className="nav_container">
                    <div className="nav_item">
                        <NavLink className="nav-link" to="/rushEvents">
                            Rush Events
                        </NavLink>
                    </div>
                    <div className="nav_item">
                        <NavLink className="nav-link" to="/rushees">
                            Rushees
                        </NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navigation
