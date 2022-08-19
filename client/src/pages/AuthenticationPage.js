
import React, { Fragment, useState } from 'react'
import { Grid, Paper } from '@mui/material';
import { Container } from '@mui/system';
import styles from './AuthenticationPage.module.css';
import NavigationTab from '../components/NavigationTab/NavigationTab';
import SigninForm from '../components/Signin/Signin';
import Logo from '../assets/logo.gif';

const HomePage = () => {
    const [active, setActive] = useState('Signin');

    const setActiveHandler = (component) => {
        setActive(component);
    }

    return (
        <Fragment>
            <Container maxWidth='xs' style={{ paddingTop: '10%' }}>
                <Grid container spacing={0} >
                    <Paper className={styles['topContainer']}>
                        <Grid item xs={12}>
                            <div className={styles['centerLogo']}>
                                <img src={Logo} alt="aaaa" width='100px' />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <NavigationTab active={active} setActiveHandler={setActiveHandler} />
                            <div className={styles['form']} >
                                <SigninForm />
                            </div>
                        </Grid>
                    </Paper>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default HomePage