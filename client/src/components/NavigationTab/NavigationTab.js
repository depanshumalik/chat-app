import { Button, Grid } from '@mui/material'
import React, { Fragment } from 'react'


const Navigation = (props) => {
    const onClickHandler = (event) => {
        props.setActiveHandler(event.target.value)
    }


    return (
        <Fragment>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Please Login
                <p style={{ textAlign: 'center', color: 'red', fontWeight: 'lighter' }}>email: hexol@gmail.com &nbsp;&nbsp;&nbsp; password: hexol</p>
            </div>
        </Fragment >
    )
}

export default Navigation


