import React from "react"
import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import "./ChatMsg.css"

const useStyles = makeStyles({
    root: {
        width:  "200px",
        height: "200px",
        borderRadius: "10px",
        alignItems: "center",
        marginRight: 10,
    }
})

const ChatMsg = ({userImg, type, time, content, username, direction}) => {

    const classes = useStyles()

    return (
    direction === "sent" 
    ? 
        <Grid className="sentMsg">
            <Typography>
                {time}
            </Typography>
            {type === "msg" 
            ? 
            <Typography className="sentMsgBubble">{content} </Typography>
            :
            <img src={content} alt="content" className={classes.root}/>} 
        </Grid>
    :
        <Grid className="receivedMsg">
            <img className="receivedMsgPic" src={userImg} alt="friendPic" />
            <Grid className="receivedMsgContent">
                <Grid>
                    <Typography>{username} {time}</Typography>
                </Grid>
                {type === "msg" 
                ? 
                <Typography className="receivedMsgBubble">{content} </Typography>
                : 
                <img src={content} alt="content" className="msgPic"/>}
            </Grid>
        </Grid>
    )
}

export default ChatMsg