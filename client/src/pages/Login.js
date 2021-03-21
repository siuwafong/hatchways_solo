import React, { useReducer, useState } from "react"
import './Login.css'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Background from '../components/Background'
import { Link } from 'react-router-dom'
import { CardActionArea } from "@material-ui/core";

const SwitchButton = withStyles({
    root: {
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 2px 3px #D8D8D8',
        color: "#3A8DFF",
        textTransform: "capitalize",
        fontSize: "1rem"
    }
})(Button);

const LoginButton = withStyles({
    root: {
        border: 0,
        borderRadius: 3,
        backgroundColor: "#3A8DFF",
        textTransform: 'capitalize',
        color: "#FFFFFF", 
    }
})(Button);

const formReducer = (state, action) => {
    switch(action.type) {
        case 'email':
            console.log(action.payload)
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
                <p className="SwitchMsg">
                    Don't have an account?
                </p>
                <SwitchButton 
                    className="switchBtn" 
                    color="secondary"
                >
                    <Link 
                        to="/signup"
                        className="link"
                    >
                        Create account
                    </Link>
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
                <LoginButton 
                    type="submit" 
                    className="loginBtn"
                    style={{fontSize: "1.1rem"}}
                >
                    Login
                </LoginButton>
            </form>

            <Background />

        </div>
    )
}

export default Login