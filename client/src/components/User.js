import React from "react"
import "./User.css"

const User = ({ username, profileImg, status, recentMsg, unreadMsgs }) => {
    return (
        <div className="userContainer">
            <div className="userPicStatus">
                <img className="userPic" src={profileImg} alt="userPic"/>
                <div className={`statusDot ${status === "Online" ? "statusAvailable" : "statusAway"}` }></div> 
            </div>
            <div className="userNameMsg">
                <p className="userName"> {username} </p> 
                <p className={`userMsg ${unreadMsgs > 0 && 'highlightUnreadMsg'}`}> {recentMsg.type === "msg" ? recentMsg.content : "Sent photo"} </p>
            </div>
            <div className={`unreadContainer ${unreadMsgs === 0 && 'hideUnreadMsgs'}`}>
                <div className={`unreadMsgDot ${unreadMsgs > 9 && 'longUnreadMsgDot'}`}></div>
                <div className="unreadMsgs">{unreadMsgs}</div>
            </div>
        </div>
    )
}

export default User