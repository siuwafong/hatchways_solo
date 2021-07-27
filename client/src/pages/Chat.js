import React, { useEffect, useState } from 'react';
import User from '../components/User';
import {
  TextField,
  InputAdornment,
  Grid,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { url, userId } from '../utils/MockData';
import ChatMsg from '../components/ChatMsg';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import './Chat.css';
import InvitationDialog from '../components/InvitationDialog';
import SetttingsDialog from '../components/SettingsDialog';
import EmailDialog from '../components/EmailDialog';
import NewUserDialog from '../components/NewUserDialog';
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Chat = (props) => {
  const [currentUser, setCurrentUser] = useState('');
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const newUserId = props.location.state ? props.location.state._id : '';
  const referral = props.location.state ? props.location.state.referral : '';
  const newUser = props.location.state ? props.location.state.newUser : '';

  useEffect(() => {
    fetch(`http://${url}/user/${newUserId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .then(() => {
        referral !== undefined && setOpenDialog('NewUserDialog');
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let friends = [];

    fetch(`http://${url}/message/${newUserId}/conversations/all`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => data.map((item) => friends.push(item)))
      .then(() => setFriends(friends))
      .then(() => setFilteredFriends(friends));
  }, []);

  if (!props.location.state) return <Redirect to="/login" />;

  const handleClick = (e) => {
    anchorEl === null ? setAnchorEl(e.target) : setAnchorEl(null);
  };

  const getChatMsgs = (conversationId) => {
    let idx;
    let tempSelectedChat;

    fetch(
      `http://${url}/message/${currentUser._id}/conversation/${conversationId}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .then(
        () =>
          (tempSelectedChat = friends.filter(
            (friend) => friend._id === conversationId
          )[0])
      )
      .then(() => getIdx())
      .then(
        (idx) =>
          (tempSelectedChat.unreadMsgs = tempSelectedChat.unreadMsgs.map(
            (item, i) => (i === idx ? item : 0)
          ))
      )
      .then(() => setSelectedChat(tempSelectedChat));

    const getIdx = () => {
      if (tempSelectedChat.participants[0]._id === currentUser._id) {
        idx = 0;
        return idx;
      } else {
        idx = 1;
        return idx;
      }
    };
  };

  const toggleSearch = (e) => {
    setMessages(null);
    setSelectedChat(null);
    const searchedFriends = friends.filter((friend) =>
      friend.participants[0]._id !== currentUser._id
        ? friend.participants[0].name.includes(e.target.value)
        : friend.participants[1].name.includes(e.target.value)
    );
    setFilteredFriends(searchedFriends);
  };

  const toggleMsgInput = (e) => {
    setNewMsg(e.target.value);
  };

  const toggleMsgSubmit = (e) => {
    e.preventDefault();
    setMessages([
      ...messages,
      {
        type: 'msg',
        content: newMsg,
        sender: currentUser.name,
        recipient: selectedChat.name,
        read: false,
        id: uuidv4(),
      },
    ]);
    setNewMsg('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    fetch(`http://${url}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.logout === true) {
          props.history.push('/login');
        }
      });
  };

  const steps = [
    {
      element: '.settingsIcon1',
      intro:
        'Click here to edit your profile. You can change your password, add a photo, and also set your language. Your current language is set to English. You can also add friends and invite people to join this app.',
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighLightClass',
    },
    {
      element: '.settingsIcon2',
      intro:
        "You'll see a list of friends here. You can search from your existing friends in the search bar above.",
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighLightClass',
    },
    {
      element: '.settingsIcon3',
      intro:
        "You can type your messages here. The app will automatically translate your messages to your friend's language, and your friend's messages to you will be translated to your language, so you can all understand each other just fine :)",
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighLightClass',
    },
  ];

  return (
    <Grid className="chatContainer">
      {openDialog === 'invite' && (
        <EmailDialog
          letOpen={true}
          currentUser={currentUser}
          setOpenDialog={setOpenDialog}
        />
      )}
      {openDialog === 'settings' && (
        <SetttingsDialog
          letOpen={false}
          name={currentUser.name}
          password={currentUser.password}
          image={currentUser.image}
          language={currentUser.language}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          setOpenDialog={setOpenDialog}
        />
      )}
      {openDialog === 'settings' && (
        <SetttingsDialog
          letOpen={true}
          name={currentUser.name}
          password={currentUser.password}
          image={currentUser.image}
          language={currentUser.language}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          setOpenDialog={setOpenDialog}
        />
      )}
      {openDialog === 'addFriends' && (
        <InvitationDialog
          currentUser={currentUser}
          friends={friends}
          setFriends={setFriends}
          setFilteredFriends={setFilteredFriends}
          letOpen={true}
          setOpenDialog={setOpenDialog}
        />
      )}
      {newUser === true && (
        <NewUserDialog
          currentUser={currentUser}
          setShowSteps={setShowSteps}
          letOpen={newUser === true}
          friends={friends}
          setFriends={setFriends}
          setFilteredFriends={setFilteredFriends}
          referral={referral}
        />
      )}
      {showSteps === true && (
        <Steps
          enabled={true}
          steps={steps}
          initialStep={0}
          onExit={() => setShowSteps(false)}
        />
      )}

      <Grid className="chatListContainer">
        <Grid className="currentUserContainer">
          <Grid className="currentUserPicStatus">
            <img className="userPic" src={currentUser.image} alt="userPic" />
            <Grid
              className={`statusDot ${
                currentUser.status === 'Online'
                  ? 'statusAvailable'
                  : 'statusAway'
              } `}
            ></Grid>
          </Grid>
          <Grid className="userNameMsg">
            <p className="username"> {currentUser.name} </p>
          </Grid>
          <IconButton onClick={(e) => handleClick(e)} className="settingsIcon1">
            <MoreHorizIcon />
            <Menu
              id="simple-menu"
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorEl={anchorEl}
              keepMounted
            >
              <MenuItem onClick={() => setOpenDialog('settings')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => setOpenDialog('addFriends')}>
                Add friends
              </MenuItem>
              <MenuItem onClick={() => setOpenDialog('invite')}>
                Invite someone
              </MenuItem>
              <MenuItem onClick={() => logout()}>Logout</MenuItem>
            </Menu>
          </IconButton>
        </Grid>
        <Typography variant="h3">Chats</Typography>
        <TextField
          className="chatSearchBar"
          placeholder="Search"
          variant="outlined"
          onChange={(e) => toggleSearch(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Grid className="usersContainer settingsIcon2">
          {filteredFriends.length !== 0 ? (
            filteredFriends.map((user) => {
              const idx = user.participants[0]._id === currentUser._id ? 1 : 0;
              return (
                <Grid
                  onClick={() => getChatMsgs(user._id)}
                  className={
                    selectedChat !== null
                      ? JSON.stringify(user) === JSON.stringify(selectedChat)
                        ? `selectedChat`
                        : ''
                      : ''
                  }
                  key={user._id}
                >
                  <User
                    name={user.participants[idx].name}
                    profileImg={user.participants[idx].image}
                    recentMsg={
                      user.mostRecentMsg !== undefined ? user.mostRecentMsg : ''
                    }
                    unreadMsgs={user.unreadMsgs[idx]}
                    status={user.participants[idx].status}
                    id={user.participants[idx]._id}
                  />
                </Grid>
              );
            })
          ) : (
            <Grid>You have no friends yet.</Grid>
          )}
        </Grid>
      </Grid>
      <Grid className="currentChatContainer settingsIcon3">
        <Grid className="currentChatTitle">
          <span className="currentChatName">
            {selectedChat !== null
              ? selectedChat.participants[0]._id === currentUser._id
                ? selectedChat.participants[1].name
                : selectedChat.participants[0].name
              : ''}
          </span>
          <Grid
            className={`statusDotCurrent ${
              selectedChat !== null
                ? selectedChat.status === 'Online'
                  ? 'statusAvailableCurrent'
                  : 'statusAwayCurrent'
                : 'hideCurrent'
            }`}
          ></Grid>
          <span className="currentChatStatus">
            {selectedChat !== null ? selectedChat.status : ''}{' '}
          </span>
          <Grid className="moreHoriz">
            {selectedChat !== null && <MoreHorizIcon />}
          </Grid>
        </Grid>

        <Grid className="chatMsgs">
          {messages !== null &&
            messages.map((message) => (
              <ChatMsg
                type={message.type}
                username={message.sender.name}
                direction={
                  message.sender.name === currentUser.name ? 'sent' : 'received'
                }
                content={message.content}
                sendDate={dayjs(message.createdAt).format('hh:mma')}
                userImg={
                  selectedChat.participants[0]._id === currentUser._id
                    ? selectedChat.participants[1].image
                    : selectedChat.participants[0].image
                }
                key={message._id}
              />
            ))}
        </Grid>

        <form className="chatMsg" onSubmit={(e) => toggleMsgSubmit(e)}>
          {selectedChat !== null && (
            <TextField
              className="chatMsgInput"
              placeholder="Type something..."
              value={newMsg}
              variant="outlined"
              onChange={(e) => toggleMsgInput(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <InsertEmoticonIcon />
                    <FileCopyIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </form>
      </Grid>
    </Grid>
  );
};

export default Chat;
