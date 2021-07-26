import React, { useState, useEffect } from 'react';
import './InvitationDialog.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  IconButton,
  Grid,
  List,
  Tabs,
  Tab,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import validateEmail from '../utils/HelperFunctions';
import { DebounceInput } from 'react-debounce-input';
import FoundContact from '../components/FoundContact';
import { url } from '../utils/MockData';

const InvitationDialog = ({
  setFilteredFriends,
  friends,
  setFriends,
  letOpen,
  currentUser,
}) => {
  const [open, setOpen] = useState(letOpen);
  const [friendEmail, setFriendEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [foundContacts, setFoundContacts] = useState([]);
  const [invites, setInvites] = useState({});
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    let allInvites = {
      sent: [],
      received: [],
    };
    // TODO - replace user id
    fetch(`http://${url}/invite/${currentUser._id}/invitations`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) =>
        data.map((invite) =>
          invite.recipient === currentUser._id
            ? allInvites.received.push({
                name: invite.sender.name,
                sendDate: invite.sendDate,
                id: invite.sender._id,
                image: invite.sender.image,
                status: invite.status,
              })
            : allInvites.sent.push({
                name: invite.recipient.name,
                sendDate: invite.sendDate,
                id: invite._id,
                image: invite.recipient.image,
              })
        )
      )
      .then(() => setInvites(allInvites))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const formInput = e.target.value;
    setFriendEmail(formInput);
    if (formInput === '') {
      setValidEmail(true);
    } else {
      setValidEmail(validateEmail(formInput));
    }

    fetch(`http://${url}/user/${currentUser._id}/searchemail`, {
      method: 'POST',
      body: JSON.stringify({
        email: formInput,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setFoundContacts(data));

    if (formInput === '' || formInput === '.') setFoundContacts([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  return (
    <Dialog
      fullWidth={true}
      onClose={handleClose}
      open={open}
      className="friendInvite"
    >
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
      >
        <Tab label="Find" />
        <Tab label="Received" />
      </Tabs>
      {tabValue === 0 ? (
        <>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <DialogTitle>Find a Friend</DialogTitle>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <DialogContent>
            <DialogContentText>
              Find a friend by entering their email.
            </DialogContentText>
            <DebounceInput
              onChange={(e) => handleChange(e)}
              debounceTimeout={800}
              element={TextField}
              label="Email Address"
              fullWidth
              autoFocus
              margin="dense"
              value={friendEmail}
              helperText={
                validEmail === false ? 'Please enter a valid email address' : ''
              }
              error={validEmail === false}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
          <DialogContent>
            <List>
              {foundContacts.map((contact) => (
                <FoundContact
                  name={contact.name}
                  image={contact.image}
                  id={contact._id}
                  key={contact._id}
                  setInvites={setInvites}
                  invites={invites}
                  foundContacts={foundContacts}
                  type="search"
                />
              ))}
            </List>
          </DialogContent>
        </>
      ) : (
        <>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <DialogTitle>Received Invites</DialogTitle>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          {invites.received.filter((contact) => contact.status !== 'declined')
            .length !== 0 ? (
            <DialogContent>
              {invites.received
                .filter((contact) => contact.status === 'pending')
                .map((contact) => (
                  <FoundContact
                    name={contact.name}
                    image={contact.image}
                    id={contact.id}
                    key={contact.id}
                    setInvites={setInvites}
                    foundContacts={foundContacts}
                    invites={invites}
                    type="received"
                    setFriends={setFriends}
                    friends={friends}
                    setFilteredFriends={setFilteredFriends}
                  />
                ))}
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogContentText>You have no invites</DialogContentText>
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default InvitationDialog;
