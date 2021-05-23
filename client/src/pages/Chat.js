import React, { useEffect, useState } from "react"
import User from '../components/User'
import { TextField, InputAdornment, Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { url, userId } from '../utils/MockData'
// import { AdvancedImage } from '@cloudinary/react';
// import { Cloudinary } from "@cloudinary/base";
import ChatMsg from '../components/ChatMsg'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid';
import './Chat.css'
import InvitationDialog from "../components/InvitationDialog";
import SetttingsDialog from "../components/SettingsDialog"

const Chat = () => {

    const [currentUser, setCurrentUser] = useState("")
    const [friends, setFriends] = useState([])
    const [filteredFriends, setFilteredFriends] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [messageList, setMessageList] = useState([])
    const [newMsg, setNewMsg] = useState("")

    // const cld = new Cloudinary({
    //     cloud: {
    //         cloudName: 'dmf6tpe7e'
    //     }
    // })

    useEffect(() => {
        fetch(`http://${url}/user/${userId}`)
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .catch(err => console.error(err))
    }, [ ])

    useEffect(() => {
        let friends = []

        fetch(`http://${url}/user/${userId}/contacts`)
            .then(res => res.json())
            .then(data => data[0].friends.map(item => friends.push(item)))
            .then(() => setFriends(friends))
            .then(() => setFilteredFriends(friends))
            .catch((err) => console.error(err))
    }, []) 

    useEffect(() => {
        let allMessages = []        

        fetch(`http://${url}/user/${userId}/conversations`)
            .then(res => res.json())
            .then(data => data.map(message => allMessages.push(message)))
            .then(() => setMessageList(allMessages))
            .catch((err) => console.error(err))
    }, [selectedChat])

    const selectChat = (friendId) => {
        const selectedFriend = friends.find(friend => friend._id === friendId)
        setSelectedChat(selectedFriend)
        let selectedMessages = messageList.filter(message => 
            (message.recipient.name === selectedFriend.name && message.sender.name === currentUser.name) 
            || 
            (message.recipient.name === currentUser.name && message.sender.name === selectedFriend.name )
            )
        selectedMessages.sort((a, b) => a.sendDate - b.sendDate)
        fetch(`http://${url}/user/${userId}/markread/${friendId}`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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

    return (
        <Grid className="chatContainer">
            <SetttingsDialog 
                letOpen={true}
                name={currentUser.name}
                password={currentUser.password}
                image={currentUser.image}
                language={currentUser.language}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
            />
            <InvitationDialog
                currentUser={currentUser}
                friends={friends}
                setFriends={setFriends}
                setFilteredFriends={setFilteredFriends}
                letOpen={false}
            />
            <Grid className="chatListContainer">
                <Grid className="currentUserContainer">
                    <Grid className="currentUserPicStatus">
                        <img className="userPic" src={currentUser.image} alt="userPic"/>
                        <Grid className={`statusDot ${currentUser.status === "Online" ? "statusAvailable" : "statusAway"} `}></Grid> 
                    </Grid>
                    <Grid className="userNameMsg">
                        <p className="username"> {currentUser.name} </p> 
                    </Grid>
                    <MoreHorizIcon />
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
                <Grid className="usersContainer">
                {filteredFriends.map(user => (
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
                ))}
                </Grid>
            </Grid>
            <Grid className="currentChatContainer">
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