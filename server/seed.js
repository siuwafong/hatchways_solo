const mongoose = require('mongoose')
const User = require('./models/users')
const Invite = require('./models/invites')
const Message = require('./models/messages')
require('dotenv').config()


mongoose.connect(`mongodb+srv://wf1234:${process.env.DB_PASS}@cluster0.fk4em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then((res) => console.log('connected to db'))
.catch((err) => console.log(err))

// Dummy Data
const userData = [
    {
        name: "thomas",
        email: "thomas@gmail.com",
        friends: ["santiago", "chiumbo", "hualing", "ashanti", "julia", "cheng"],
        joinDate: new Date(2021, 04, 27)
    },
    {
        name: "joel",
        email: "joel@gmail.com",
        friends: ["kevin"],
        joinDate: new Date(2021, 03, 29)
    }, 
    {
        name: "kevin",
        email: "kevin@outlook.com",
        friends: ["joel"],
        joinDate: new Date(2021, 03, 30)
    },
    {
        name: "brian",
        email: "brian@qq.com",
        friends: [],
        joinDate: new Date(2021, 04, 17)
    }
]

const messageData = [
    {
        sender: "santiago",
        recipient: "thomas",
        type: "msg",
        content: "Where are you from?",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: false
    },
    {
        sender: "thomas",
        recipient: "santiago",
        type: "msg",
        content: "I'm from New York",
        sendDate: new Date(2021, 04, 27, 10, 51, 0), 
        read: false
    },
    {
        sender: "santiago",
        recipient: "thomas",
        type: "msg",
        content: "Share photo of your city please",
        sendDate: new Date(2021, 04, 27, 10, 55, 0), 
        read: false
    },
    {
        sender: "thomas",
        recipient: "santiago",
        type: "img",
        content: "photo",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: false
    },
    {
        sender: "chiumbo",
        recipient: "thomas",
        type: "msg",
        content: "Sure! what time?",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: false
    },
    {
        sender: "hualing",
        recipient: "thomas",
        type: "msg",
        content: "Hi",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: false
    },
    {
        sender: "hualing",
        recipient: "thomas",
        type: "msg",
        content: "How's it going?",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: false
    },
    {
        sender: "hualing",
        recipient: "thomas",
        type: "msg",
        content: "Wanna hang out?",
        sendDate: new Date(2021, 04, 27, 11, 45, 0), 
        read: false
    },
    {
        sender: "ashanti",
        recipient: "thomas",
        type: "img",
        content: "photo",
        sendDate: new Date(2021, 04, 27, 10, 45, 0), 
        read: true
    },
    {
        sender: "julia",
        recipient: "thomas",
        type: "msg",
        content: "Do you have any plans?",
        sendDate: new Date(2021, 04, 27, 10, 00, 0), 
        read: true
    }   
]

const inviteData = [
    {
        sender: "joel",
        recipient: "thomas",
        sendDate: new Date(),
        status: "pending"
    },
    {
        sender: "brian",
        recipient: "thomas",
        sendDate: new Date(),
        status: "pending"
    }
]

// Seed dummy data
const seedDB = async () => {
    await User.deleteMany({})
    await Message.deleteMany({})
    await Invite.deleteMany({})

    for (let i = 0; i < userData.length; i++) {
        const user = new User({
            name: userData[i].name,
            email: userData[i].email,
            friends: userData[i].friends,
            joinDate: userData[i].joinDate
        })
        await user.save();
    }
    

    for (let i = 0; i < messageData.length; i++) {
        const message = new Message({
            sender: messageData[i].sender,
            recipient: messageData[i].recipient,
            type: messageData[i].type,
            content: messageData[i].content,
            read: messageData[i].read
        })
        await message.save();
    }

    for (let i = 0; i < inviteData.length; i++) {
        const invite = new Invite({
            sender: inviteData[i].sender,
            recipient: inviteData[i].recipient,
            sendDate: inviteData[i].sendDate,
            status: inviteData[i].status
        })
        await invite.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})