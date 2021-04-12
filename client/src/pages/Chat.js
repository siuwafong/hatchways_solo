import React, { useState } from "react"
import User from '../components/User'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { MOCK_PROFILE, MOCK_FRIENDS, MOCK_MSGS } from '../utils/MockData'
import ChatMsg from '../components/ChatMsg'
import { v4 as uuidv4 } from 'uuid';
import './Chat.css'

const Chat = () => {

    const [currentUser, setCurrentUser] = useState(MOCK_PROFILE)
    const [friends, setFriends] = useState(MOCK_FRIENDS)
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [newMsg, setNewMsg] = useState("")

    const selectChat = (userId) => {
        const selectedFriend = MOCK_FRIENDS.find(friend => friend.id === userId)
        setSelectedChat(selectedFriend)
        let selectedMessages = MOCK_MSGS.filter(message => 
            (message.recipient === selectedFriend.username && message.sender === currentUser.username) 
            || 
            (message.recipient === currentUser.username && message.sender === selectedFriend.username )
            )
        selectedMessages.map(message => message.read = true)
        selectedMessages.sort((a, b) => parseInt(a.time) - parseInt(b.time))
        setMessages(selectedMessages)
        
    }

    const toggleSearch = e => {
        setMessages(null)
        setSelectedChat(null)
        setFriends(MOCK_FRIENDS.filter(friend => friend.username.includes(e.target.value)))
    }

    const toggleMsgInput = e => {
        setNewMsg(e.target.value)
    }

    const toggleMsgSubmit = e => {
        e.preventDefault()
        console.log(newMsg)
        setMessages([...messages, {
            time: "1200",
            type: "msg",
            content: newMsg,
            sender: currentUser.username,
            recipient: selectedChat.username,
            read: false,
            id: uuidv4()
        }])
        setNewMsg("")
    }

    return (
        <div className="chatContainer">
            <div className="chatListContainer">
                <div className="currentUserContainer">
                    <div className="currentUserPicStatus">
                        <img className="userPic" src={currentUser.img} alt="userPic"/>
                        <div className={`statusDot ${currentUser.status === "Online" ? "statusAvailable" : "statusAway"} `}></div> 
                    </div>
                    <div className="userNameMsg">
                        <p className="userName"> {currentUser.username} </p> 
                    </div>
                    <MoreHorizIcon />
                </div>
                <h3>Chats</h3>
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
                <div className="usersContainer">
                {friends.map(user => (
                    <div 
                        onClick={() => selectChat(user.id)}
                        className={selectedChat !== null ? (selectedChat.id === user.id && `selectedChat`) : ""}
                    >
                        <User 
                            username={user.username}
                            profileImg={user.img}
                            recentMsg={user.recentMsg}
                            unreadMsgs={user.unreadMsgs}
                            status={user.status}
                            id={user.id}
                            key={user.id}
                        />
                    </div>
                ))}
                </div>
            </div>
            <div className="currentChatContainer">

                <div className="currentChatTitle">
                    <span className="currentChatName">{selectedChat !== null && selectedChat.username}</span>
                    <div className={`statusDotCurrent ${selectedChat !== null ? selectedChat.status === "Online" ? "statusAvailableCurrent" : "statusAwayCurrent" : "hideCurrent"}`}></div> 
                    <span className="currentChatStatus">{selectedChat !== null ? selectedChat.status : ""} </span>
                    <div className="moreHoriz">
                        {selectedChat !== null && <MoreHorizIcon />}
                    </div>
                </div>

                <div className="chatMsgs">
                    {messages !== null && messages.map(message => (
                        <ChatMsg 
                            type={message.type}
                            username={message.sender}
                            direction={message.sender === currentUser.username ? "sent" : "received"}
                            content={message.content}
                            time={`${message.time.slice(0, 2)}:${message.time.slice(2, 4)}`}
                            userImg={message.recipient === currentUser.username ? friends.filter(friend => friend.username === message.sender)[0].img : ""}
                            key={message.id}
                        />
                    ))}
                </div>

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
                
            </div>
        </div>
    )
}

export default Chat