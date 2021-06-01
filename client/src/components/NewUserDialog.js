import React, { useEffect, useState } from "react"
import "./NewUserDialog.css"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Grid,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { url } from '../utils/MockData'


const NewUserDialog = ({ referral, currentUser, setShowSteps, letOpen, token }) => {
  
  const [open, setOpen] = useState(letOpen)
  const [referralInvite, setRefferalInvite] = useState("")

  useEffect(() => {
    if (referral) {
      fetch(`http://${url}/user/${referral}`)
      .then(res => res.json())
      .then(data => setRefferalInvite([data]))
      .catch(err => console.log(err))

      fetch(`http://${url}/invite/${currentUser._id}/send`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({
          contactId: referralInvite[0]
        }),
        credentials: "same-origin",
      }).catch(err => console.error(err))
    }
  }, [currentUser, referral])


  const handleClose = () => {
    setOpen(false)
  }

  const handleNext = () => {
    setShowSteps(true)
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <DialogTitle>Hi!</DialogTitle>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <DialogContent>
        <DialogContentText>
          Welcome to the language exchange app. Here you will be able to make friends from around the world and communicate with them in any language.
        </DialogContentText>
        {referralInvite !== "" &&
          <>
          <DialogContentText>
            We've sent an invite to {referralInvite[0].name}, who invited you. Once they've accepted your invite then you can start your chat with them!
          </DialogContentText>
          <Grid className="referralImgContainer">
            <img src={referralInvite[0].image} className="refferalImg" alt="referralImg"/>
          </Grid>
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleNext}>Next</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewUserDialog
