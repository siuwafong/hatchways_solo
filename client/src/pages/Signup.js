import React, { useReducer } from "react"
import './Signup.css'
import { withStyles } from '@material-ui/core/styles'
import { Grid, TextField, Button } from '@material-ui/core';
import Background from '../components/Background'
import { Link } from 'react-router-dom'

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

const CreateButton = withStyles({
    root: {
        border: 0,
        borderRadius: 3,
        backgroundColor: "#3A8DFF",
        textTransform: 'capitalize',
        color: "#FFFFFF",
        size: "small"
    }
})(Button);

const formReducer = (state, action) => {
    switch(action.type) {
        case "username":    
            return {
                ...state,
                username: {
                    value: action.payload,
                    isValid: action.payload.length >=4
                }
            }
        case 'email':
            return {
                ...state,
                email: {
                    value: action.payload, 
                    isValid: validateEmail(action.payload)
                }

            }
        case 'password':
            return {
                ...state,
                password: {
                    value: action.payload,
                    isValid: action.payload.length >= 6
                }
            }
        case 'signup':
            return (action.payload.username.isValid && action.payload.email.isValid && action.payload.password.isValid)
        default:
            return state
    }
}

const initialFormState = {
    username: {
        value: "",
        isValid: true,
    },
    email: {
        value: "",
        isValid: true
    },
    password: {
        value: "",
        isValid: true
    }
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const Signup = () => {

    const [formState, formDispatch] = useReducer(formReducer, initialFormState)

    return (
        <Grid className="signinContainer">

            <Grid className="switchSection"> 

                <p className="SwitchMsg">
                    Already have an account?
                </p>
                <SwitchButton 
                    className="switchBtn" 
                    color="secondary"
                >
                    <Link 
                        to="/login"
                        className="link"
                    >
                        Login
                    </Link>
                </SwitchButton>
            </Grid>

            <form className="signupForm">
                <h1>
                    Create an account.
                </h1>
                <Grid className="signupInput">
                    <TextField 
                        label="Username" 
                        fullWidth
                        required
                        onChange={e => formDispatch({
                            type: "username",
                            payload: e.target.value
                        })}
                        placeholder="Select a username that is at least 4 characters long"
                        error={!formState.username.isValid}
                    />
                </Grid>
                <Grid className="signupInput">
                    <TextField 
                        label="E-mail address" 
                        placeholder="e.g., john@gmail.com" 
                        fullWidth
                        type="email"
                        onChange={e => formDispatch({
                            type: "email",
                            payload: e.target.value
                        })}
                        error={!formState.email.isValid}
                        required
                    />
                </Grid>
                <Grid className="signupInput">
                    <TextField 
                        label="Password" 
                        type="password"
                        placeholder="Password must be at least 6 characters long"
                        fullWidth
                        onChange={e => formDispatch({
                            type: "password",
                            payload: e.target.value
                        })}
                        error={!formState.password.isValid}
                        required
                    />
                </Grid>

                <CreateButton   
                    className="createBtn"
                    type="submit"
                    style={{fontSize: "1.1rem"}}
                >
                    Create
                </CreateButton>
            </form>
            <Background />

        </Grid>
    )
}

export default Signup