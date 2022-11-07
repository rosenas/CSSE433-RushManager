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

let loaded = false

function MyRouter(){

    const [token, setToken] = useState()
    const [accountType, setAccountType ] = useState()
    const [accountInfo, setAccountInfo] = useState();
    



    console.log(accountType)

    if (token==='valid'){
        return(
            <LoggedInRouter setToken={setToken}  accountType={accountType} accountInfo={accountInfo}/>
        )
    }
    else{
        return (<Login setToken={setToken} setAccountType={setAccountType} setAccountInfo={setAccountInfo} />)
    }

}


function LoggedInRouter({accountType, setToken, accountInfo }){
    const [displaySearch, setDisplaySearch] = useState(false)
    const [searchRes, setSearchRes] = useState([])
    const [redisDown, setRedisDown] = useState(false)
    // const [rushees, setRushees] = useState([])

    // const getRushees = () => {
    //     fetch('http://localhost:8000/getRushees', {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //       }
    //     })
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log("DATA")
    //         console.log(data)
    //         setRushees(data)
    //         filterRushees(data)
    //       })
    //       .catch(error => {
    //         console.log("ERROR IN COUCH")
    
    //       })
    
    //   }

    // if(!loaded){
    //     getRushees
    //     loaded = true
    // }

    const handleLogOut = () => {
        setToken("invalid")
    }



    if (accountType == "Admin" || accountType == "admin" ){

        
        
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Brother displaySearch={displaySearch} setDisplaySearch={setDisplaySearch} setSearchRes={setSearchRes} accountType = "admin"/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                 <Routes>
                    <Route path="/rushEvents" element={<RushEvents_Brother accountInfo= {accountInfo} accountType = {"admin"}/>}/>

                    <Route path="/viewRushees" element={<ViewRushees redisDown={redisDown} accountInfo= {accountInfo} setRedisDown={setRedisDown} searchRes={searchRes} displaySearch={displaySearch} setDisplaySearch={setDisplaySearch} setSearchRes={setSearchRes} accountType = {"admin"}/>}/>

                    <Route path="/viewBrothers" element={<ViewBrothers accountInfo= {accountInfo} accountType = {"admin"}/>}/>

                    <Route path="/contact" element={<Contact accountInfo= {accountInfo} accountType = {"admin"}/>}/>

                    <Route path= "*" element={<ViewRushees 
                    // getRushees={getRushees} rushees={rushees} setRushees={setRushees} 
                    setRedisDown={setRedisDown} redisDown={redisDown} searchRes={searchRes} displaySearch={displaySearch} setDisplaySearch={setDisplaySearch} setSearchRes={setSearchRes} accountInfo= {accountInfo} accountType = {"admin"}/>}/>
                </Routes>
            </Router>
           
        )
    }
    else if(accountType == "rushee"){
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Rushee/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                <Routes>
                    <Route path="/rushEvents" element={<RushEvents accountInfo= {accountInfo} accountType = {"rushee"}/>}/>

                    <Route path="/contact" element={<Contact accountInfo= {accountInfo} accountType = {"rushee"}/>}/>

                    <Route path="/viewBrothers" element={<ViewBrothers accountInfo= {accountInfo} accountType = {"rushee"}/>}/>

                    <Route path= "*" element={<RushEvents accountType = {"rushee"} accountInfo= {accountInfo}/>}/>
                </Routes>
            </Router>
        )
    }
    else if (accountType == "brother"){

        
        
        return (
            <Router>
                <div className="Navigation">
                    <Navigation_Brother accountType = "brother"/>
                    <Button className="LogOut_Button" onClick={handleLogOut}>Log out</Button>
                </div>
                 <Routes>
                    <Route path="/rushEvents" element={<RushEvents_Brother accountInfo= {accountInfo} accountType = {"brother"}/>}/>

                    <Route path="/viewRushees" element={<ViewRushees accountInfo= {accountInfo} accountType = {"brother"}/>}/>

                    <Route path="/viewBrothers" element={<ViewBrothers accountInfo= {accountInfo} accountType = {"brother"}/>}/>

                    <Route path= "*" element={<ViewRushees accountInfo= {accountInfo} accountType = {"brother"}/>}/>
                </Routes>
            </Router>
           
        )
    }

}

export default MyRouter 
