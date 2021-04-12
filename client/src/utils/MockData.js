import { v4 as uuidv4 } from 'uuid';

export const MOCK_PROFILE = {
    username: "thomas",
    img: "./assets/img/profile_02.png",
    status: "Online",
    recentMsg: {
        type: "msg",
        content: ""
    }
}

export const MOCK_MSGS = [
    {
        time: "1045",
        type: "msg",
        content: "Where are you from?",
        sender: "santiago",
        recipient: "thomas",
        read: true,
        id: uuidv4()
    },
    {
        time: "1055",
        type: "msg",
        content: "Share photo of your city, please",
        sender: "santiago",
        recipient: "thomas",
        read: true,
        id: uuidv4()
    },
    {
        time: "1058",
        type: "photo",
        content: "./assets/img/msg_example.png",
        sender: "thomas",
        recipient: "santiago",
        read: true,
        id: uuidv4()
    },
    {
        time: "1051",
        type: "msg",
        content: "I'm from New York",
        sender: "thomas",
        recipient: "santiago",
        read: true,
        id: uuidv4()
    },
    {
        time: "1000",
        type: "msg",
        content: "Sure! What time?",
        sender: "chiumbo",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "1100",
        type: "msg",
        content: "Do you have any plans?",
        sender: "julia",
        recipient: "thomas",
        read: true,
        id: uuidv4()
    },
    {
        time: "0900",
        type: "msg",
        content: "Hello",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0901",
        type: "msg",
        content: "How's it going?",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0902",
        type: "msg",
        content: "...",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0902",
        type: "msg",
        content: "...",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0903",
        type: "msg",
        content: "What are you up to today?",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0904",
        type: "msg",
        content: "Let's hang out",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0905",
        type: "msg",
        content: "Are you free today?",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0906",
        type: "msg",
        content: "Do you want to go get some lunch?",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0907",
        type: "msg",
        content: "There's a new Japanese restaurant",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0908",
        type: "msg",
        content: "Are you interested?",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0910",
        type: "msg",
        content: "We don't need to make a reservation",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "0911",
        type: "msg",
        content: "Smiley face",
        sender: "hualing",
        recipient: "thomas",
        read: false,
        id: uuidv4()
    },
    {
        time: "1100",
        type: "photo",
        content: "./assets/img/msg_example.png",
        sender: "ashanti",
        recipient: "thomas",
        read: true,
        id: uuidv4()
    }
]

const countUnreadMsgs = username => {
    return MOCK_MSGS.filter(msg => (msg.sender === username && msg.read === false)).length
}


export const MOCK_FRIENDS = [
{
    username: "santiago",
    img: "./assets/img/profile_03.png",
    status: "Online",
    recentMsg: {
        type: "msg",
        content: ""
    },
    unreadMsgs: countUnreadMsgs("santiago"),
    id: uuidv4()
},
{
    username: "chiumbo",
    img: "./assets/img/profile_06.png",
    status: "Online",
    recentMsg: {
        type: "msg",
        content: "Sure! What time?"
    },
    unreadMsgs: countUnreadMsgs("chiumbo"),
    id: uuidv4()
},
{
    username: "hualing",
    img: "./assets/img/profile_07.png",
    status: "Away",
    recentMsg: {
        type: "msg",
        content: "*smile*"
    },
    unreadMsgs: countUnreadMsgs("hualing"),
    id: uuidv4()
},
{
    username: "ashanti",
    img: "./assets/img/profile_04.png",
    status: "Away",
    recentMsg: {
        type: "photo",
        content: ""
    },
    unreadMsgs: 0,
    id: uuidv4()
},
{
    username: "julia",
    img: "./assets/img/profile_01.png",
    status: "Away",
    recentMsg: {
        type: "msg",
        content: "Do you have any plans?"
    },
    unreadMsgs: countUnreadMsgs("julia"),
    id: uuidv4()
},
{
    username: "cheng",
    img: "./assets/img/profile_05.png",
    status: "Online",
    recentMsg: {
        type: "msg",
        content: ""
    },
    unreadMsgs: countUnreadMsgs("cheng"),
    id: uuidv4()
},
]


