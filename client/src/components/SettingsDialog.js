import React, { useState, useReducer, useEffect } from "react"
import "./SettingsDialog.css"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Grid,
  InputBase,
  TextField,
  NativeSelect,
  FormHelperText,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import styled from "styled-components"
import { languages, url, userId } from "../utils/MockData"
import axios from "axios"
import DropZone from "./DropZone"

// const initFunc = (initialValues) => {
//   return initialValues
// }

const initialFormState = {
  password: {
    value: "",
    isValid: true,
  },
  confirmPassword: {
    value: "",
    isValid: true,
  },
  language: "",
  image: {
    value: "",
    isValid: false,
    error: false,
  },
}

const formReducer = (state, action) => {
  switch (action.type) {
    case "password":
      return {
        ...state,
        password: {
          value: action.payload,
          isValid: action.payload.length >= 6,
        },
      }
    case "confirmPassword":
      return {
        ...state,
        confirmPassword: {
          value: action.payload,
          isValid: action.payload.length >= 6,
        },
      }
    case "language":
      return {
        ...state,
        language: action.payload,
      }
    case "image":
      if (
        action.payload.name.split(".").pop() === "jpg" ||
        action.payload.name.split(".").pop() === "png" ||
        action.payload.name.split(".").pop() === "jpeg"
      ) {
        return {
          ...state,
          image: {
            value: action.payload,
            isValid: true,
            error: false,
          },
        }
      } else {
        return {
          ...state,
          image: {
            value: action.payload,
            isValid: false,
            error: true,
          },
        }
      }

    case "new":
      return action.payload
      // return initFunc(action.payload)
    default:
      return state
  }
}

const SettingsHeading = styled(DialogContentText)`
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 30px;
`

// const ImageErrorMsg = styled(FormHelperText)`
//     color: #cc0000;
// `

const SettingsDialog = ({
  name,
  password,
  image,
  language,
  letOpen,
  currentUser,
  setCurrentUser,
}) => {
  const [open, setOpen] = useState(letOpen)
  const [showPasswordSettings, setShowPasswordSettings] = useState(false)
  const [formState, formDispatch] = useReducer(formReducer, initialFormState)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    formDispatch({
      type: "new",
      payload: {
        password: {
          value: password,
          isValid: true,
        },
        confirmPassword: {
          value: password,
          isValid: true,
        },
        language: language,
        image: {
          value: image,
          isValid: false,
          error: false,
        },
      },
    })
  }, [password, name, language, image])

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    if (showPasswordSettings === false) {
      // revert password state back to the original password
      formDispatch({
        type: "password",
        payload: password,
      })
      formDispatch({
        type: "confirmPassword",
        payload: password,
      })
    }

    if (formState.password.value !== formState.confirmPassword.value) {
      setErrorMsg("Your passwords do not match")
      return
    } else if (
      formState.password.isValid === false ||
      formState.confirmPassword.isValid === false
    ) {
      setErrorMsg("Your password must be at least 6 characters long")
      return
    } else {
      setErrorMsg("")
    }

    if (
      formState.password.isValid === true &&
      formState.password.value === formState.confirmPassword.value
    ) {
      let body = {}
      if (formState.password.value !== password) {
        body["password"] = formState.password.value
      } else {
        body["password"] = password
      }
      if (formState.language !== language) {
        body["language"] = formState.language
      } else {
        body["language"] = language
      }
      if (Object.keys(body).length !== 0) {
        axios
          .post(`http://${url}/user/${userId}/updateprofile`, body, {
            headers: {
              "Content-Type": `application/json`,
            },
          })
          .then(res => setCurrentUser(res.data))
          .catch(err => console.error(err))
      }
    }

    if (formState.image.isValid === true && formState.image.error === false) {
      const data = new FormData()
      data.append("name", "profileImage")
      data.append("file", formState.image.value)
      axios
        .post(`http://${url}/user/${userId}/updateprofileimg`, data, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        })
        .then(res => setCurrentUser({ ...currentUser, image: res.data.path }))
        .then(err => console.error(err))
    }

    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <DialogContent>
        <SettingsHeading>Change your password</SettingsHeading>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowPasswordSettings(!showPasswordSettings)}
        >
          {showPasswordSettings === false ? `Change password` : `Cancel`}
        </Button>
        {showPasswordSettings === true && (
          <React.Fragment>
            <Grid>
              <TextField
                label="New password"
                fullWidth
                type="password"
                required
                onChange={e =>
                  formDispatch({
                    type: "password",
                    payload: e.target.value,
                  })
                }
                value={formState.password.value}
                error={errorMsg.length !== 0}
              />
              <TextField
                label="Confirm new password"
                fullWidth
                type="password"
                required
                onChange={e =>
                  formDispatch({
                    type: "confirmPassword",
                    payload: e.target.value,
                  })
                }
                value={formState.confirmPassword.value}
                helperText={errorMsg}
                error={errorMsg.length !== 0}
              />
            </Grid>
          </React.Fragment>
        )}
        <SettingsHeading>Edit your profile picture</SettingsHeading>
        <Grid className="imageContainer">
          <img src={image} className="userPic" alt="userPic" />
          {/* <InputBase
                        name="profileImage"
                        accept=" .jpg, .png, .jpeg"
                        className="imageSelect"
                        type="file"
                        onChange={(e) => formDispatch({
                            type: "image",
                            payload: e.target.files[0], 
                        })}
                        error={formState.image.error}
                    /> */}
          {/* <ImageErrorMsg>
                        {formState.image.error === true && "Please upload a .png, .jpg, or .jpeg file"}
                    </ImageErrorMsg> */}
          <DropZone formDispatch={formDispatch} />
        </Grid>

        <SettingsHeading>Change your language.</SettingsHeading>
        <NativeSelect
          value={formState.language}
          onChange={e =>
            formDispatch({
              type: "language",
              payload: e.target.value,
            })
          }
        >
          {languages.sort().map(language => (
            <option value={language} key={language}>
              {language}
            </option>
          ))}
        </NativeSelect>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
