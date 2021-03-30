import React, { useReducer } from "react"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Background from '../components/Background'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import './Signup.css'



const SwitchButton = styled(Button)`
    width: 180px;
    border: 0;
    border-radius: 3px;
    box-shadow: 0 3px 2px 3px #D8D8D8;
    color: #3A8DFF;
    text-transform: capitalize;
    font-size: 1rem;
`;

const StyledButton = styled(Button)`
  background-color: #6772e5;
  color: #fff;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 7px 14px;
  &:hover {
    background-color: #5469d4;
  }
`;

// const CreateButton = styled(Button)`
//     border: 0px;
//     border-radius: 3px;
//     background-color: #3A8DFF;
//     text-transform: capitalize;
//     color: #FFFFFF;
//     size: small;
// `;



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
        <div className="signinContainer">
            <div className="switchSection"> 
                <p className="SwitchMsg">
                    Already have an account?
                </p>
                <SwitchButton
                    className="switchBtn"
                    component={Link}
                    to="/login"
                >   
                    Login
                </SwitchButton>
            </div>

            <form className="signupForm">
                <h1>
                    Create an account.
                </h1>
                <div className="signupInput">
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
                </div>
                <div className="signupInput">
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
                </div>
                <div className="signupInput">
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
                        placeholder="Password must be at least 6 characters long"
                        required
                    />
                </div>

                <StyledButton   
                    className="createBtn"
                    type="submit"
                    style={{fontSize: "1.1rem"}}
                >
                    Create
                </StyledButton>
            </form>
            <Background />

        </div>
    )
}

export default Signup