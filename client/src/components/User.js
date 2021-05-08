import React, { useState, useEffect } from "react"
import "./User.css"
import { Grid, Typography } from '@material-ui/core'

const User = ({ username, profileImg, status, recentMsg, unreadMsgs }) => {

    return (
        <Grid className="userContainer">
            <Grid className="userPicStatus">
                <img className="userPic" src={profileImg} alt="userPic"/>
                <Grid className={`statusDot ${status === "Online" ? "statusAvailable" : "statusAway"}` }></Grid> 
            </Grid>
            <Grid className="userNameMsg">
                <Typography className="userName"> {username} </Typography> 
                <Typography className={`userMsg ${unreadMsgs > 0 && 'highlightUnreadMsg'}`}> {recentMsg.type === "msg" ? recentMsg.content :  recentMsg.type === "img" ? "Sent photo" : ""} </Typography>
            </Grid>
            <Grid className={`unreadContainer ${unreadMsgs === 0 && 'hideUnreadMsgs'}`}>
                <Grid className={`unreadMsgDot ${unreadMsgs > 9 && 'longUnreadMsgDot'}`}></Grid>
                <Grid className="unreadMsgs">{unreadMsgs}</Grid>
            </Grid>
        </Grid>
    )
}

export default User