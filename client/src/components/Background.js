import React from 'react'
import './Background.css'

const Background = () => {
    return (
        <div className="backgroundContainer">
            <div className="backgroundText">
                <h2>
                    Converse with anyone with your language
                </h2>
            </div>
                <img className="backgroundImg" src="./assets/img/login.png" />
                <i className="far fa-comment-dots fa-7x"></i>
        </div>
    )
}

export default Background