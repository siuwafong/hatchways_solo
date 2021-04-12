import React from "react"
import "./ChatMsg.css"

const ChatMsg = ({userImg, type, time, content, username, direction}) => {

    if (direction === "sent") {
        return (
            <div className="sentMsg">
                <div>
                    {time}
                </div>
                {type === "msg" 
                ? 
                <div className="sentMsgBubble">{content} </div>
                : 
                <img src={content} alt="content" className="msgPic"/>}
            </div>
        )
    }
    
    else {
        return (
            <div className="receivedMsg">
                <img className="receivedMsgPic" src={userImg} alt="friendPic" />
                <div className="receivedMsgContent">
                    <div>
                        <span>{username} {time}</span>
                    </div>
                    {type === "msg" 
                    ? 
                    <div className="receivedMsgBubble">{content} </div>
                    : 
                    <img src={content} alt="content" className="msgPic"/>}
                </div>
            </div>
        )
    }
}

export default ChatMsg