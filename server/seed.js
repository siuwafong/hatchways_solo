const mongoose = require('mongoose')
const User = require('./models/users')
const Invite = require('./models/invites')
const Message = require('./models/messages')
const multer = require('multer')
const { storage } = require('./cloudinary')
const upload = multer({ storage })

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
        joinDate: new Date(2021, 04, 27),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/profile_02_vdyeqo.png",
        status: "Online"
    },
    {
        name: "santiago",
        email: "santiago@yahoo.com",
        friends: ["thomas", "chiumbo"],
        joinDate: new Date(2021, 04, 27),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/profile_03_xhyf8b.png",
        status: "Online"
    },
    {
        name: "chiumbo",
        email: "chiumbo@gmail.com",
        friends: ["thomas", "santiago"],
        joinDate: new Date(2021, 03, 29),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265988/hatchways/profile_06_mvlnqr.png",
        status: "Online"
    }, 
    {
        name: "hualing",
        email: "hualing@outlook.com",
        friends: ["thomas", "julia", "cheng"],
        joinDate: new Date(2021, 03, 30),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265988/hatchways/profile_07_vuga0d.png",
        status: "Away"
    },
    {
        name: "ashanti",
        email: "ashanti@qq.com",
        friends: ["thomas", "julia", "cheng"],
        joinDate: new Date(2021, 04, 17),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/profile_04_bjfrhv.png",
        status: "Away"
    },
    {
        name: "julia",
        email: "julia@xyz.com",
        friends: ["thomas", "ashanti", "hualing"],
        joinDate: new Date(2021, 05, 01),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/profile_01_ogn13x.png",
        status: "Away"
    },
    {
        name: "cheng",
        email: "cheng@abc.ca",
        friends: ["thomas", "ashanti", "hualing"],
        joinDate: new Date(2021, 04, 30),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265988/hatchways/profile_05_r2hsk8.png",
        status: "Online"
    },
    {
        name: "brian",
        email: "brianbb@hatchways.io",
        friends: [],
        joinDate: new Date(2021, 05, 02),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png",
        status: "Online"
    },
    {
        name: "joel",
        email: "joel@apple.com",
        friends: [],
        joinDate: new Date(2021, 04, 28),
        image: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png",
        status: "Online"
    },
    {
        name: "manami",
        email: "manami@yahoo.jp",
        friends: [],
        joinDate: new Date(2021, 05, 03),
        image:  "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620268656/hatchways/dummy_z3twvc.png",
        status: "Online"
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
        content: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/msg_example_x3ryir.png",
        sendDate: new Date(2021, 04, 27, 10, 58, 0), 
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
        sendDate: new Date(2021, 04, 27, 10, 46, 0), 
        read: false
    },
    {
        sender: "hualing",
        recipient: "thomas",
        type: "msg",
        content: "Wanna hang out?",
        sendDate: new Date(2021, 04, 27, 11, 47, 0), 
        read: false
    },
    {
        sender: "ashanti",
        recipient: "thomas",
        type: "img",
        content: "https://res.cloudinary.com/dmf6tpe7e/image/upload/v1620265986/hatchways/msg_example_x3ryir.png",
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

    // add User data (without friends)
    for (let i = 0; i < userData.length; i++) {
        const user = new User({
            name: userData[i].name,
            email: userData[i].email,
            joinDate: userData[i].joinDate,
            status: userData[i].status,
            image: userData[i].image
        })
        await user.save();
    }
    
    // add User data (friends)
    for (let i = 0; i < userData.length; i++) {
        const user = await User.findOne({name: userData[i].name})
        for (let j = 0; j < userData[i].friends.length; j++) {
            const friend = await User.findOne({ name: userData[i].friends[j] })
            user.friends.push(friend)
        }
        await user.save()
    }

    // add Message data 
    for (let i = 0; i < messageData.length; i++) {
        const sender = await User.findOne({name: messageData[i].sender})
        const recipient = await User.findOne({name: messageData[i].recipient})
        const message = new Message({
            sender,
            recipient,
            type: messageData[i].type,
            content: messageData[i].content,
            read: messageData[i].read,
            sendDate: messageData[i].sendDate
        })
        await message.save();
    }

    // add Invite data
    for (let i = 0; i < inviteData.length; i++) {
        const sender = await User.findOne({name: inviteData[i].sender})
        const recipient = await User.findOne({name: inviteData[i].recipient})
        const invite = new Invite({
            sender,
            recipient,
            sendDate: inviteData[i].sendDate,
            status: inviteData[i].status
        })
        await invite.save()
        recipient.invites.push(invite)
        await recipient.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})