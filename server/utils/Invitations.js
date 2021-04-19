const { v4: uuidv4 } = require('uuid');

const invitations = [
    {
        id: uuidv4(),
        sender: "john",
        recipient: "thomas",
        reply: "none"
    }, 
    {
        id: uuidv4(),
        sender: "kevin",
        recipient: "chiumbo",
        reply: "ignore"
    },
    {
        id: uuidv4(),
        sender: "jane",
        recipient: "thomas",
        reply: "accept"
    }, 
    {
        id: uuidv4(),
        sender: "justin",
        recipient: "thomas",
        reply: "none"
    }
]



module.exports = invitations