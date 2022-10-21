import React from 'react'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


function Login({ setToken, setAccountType }) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();

        //check to verify login

        
        fetch("http://localhost:8000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((data) => {
            
        })

        if (username == "b") {
            setToken("valid")
            setAccountType("Brother")
        }
        else if (username == "r") {
            setToken("valid")
            setAccountType("Rushee")
        }



    }

    const handleCreateAccount = () => {
        setModal(true)

    }

    const handleClose = () => {
        setModal(false)
    }

    const handleSubmitCreateAccount = () => {
        setModal(false)
        
        fetch("http://localhost:8000/createAccount", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((data) => {
            
        })
    }

    const [modal, setModal] = useState(false)

    const CreateAccount_Modal = () => {
        return (
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton/>
                <Modal.Title className='Modal-Title'>Create Account</Modal.Title>
                <Modal.Body>
                    <div>
                        <div className='Modal-Input'>
                            <label for="Username"><b>Username</b></label>
                            <input type="text" placeholder="Username" name="Username"/>

                            <label for="Password"><b>Password</b></label>
                            <input type="password" placeholder="Password" name="Password"/>
                            <label for="AccountType"><b>Account Type</b></label>
                            <input type="text" placeholder="Account Type" name="AccountType"/>
                            <label for="First"><b>First Name</b></label>
                            <input type="text" placeholder="First" name="first"/>
                            <label for="Last"><b>Last Name</b></label>
                            <input type="text" placeholder="Last" name="Last"/>
                            <label for="Email"><b>Email</b></label>
                            <input type="text" placeholder="Email" name="Email"/>
                            <label for="Phone"><b>Phone Number</b></label>
                            <input type="text" placeholder="Phone" name="Phone"/>
                            <label for="Major"><b>Major</b></label>
                            <input type="text" placeholder="Major" name="Major"/>
                            <label for="housing"><b>Housing Location</b></label>
                            <input type="text" placeholder="Housing Location" name="housing"/>
                            

                        </div>
                    </div>
                    <div className="Modal-Buttons">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitCreateAccount}>Create Account</Button>
                    </div>
                </Modal.Body>

            </Modal>
        )

    }

    return (
        <>
            <h1 className='title createAccount'>Login to Rush Manager</h1>
            <div className='Login'>
                <label for="username"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="username" onChange={e => setUsername(e.target.value)} required />

                <label for="username"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="username" onChange={e => setPassword(e.target.value)} required />
                <Button variant="light" onClick={handleSubmit}>Login</Button>
            </div>


            <h3 className='title createAccount'>Need an Account?</h3>
            <div className='Sign-Up'>
                <Button variant="light" onClick={handleCreateAccount}>Create Account</Button>
            </div>
            <CreateAccount_Modal />
        </>

    )
}
export default Login
