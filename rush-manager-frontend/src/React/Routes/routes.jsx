import React from "react";
import { useState } from 'react';
import {default as Login} from "../Login/Login"
import {default as ViewRushees} from "../Brother/viewRushees"
import {default as ViewBrothers} from "../Brother/viewBrothers"
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

    if (accountType == "Admin"){

        
        
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Brother accountType = "admin"/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                 <Routes>
                    <Route path="/rushEvents" element={<RushEvents_Brother accountType = "admin"/>}/>

                    <Route path="/viewRushees" element={<ViewRushees accountType = {"admin"}/>}/>

                    <Route path="/viewBrothers" element={<ViewBrothers accountType = {"admin"}/>}/>

                    <Route path= "*" element={<ViewRushees accountType = {"admin"}/>}/>
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

                    <Route path="/viewBrothers" element={<ViewBrothers accountType = {"rushee"}/>}/>

                    <Route path= "*" element={<RushEvents/>}/>
                </Routes>
            </Router>
        )
    }
    else if (accountType == "Brother"){

        
        
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Brother accountType = "brother"/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                 <Routes>
                    <Route path="/rushEvents" element={<RushEvents_Brother accountType = "brother"/>}/>

                    <Route path="/viewRushees" element={<ViewRushees accountType = {"brother"}/>}/>

                    <Route path="/viewBrothers" element={<ViewBrothers accountType = {"brother"}/>}/>

                    <Route path= "*" element={<ViewRushees accountType = {"brother"}/>}/>
                </Routes>
            </Router>
           
        )
    }

}

export default MyRouter 
