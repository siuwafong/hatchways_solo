import React, { useEffect, useState } from "react"
import User from '../components/User'
import { TextField, InputAdornment, Grid, Typography, IconButton, Button, Menu, MenuItem } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { url, userId } from '../utils/MockData'
import ChatMsg from '../components/ChatMsg'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid';
import './Chat.css'
import InvitationDialog from "../components/InvitationDialog";
import SetttingsDialog from "../components/SettingsDialog"
import EmailDialog from "../components/EmailDialog"
import NewUserDialog from "../components/NewUserDialog"
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import axios from "axios"
import  { Redirect } from 'react-router-dom'



const Chat = (props) => {

    const [currentUser, setCurrentUser] = useState("")
    const [friends, setFriends] = useState([])
    const [filteredFriends, setFilteredFriends] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [messageList, setMessageList] = useState([])
    const [newMsg, setNewMsg] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const [openDialog, setOpenDialog] = useState(null)
    const [showSteps, setShowSteps] = useState(false)

    const newUserId = props.location.state ? props.location.state._id  : ""
    const referral = props.location.state ? props.location.state.referral : ""
    const newUser = props.location.state ? props.location.state.newUser : ""
  
    useEffect(() => {
        fetch(`http://${url}/user/${newUserId}`, {
          credentials: "include"
        })
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .then(() => {
              referral !== undefined && setOpenDialog("NewUserDialog")
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        let friends = []

        fetch(`http://${url}/user/${newUserId}/contacts`, {
          credentials: "include"
        })
            .then(res => res.json())
            .then(data => data[0].friends.map(item => friends.push(item)))
            .then(() => setFriends(friends))
            .then(() => setFilteredFriends(friends))
            .catch((err) => console.error(err))
    }, []) 

    useEffect(() => {
        let allMessages = []        

        fetch(`http://${url}/user/${newUserId}/conversations`, {
          credentials: "include"
        })
            .then(res => res.json())
            .then(data => data.map(message => allMessages.push(message)))
            .then(() => setMessageList(allMessages))
            .catch((err) => console.error(err))
    }, [selectedChat])

    if (!props.location.state) return <Redirect to="/login" />

    const handleClick = (e) => {
      anchorEl === null ? setAnchorEl(e.target) : setAnchorEl(null)
    };

    const selectChat = (friendId) => {
        const selectedFriend = friends.find(friend => friend._id === friendId)
        setSelectedChat(selectedFriend)

        let selectedMessages = messageList.filter(message => {
          const isRecipientSelectedFriend = message.recipient.name === selectedFriend.name;
          const isSenderCurrentUser = message.sender.name === currentUser.name;
          const isRecipientCurrentUser = message.recipient.name === currentUser.name;
          const isSenderSelectedFriend = message.sender.name === selectedFriend.name;
          const isRecipientFriendAndSenderUser = isRecipientSelectedFriend && isSenderCurrentUser;
          const isRecipientUserAndSenderFriend = isRecipientCurrentUser && isSenderSelectedFriend;

          return (isRecipientFriendAndSenderUser || isRecipientUserAndSenderFriend)
        })
        selectedMessages.sort((a, b) => a.sendDate - b.sendDate)
        fetch(`http://${url}/user/${newUserId}/markread/${friendId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            
        setMessages(selectedMessages)
    }

    const toggleSearch = e => {
        setMessages(null)
        setSelectedChat(null)
        const searchedFriends = friends.filter(friend => friend.name.includes(e.target.value))
        setFilteredFriends(searchedFriends)
    }

    const toggleMsgInput = e => {
        setNewMsg(e.target.value)
    }

    const toggleMsgSubmit = e => {
        e.preventDefault()
        setMessages([...messages, {
            sendDate: dayjs(),
            type: "msg",
            content: newMsg,
            sender: currentUser.name,
            recipient: selectedChat.name,
            read: false,
            id: uuidv4()
        }])
        setNewMsg("")
    }

    const handleClose = () => {
      setAnchorEl(null)
    }

    const logout = () => {
      fetch(`http://${url}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.logout === true) {
          props.history.push("/login") 
        }
    })
    }

    const steps = [
      {
        element: ".settingsIcon1",
        intro: "Click here to edit your profile. You can change your password, add a photo, and also set your language. Your current language is set to English. You can also add friends and invite people to join this app.",
        position: "right",
        tooltipClass: "myTooltipClass",
        highlightClass: "myHighLightClass"
      },
      {
        element: ".settingsIcon2",
        intro: "You'll see a list of friends here. You can search from your existing friends in the search bar above.",
        position: "right",
        tooltipClass: "myTooltipClass",
        highlightClass: "myHighLightClass"
      },
      {
        element: ".settingsIcon3",
        intro: "You can type your messages here. The app will automatically translate your messages to your friend's language, and your friend's messages to you will be translated to your language, so you can all understand each other just fine :)",
        position: "right",
        tooltipClass: "myTooltipClass",
        highlightClass: "myHighLightClass"
      }
    ]



    return (
        <Grid className="chatContainer">
            {openDialog === "invite" &&
              <EmailDialog
                letOpen={true}
                currentUser={currentUser}
                setOpenDialog={setOpenDialog}
              />
            }
            {openDialog === "settings" &&
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
            }
            {openDialog === "settings" &&
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
            }
            {openDialog === "addFriends" &&
              <InvitationDialog
                  currentUser={currentUser}
                  friends={friends}
                  setFriends={setFriends}
                  setFilteredFriends={setFilteredFriends}
                  letOpen={true}
                  setOpenDialog={setOpenDialog}
              />
            }
            {newUser === true && 
              <NewUserDialog
                currentUser={currentUser}
                setShowSteps={setShowSteps}
                letOpen={newUser === true}
                friends={friends}
                setFriends={setFriends}
                setFilteredFriends={setFilteredFriends}
                referral={referral}
              />
            }
            {showSteps === true &&
              <Steps
                enabled={true}
                steps={steps}
                initialStep={0}
                onExit={() => setShowSteps(false)}
              />
            }

            <Grid className="chatListContainer">
                <Grid className="currentUserContainer">
                    <Grid className="currentUserPicStatus">
                        <img className="userPic" src={currentUser.image} alt="userPic"/>
                        <Grid className={`statusDot ${currentUser.status === "Online" ? "statusAvailable" : "statusAway"} `}></Grid> 
                    </Grid>
                    <Grid className="userNameMsg">
                        <p className="username"> {currentUser.name} </p> 
                    </Grid>
                    <IconButton
                      onClick={(e) => handleClick(e)}
                      className="settingsIcon1"
                    >
                      <MoreHorizIcon />
                      <Menu
                        id="simple-menu"
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorEl={anchorEl}
                        keepMounted
                      >
                        <MenuItem onClick={() => setOpenDialog("settings")}>Profile</MenuItem>
                        <MenuItem onClick={() => setOpenDialog("addFriends")}>Add friends</MenuItem>
                        <MenuItem onClick={() => setOpenDialog("invite")}>Invite someone</MenuItem>
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
                {filteredFriends.length !== 0 
                  ? 
                  filteredFriends.map(user => (
                    <Grid 
                        onClick={() => selectChat(user._id)}
                        className={selectedChat !== null ? selectedChat._id === user._id ? `selectedChat` : "" : ""}
                        key={user._id}
                    >
                        <User 
                            name={user.name}
                            profileImg={user.image}
                            recentMsg={messageList.filter(message => message.sender.name === user.name).sort((a, b) => b.createdAt - a.createdAt)[0] || ""}
                            unreadMsgs={messageList.filter(message => message.sender.name === user.name).filter(message => message.read === false).length}
                            status={user.status}
                            id={user._id}
                        />
                    </Grid>
                ))
                  :
                  <Grid> 
                    You have no friends yet.
                  </Grid>
                }
                </Grid>
            </Grid>
            <Grid className="currentChatContainer settingsIcon3">
                <Grid className="currentChatTitle">
                    <span className="currentChatName">{selectedChat !== null && selectedChat.name}</span>
                    <Grid className={`statusDotCurrent ${selectedChat !== null ? selectedChat.status === "Online" ? "statusAvailableCurrent" : "statusAwayCurrent" : "hideCurrent"}`}></Grid> 
                    <span className="currentChatStatus">{selectedChat !== null ? selectedChat.status : ""} </span>
                    <Grid className="moreHoriz">
                        {selectedChat !== null && <MoreHorizIcon />}
                    </Grid>
                </Grid>

                <Grid className="chatMsgs">
                    {messages !== null && messages.map(message => (
                        <ChatMsg 
                            type={message.type}
                            username={message.sender.name}
                            direction={message.sender.name === currentUser.name ? "sent" : "received"}
                            content={message.content}
                            sendDate={dayjs(message.sendDate).format('hh:mma')}
                            userImg={message.recipient.name === currentUser.name ? friends.filter(friend => friend.name === message.sender.name)[0].image : ""}
                            key={message._id}
                        />
                    ))}
                </Grid>

                <form className="chatMsg" onSubmit={e => toggleMsgSubmit(e)}>
                    {selectedChat !== null &&
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
                    }
                </form>
                
            </Grid>
        </Grid>
    )
}

export default Chat