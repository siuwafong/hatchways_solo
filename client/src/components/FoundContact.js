import React, { useState, useEffect } from "react"
import "./FoundContact.css"
import { ListItem, ListItemText, Button, Box } from '@material-ui/core'
import { spacing } from '@material-ui/system';
import { url, userId } from '../utils/MockData'
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";


const FoundContact = ({setFilteredFriends, friends, setFriends, foundContacts, invites, setInvites, image, name, id, type}) => {

    const [relationship, setRelationship] = useState("")
    const [newFriend, setNewFriend] = useState("")

    const checkRelationship = name => {
        const contact = foundContacts.find(person => person.name === name)
        if (invites.sent.some(person => person.name === name)) {
            setRelationship(`You have sent an invite to ${name}`)
        } else if (invites.received.some(person => person.name === name)) {
            setRelationship(`${name} has sent you an invite`)
        } else if (contact.friends.includes(userId)) {
            setRelationship(`You and ${name} are already friends`)
        } else {
            setRelationship("")
        }
    }

    useEffect(() => checkRelationship(name), [name])

    const sendInvite = contactId => {
        fetch(`http://${url}/user/${userId}/sendinvite`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactId
            }),
            credentials: "same-origin",
            })
            .catch((err) => console.log(err))
            setInvites({
                ...invites,
                sent: [...invites.sent, {
                    name,
                    sendDate: dayjs(),
                    id: contactId
                }]
            })
            setRelationship(`You have sent an invite to ${name}`)
    }

    const ignoreInvite = contactId => {
        fetch(`http://${url}/user/${userId}/ignoreinvite`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactId
            }),
            credentials: "same-origin"
        })
        .catch((err) => console.log(err))
        
        const updatedInvite = {
            name, 
            sendDate: dayjs(),
            id: contactId,
            image, 
            status: "declined"
        }

        setInvites({
            ...invites, 
            received: invites.received.filter(invite => invite.name !== name).concat(updatedInvite)
        })
    }

    const acceptInvite = contactId => {
        fetch(`http://${url}/user/${userId}/acceptinvite`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactId
            }),
            credentials: "same-origin"
        })
        .then(res => res.json())
        .then(data => {
            setFriends([...friends, data[0]])
            setFilteredFriends([...friends, data[0]])
        })
        
        setInvites({
            ...invites,
            received: invites.received.filter(invite => invite.name !== name)
        })

    }

    return (
        <ListItem>
            <img src={image} alt={name} className="foundContactImage" />
            <ListItemText primary={name} secondary={type === "search" && relationship}/>
            {(relationship === "" && type === "search") 
                && 
                <Button variant="contained" color="primary" onClick={() => sendInvite(id)}>
                    Send Invite
                </Button>
            } 
            {(relationship === `${name} has sent you an invite` && type === "received") 
                && 
                <React.Fragment>
                    <Box mr={2}>
                        <Button variant="contained" color="primary" onClick={() => ignoreInvite(id)}>
                            Ignore
                        </Button>
                    </Box>
                    <Box ml={2}>
                        <Button variant="contained" color="default" onClick={() => acceptInvite(id)}>
                            Accept
                        </Button>
                    </Box>
                </React.Fragment>
            }
        </ListItem>
    )
}

export default FoundContact