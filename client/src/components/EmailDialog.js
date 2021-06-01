import React, { useState } from "react"
import "./EmailDialog.css"
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, IconButton, Grid, Input, TextField, NativeSelect, FormHelperText }from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import validateEmail from "../utils/HelperFunctions"
import axios from "axios"
import { url, userId } from '../utils/MockData'

const EmailDialog = ({ currentUser, letOpen, token }) => {

    const [open, setOpen] = useState(letOpen)
    const [errorMsg, setErrorMsg] = useState(false)
    const [friendEmail, setFriendEmail] = useState("")

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = () => {
        if (validateEmail(friendEmail)) {
            setErrorMsg(false)
            axios.post(`http://${url}/invite/${userId}/email`, {email: friendEmail}, {
                headers: {
                    'Content-Type': `application/json`,
                    "x-auth-token": token
                }
            })
        } else {
            setErrorMsg(true)
        }
    }

    return (
        <Dialog open={open} >
            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <DialogTitle>
                    Invite a Friend to Join
                </DialogTitle>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Grid>
            <DialogContent>
                <DialogContentText>
                    Type your friend's email and we will send them an invite to join the app.
                </DialogContentText>
                <TextField
                    fullWidth={true}
                    helperText={errorMsg === true && "You need to send a valid email address"}
                    error={errorMsg}
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                    <Button onClick={handleClose}>   
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Submit
                    </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmailDialog