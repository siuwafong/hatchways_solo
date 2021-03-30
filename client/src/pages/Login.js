import React, { useReducer, useState } from "react"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Background from '../components/Background'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import './Login.css'



const SwitchButton = styled(Button)`
    width: 180px;
    border: 0;
    border-radius: 3px;
    box-shadow: 0 3px 2px 3px #D8D8D8;
    color: #3A8DFF;
    text-transform: capitalize;
    font-size: 1rem;
`;

// const LoginButton = styled(Button)`
//     border: 0px;
//     border-radius: 3px;
//     background-color: #3A8DFF;
//     text-transform: capitalize;
//     color: #FFFFFF;
// `;

const formReducer = (state, action) => {
    switch(action.type) {
        case 'email':
            return {
                ...state,
                email: {
                    value: action.payload, 
                }

            }
        case 'password':
            return {
                ...state,
                password: {
                    value: action.payload,
                }
            }
        case 'login':
            return 
        default:
            return state
    }
}

const initialFormState = {
        email: {
            value: "",
        },
        password: {
            value: "",
        }
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const Login = () => {

    const [formState, formDispatch] = useReducer(formReducer, initialFormState)


    const submitHandler = (e) => {
        e.preventDefault()
        formDispatch({
            type: 'login',
            payload: {
                email: formState.email,
                password: formState.password
            }
        })
    }

    return (
        <div className="loginContainer">

            <div className="switchSection">
                <p className="switchMsg">
                    Don't have an account?
                </p>
                <SwitchButton
                    className="switchBtn"
                    component={Link}
                    to="/signup"
                >   
                    Signup
                </SwitchButton>
            </div>

            <form 
                className="loginForm"
                onSubmit={submitHandler}
            >
                <h1>
                    Welcome back!
                </h1>
                <div className="loginInput">
                    <TextField 
                        label="E-mail address" 
                        placeholder="Input your email address registered with us here" 
                        fullWidth
                        type="email"
                        onChange={e => formDispatch({
                            type: "email",
                            payload: e.target.value
                        })}
                        required
                    />
                </div>
                <div className="loginInput">
                    <TextField 
                        label="Password" 
                        fullWidth
                        type="password"
                        onChange={e => formDispatch({
                            type: "password",
                            payload: e.target.value
                        })}
                        placeholder="Input your password here"
                        required
                    />
                </div>
                <p className="loginForgotMsg">
                    Forgot?
                </p>
                <Button 
                    type="submit" 
                    className="loginBtn"
                    style={{fontSize: "1.1rem"}}
                >
                    Login
                </Button>
            </form>

            <Background />

        </div>
    )
}

export default Login