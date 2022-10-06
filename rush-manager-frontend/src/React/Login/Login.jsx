import React from 'react'
import {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


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

    const handleCreateAccount = () => {

    }

    return (
        <>
        <h1 className='title'>Login to Rush Manager</h1>
        <div className='Login'>
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" onChange = {e => setUsername(e.target.value)} required/>

            <label for="username"><b>Password</b></label>
            <input type="text" placeholder="Enter Password" name="username" onChange = {e => setPassword(e.target.value)} required/>
            <Button variant="light" onClick={handleSubmit}>Login</Button>
        </div> 
 

        <h3 className='title'>Need an Account?</h3>
        <div className='Sign-Up'>
            <Button variant="light" Onclick={handleCreateAccount}>Create Account</Button>
        </div>

        </>
    
    )
}
export default Login
