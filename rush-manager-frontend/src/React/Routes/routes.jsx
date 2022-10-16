import React from "react";
import { useState } from 'react';
import {default as Login} from "../Login/Login"
import {default as ViewRushees} from "../Brother/viewRushees"
import {default as RushEvents} from "../Rushee/rushEvents"
import {default as RushEvents_Brother} from "../Brother/rushEvents"
import {default as Navigation_Brother} from "../Brother/navigation"
import {default as Navigation_Rushee} from "../Rushee/navigation"
import {default as Contact} from "../Rushee/contact"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Button from 'react-bootstrap/Button'


function MyRouter(){

    const [token, setToken] = useState()
    const [accountType, setAccountType ] = useState()

    console.log(accountType)

    if (token==='valid'){
        return(
            <LoggedInRouter setToken={setToken}  accountType={accountType}/>
        )
    }
    else{
        return (<Login setToken={setToken} setAccountType={setAccountType}/>)
    }

}


function LoggedInRouter({accountType, setToken }){



    const handleLogOut = () => {
        setToken("invalid")
    }

    if (accountType == "Brother"){

        
        
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Brother/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                 <Routes>
                    <Route path="/rushEvents" element={<RushEvents_Brother/>}/>

                    <Route path="/viewRushees" element={<ViewRushees/>}/>

                    <Route path= "*" element={<ViewRushees/>}/>
                </Routes>
            </Router>
           
        )
    }
    else if(accountType == "Rushee"){
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Rushee/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                <Routes>
                    <Route path="/rushEvents" element={<RushEvents/>}/>

                    <Route path="/contact" element={<Contact/>}/>

                    <Route path= "*" element={<RushEvents/>}/>
                </Routes>
            </Router>
        )
    }

}

export default MyRouter 
