import React from 'react'
import './Background.css'
import { Grid } from '@material-ui/core';

const Background = () => {
    return (
        <Grid className="backgroundContainer">
            <Grid className="backgroundText">
                <h2>
                    Converse with anyone with your language
                </h2>
            </Grid>
                <img className="backgroundImg" src="./assets/img/login.png" />
                <i className="far fa-comment-dots fa-7x"></i>
        </Grid>
    )
}

export default Background