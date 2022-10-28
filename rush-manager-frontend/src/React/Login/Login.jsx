import React from 'react'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


function Login({ setToken, setAccountType, setAccountInfo }, {}) {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [loginRes, setLoginRes] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(password)
        let result = ""
        //check to verify login

        doc = {password: password, username: username}
        
        await fetch("http://localhost:8000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        })
        .then(response => response.json())
        .then(data => {
            result = data
            setAccountInfo(data)
            
        })
        console.log(result)
        if(result.result) {
            setToken("valid")
            setAccountType(result.accountType)
            console.log(result.username)
        }

        // if (username == "b") {
        //     setToken("valid")
        //     setAccountType("Brother")
        // }
        // else if (username == "r") {
        //     setToken("valid")
        //     setAccountType("Rushee")
        // }
        // else if (username == "a") {
        //     setToken("valid")
        //     setAccountType("Admin")
        // }
        // else if (username == "reqB") {
        //     setToken("valid")
        //     setAccountType("ReqB")
        // }
        // else if (username == "ReqR") {
        //     setToken("valid")
        //     setAccountType("ReqR")
        // }



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
    
    var doc = {'first': "",
            'accountType': "",
          'last': "",
          'username': "",
          'password': "",
          'email': "",
          'major': "",
          'phone': "",
          'housing': ""};


    const handleSubmitCreateUser = () => {
            console.log("NEW USER")
            
            console.log(doc)
            fetch("http://localhost:8000/createUser", {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(doc)
              })
              .then(respnse =>{
                      console.log(respnse)
                     
                      //close the modal
                      setModal(false)
                    //handleClose()
                  }
              )
      
      
          }
    
    const CreateAccount_Modal = () => {
        return (
            <Modal show={modal} onHide={handleClose}>
                <Modal.Header closeButton/>
                <Modal.Title className='Modal-Title'>Create Account</Modal.Title>
                <Modal.Body>
                    <div>
                        <div className='Modal-Input'>
                            <label for="Username"><b>Username</b></label>
                            <input type="text" placeholder="Username" name="Username" onChange={e => doc.username = e.target.value} />

                            <label for="Password"><b>Password</b></label>
                            <input type="password" placeholder="Password" name="Password"required onChange={e => doc.password = e.target.value}/>
                            <label for="AccountType"><b>Account Type</b></label>
                            <input type="text" placeholder="Account Type" name="AccountType" onChange={e => doc.accountType = e.target.value} />
                            <label for="First"><b>First Name</b></label>
                            <input type="text" placeholder="First" name="first" onChange={e => doc.first = e.target.value} />
                            <label for="Last"><b>Last Name</b></label>
                            <input type="text" placeholder="Last" name="Last" onChange={e => doc.last = e.target.value} />
                            <label for="Email"><b>Email</b></label>
                            <input type="text" placeholder="Email" name="Email" onChange={e => doc.email = e.target.value} />
                            <label for="Phone"><b>Phone Number</b></label>
                            <input type="text" placeholder="Phone" name="Phone" onChange={e => doc.phone = e.target.value} />
                            <label for="Major"><b>Major</b></label>
                            <input type="text" placeholder="Major" name="Major" onChange={e => doc.major = e.target.value} />
                            <label for="housing"><b>Housing Location</b></label>
                            <input type="text" placeholder="Housing Location" name="housing" onChange={e => doc.housing = e.target.value} />
                            

                        </div>
                    </div>
                    <div className="Modal-Buttons">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitCreateUser}>Create Account</Button>
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
