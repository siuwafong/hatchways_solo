import React, { useState } from "react"
import "./InvitationDialog.css"
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
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
                        Enter your friend's email and we will send him an invite to join.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        onChange={(e) => handleChange(e)}
                        fullWidth
                        error={validateEmail(friendEmail)}                    />
                </DialogContent>
                <DialogContentText>
                    <div className="invalidEmailMsg">
                    {invalidEmail === true ? `Please enter a valid email address` : ""}
                    </div>
                </DialogContentText>
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

