import React, { useReducer, useState } from "react"
import "./Signup.css"
import { Grid, TextField, Button, FormHelperText } from "@material-ui/core"
import Background from "../components/Background"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { url } from '../utils/MockData'
import "./Signup.css"
import axios from "axios"

const SwitchButton = styled(Button)`
  width: 180px;
  border: 0;
  border-radius: 3px;
  box-shadow: 0 3px 2px 3px #d8d8d8;
  color: #3a8dff;
  text-transform: capitalize;
  font-size: 1rem;
`

const StyledButton = styled(Button)`
  background-color: #3A8DFF;
  color: #fff;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 7px 14px;
  text-transform: capitalize;
  &:hover {
    background-color: #5469d4;
  }
`

const StyledFormHelperText = styled(FormHelperText)`
  margin-top: 10px;
  color: #cc0000;
`

const formReducer = (state, action) => {
  switch (action.type) {
    case "username":
      return {
        ...state,
        username: {
          value: action.payload,
          isValid: action.payload.length >= 4,
        },
      }
    case "email":
      return {
        ...state,
        email: {
          value: action.payload,
          isValid: validateEmail(action.payload),
        },
      }
    case "password":
      return {
        ...state,
        password: {
          value: action.payload,
          isValid: action.payload.length >= 6,
        },
      }
    default:
      return state
  }
}

const initialFormState = {
  username: {
    value: "",
    isValid: false,
  },
  email: {
    value: "",
    isValid: false,
  },
  password: {
    value: "",
    isValid: false,
  },
}

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const Signup = ({...props}) => {

  const [formState, formDispatch] = useReducer(formReducer, initialFormState)
  const [errorMsgs, setErrorMsgs] = useState({
    username: false,
    email: false,
    password: false
  })
  const [signupError, setSignupError] = useState("")

  const handleSubmit = (e) => {
    setErrorMsgs({
      username: !formState.username.isValid,
      email: !formState.email.isValid,
      password: !formState.password.isValid
    })
    const invalidFormSubmission = formState.username.isValid === false || formState.email.isValid === false || formState.password.isValid === false 
    if (!invalidFormSubmission) {
      const user = {
        name: formState.username.value,
        email: formState.email.value,
        password: formState.password.value, 
        referral: props.match.params.name
      }
      axios.post(`http://${url}/createaccount/`, user, {
          headers: {
            "Content-Type": `application/json`,
          },
      })
      .then(res => res.data.errorMsg 
        ? 
      setSignupError(res.data.errorMsg) 
        : 
      props.history.push("/chat", res.data.newUserData )
      )
    }
  }

  return (
    <Grid className="signinContainer">
      <Grid className="switchSection">
        <p className="switchMsg">Already have an account?</p>
        <SwitchButton className="switchBtn" component={Link} to="/login">
          Login
        </SwitchButton>
      </Grid>

      <form className="signupForm">
        <h1>Create an account.</h1>
        <Grid className="signupInput">
          <TextField
            label="Username"
            fullWidth
            required
            onChange={e =>
              formDispatch({
                type: "username",
                payload: e.target.value,
              })
            }
            placeholder="Select a username that is at least 4 characters long"
            value={formState.username.value}
            error={errorMsgs.username}
            helperText={errorMsgs.username && "Your username must be at least 4 characters long"}
          />
        </Grid>
        <Grid className="signupInput">
          <TextField
            label="E-mail address"
            placeholder="e.g., john@gmail.com"
            fullWidth
            type="email"
            onChange={e =>
              formDispatch({
                type: "email",
                payload: e.target.value,
              })
            }
            error={errorMsgs.email}
            helperText={errorMsgs.email && "You need to submit a valid email address"}
            value={formState.email.value}
            required
          />
        </Grid>
        <Grid className="signupInput">
          <TextField
            label="Password"
            type="password"
            placeholder="Password must be at least 6 characters long"
            fullWidth
            onChange={e =>
              formDispatch({
                type: "password",
                payload: e.target.value,
              })
            }
            error={errorMsgs.password}
            helperText={errorMsgs.password && "Your password must be at least six characters long"}
            value={formState.password.value}
            required
          />
        </Grid>
        <StyledFormHelperText>
          {signupError}
        </StyledFormHelperText>
        <StyledButton
          className="createBtn"
          style={{ fontSize: "1.1rem" }}
          onClick={(e) => handleSubmit(e)}
        >
          Create
        </StyledButton>
      </form>
      <Background />
    </Grid>
  )
}

export default Signup
