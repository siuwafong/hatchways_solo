import React, { useReducer} from "react"
import './Login.css'
import { withStyles } from '@material-ui/core/styles'
import { TextField, Grid, Button } from '@material-ui/core'
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
        <Grid className="loginContainer">

            <Grid className="switchSection">
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
            </Grid>

            <form 
                className="loginForm"
                onSubmit={submitHandler}
            >
                <h1>
                    Welcome back!
                </h1>
                <Grid className="loginInput">
                    <TextField 
                        label="E-mail address" 
                        placeholder="Input your email address registered with us here" 
                        fullWidth
                        type="email"
                        onChange={e => formDispatch({
                            type: "email",
                            payload: e.target.value
                        })}
                        value={formState.email.value}
                        required
                    />
                </Grid>
                <Grid className="loginInput">
                    <TextField 
                        label="Password" 
                        fullWidth
                        type="password"
                        onChange={e => formDispatch({
                            type: "password",
                            payload: e.target.value
                        })}
                        placeholder="Input your password here"
                        value={formState.password.value}
                        required
                    />
                </Grid>
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

        </Grid>
    )
}

export default Login