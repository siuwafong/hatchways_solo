import React, { useState, useReducer } from "react"
import "./Login.css"
import { withStyles } from "@material-ui/core/styles"
import { TextField, Grid, Button, FormHelperText } from "@material-ui/core"
import Background from "../components/Background"
import { Link } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { url } from '../utils/MockData'


const SwitchButton = withStyles({
  root: {
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 2px 3px #D8D8D8",
    color: "#3A8DFF",
    textTransform: "capitalize",
    fontSize: "1rem",
  },
})(Button)

const LoginButton = withStyles({
  root: {
    border: 0,
    borderRadius: 3,
    backgroundColor: "#3A8DFF",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
})(Button)

const StyledFormHelperText = styled(FormHelperText)`
  margin-top: 10px;
  color: #cc0000;
`

const formReducer = (state, action) => {
  switch (action.type) {
    case "email":
      return {
        ...state,
        email: {
          value: action.payload,
        },
      }
    case "password":
      return {
        ...state,
        password: {
          value: action.payload,
        },
      }
    case "login":
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
  },
}

const Login = ({...props}) => {
  
  const [formState, formDispatch] = useReducer(formReducer, initialFormState)
  const [loginError, setLoginError] = useState("")


  const handleSubmit = (e) => {
    const body = {
      email: formState.email.value,
      password: formState.password.value
    }
    axios.post(`http://${url}/login`, body, {
      headers: {
        "Content-Type": `application/json`,
      }
    })
    .then(res => res.data.errorMsg
      ?
    setLoginError(res.data.errorMsg)
      :
    props.history.push("/chat", res.data )
    )
  }

  return (
    <Grid className="loginContainer">
      <Grid className="switchSection">
        <p className="switchMsg">Don't have an account?</p>
        <SwitchButton className="switchBtn" component={Link} to="/signup">
          Signup
        </SwitchButton>
      </Grid>

      <form className="loginForm">
        <h1>Welcome back!</h1>
        <Grid className="loginInput">
          <TextField
            label="E-mail address"
            placeholder="Input your email address registered with us here"
            fullWidth
            type="email"
            onChange={e =>
              formDispatch({
                type: "email",
                payload: e.target.value,
              })
            }
            required
          />
        </Grid>
        <Grid className="loginInput">
          <TextField
            label="Password"
            fullWidth
            type="password"
            onChange={e =>
              formDispatch({
                type: "password",
                payload: e.target.value,
              })
            }
            placeholder="Input your password here"
            required
          />
        </Grid>
        <p className="loginForgotMsg">Forgot?</p>
        <StyledFormHelperText>
          {loginError}
        </StyledFormHelperText>
        <LoginButton
          onClick={(e) => handleSubmit(e)}
          className="loginBtn"
          style={{ fontSize: "1.1rem" }}
        >
          Login
        </LoginButton>
      </form>

      <Background />
    </Grid>
  )
}

export default Login
