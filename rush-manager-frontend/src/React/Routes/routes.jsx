import React from "react";
import { useState } from 'react';
import {default as Login} from "../Login/Login"
import {default as ViewRushees} from "../Brother/viewRushees"
import {default as RushEvents} from "../Rushee/rushEvents"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function MyRouter(){

    const [token, setToken] = useState()
    const [accountType, setAccountType ] = useState()

    console.log(accountType)

    if (token==='valid'){
        return(
            <LoggedInRouter accountType={accountType}/>
        )
    }
    else{
        return (<Login setToken={setToken} setAccountType={setAccountType}/>)
    }

}


function LoggedInRouter(props){
    if (props.accountType == "Brother"){
        
        return (
            <Router>
                 <Routes>
                    <Route path= "*" element={<ViewRushees/>}/>
                </Routes>
            </Router>
           
        )
    }
    else if(props.accountType == "Rushee"){
        return (
            <Router>
                <Routes>
                    <Route path= "*" element={<RushEvents/>}/>
                </Routes>
            </Router>
        )
    }

}

export default MyRouter 
