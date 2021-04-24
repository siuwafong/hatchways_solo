import React, { useState } from "react"
import "./InvitationDialog.css"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button, Grid } from '@material-ui/core'
import validateEmail from '../utils/HelperFunctions'

const InvitationDialog = ({content}) => {

    const [open, setOpen] = useState(true)
    const [friendEmail, setFriendEmail] = useState("")
    const [invalidEmail, setInvalidEmail] = useState(false)

    const handleChange = e => {
        setFriendEmail(e.target.value)
    }

    const handleClose = (value) => {
        if (validateEmail(value) === true) {
            setInvalidEmail(false)
            setOpen(false)
            setFriendEmail(value)
        } else {
            setInvalidEmail(true)
        }
    }

        return (
            <Dialog onClose={handleClose} open={open} selectedValue={friendEmail} className="friendInvite">
                <DialogTitle>
                    Invite a friend
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your friend's email and we will send them an invite to join.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        onChange={(e) => handleChange(e)}
                        fullWidth
                        error={validateEmail(friendEmail)}          
                        helperText={invalidEmail === true ? `Please enter a valid email address` : ""}  
                        />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleClose("")}
                    >   
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleClose(friendEmail)}
                    >
                        Invite
                    </Button>
                </DialogActions>
            </Dialog>
        )
 
}

export default InvitationDialog

