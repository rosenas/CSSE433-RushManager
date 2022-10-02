import React from 'react'
import {useState} from 'react'


function Login({setToken, setAccountType}){

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();

        //check to verify login

        if(username == "b"){
            setToken("valid")
            setAccountType("Brother")
        }
        else if(username == "r"){
            setToken("valid")
            setAccountType("Rushee")
        }

 

    }

    return (
        <>
        <h1>Login to Rush Manager</h1>
        <div>
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" onChange = {e => setUsername(e.target.value)} required/>

            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" onChange = {e => setPassword(e.target.value)} required/>
            <button onClick={handleSubmit}>Login</button>
        </div> 
        </>
    
    )
}
export default Login
