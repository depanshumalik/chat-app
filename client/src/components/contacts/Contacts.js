import { Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment, useEffect, useState } from 'react';
import { axiosGetLatestMessages } from '../../utils/Api';
import styles from './Contacts.module.css';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';

function Contacts({ contacts, currentUser, setSelectedContact }) {
    const [currentSelected, setCurrentSelected] = useState();
    const [latestMessages, setLatestMessages] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [search, setSearch] = useState('');
    const messages = useSelector(state => state.user.chats);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        // border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    };

    const setSearchHandler = (e) => {
        setSearch(e.target.value)
    }


    useEffect(() => {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
        async function callApi() {
            try {
                const sender = JSON.parse(localStorage.getItem('chat-app-user'));

                const response = await axiosGetLatestMessages({
                    from: sender.id,
                    arr: contacts,
                    // to: currentUser.id
                });
                console.log('response.data')
                console.log(response.data)
                if (response.status === 200) {
                    console.log('oooooooooooooooo')
                    setLatestMessages(response.data)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        callApi();

    }, [contacts, messages])


    return (
        <Fragment>
            {console.log('latestMessages')}
            {console.log(latestMessages)}
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box style={{ justifyContent: 'center', textAlign: 'center' }} sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            All Contacts
                        </Typography>
                        <div className={[styles['scrollbar']]} >
                            <Stack spacing={1}>
                                {
                                    contacts[0] && contacts.map((contact, index) => {
                                        return (
                                            <div key={index} className={index === currentSelected ? styles['selected'] : ""} onClick={() => { setCurrentSelected(index); setSelectedContact(contact); handleClose() }}>
                                                <div className={[styles['item'], styles['inlineDiv']].join(' ')}>
                                                    <img className={styles['avatar']} src={contact.avatar} width="20%" height="20%" alt={`${contact.name}-img`} />
                                                    <div>
                                                        <h3 style={{ marginInlineStart: '10px' }}>{contact.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Stack>
                        </div>
                    </Box>
                </Modal>
            </div>
            {
                currentUser && (
                    <div className={[styles['sidebar']].join(' ')} >
                        <div style={{ marginBlock: '10px' }} className={['center1', styles['inlineDiv']].join(' ')}>
                            <TextField size='small'
                                InputProps={{
                                    endAdornment: <SearchIcon style={{ color: 'gray' }} />
                                }}
                                placeholder="Search..."
                                value={search}
                                onChange={setSearchHandler}
                            />
                        </div>
                        <div className={[styles['scrollbar']]} >

                            <Stack spacing={1}>
                                {

                                    contacts[0] && contacts.map((contact, index) => {
                                        return (
                                            latestMessages && latestMessages.map((message) => {
                                                // console.log("11111111111111111111", message, "222222222222222", contact)
                                                if (search === '' && message.to === contact._id) {
                                                    console.log('aaa')
                                                    return (
                                                        <div key={index} className={index === currentSelected ? styles['selected'] : ""} onClick={() => { setCurrentSelected(index); setSelectedContact(contact) }}>
                                                            <div className={[styles['item'], styles['inlineDiv']].join(' ')}>
                                                                <img className={styles['avatar']} src={contact.avatar} width="20%" height="20%" alt={`${contact.name}-img`} />
                                                                <div>
                                                                    <h3 style={{ marginInlineStart: '10px' }}>{contact.name}</h3>
                                                                    <h6 id={message.to} style={{ marginTop: '-12px', color: 'grey' }}>{message.message}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                } else if (message.to === contact._id && contact.name.toLowerCase().includes(search.toLowerCase())) {
                                                    console.log('aaa')
                                                    return (
                                                        <div key={index} className={index === currentSelected ? styles['selected'] : ""} onClick={() => { setCurrentSelected(index); setSelectedContact(contact) }}>
                                                            <div className={[styles['item'], styles['inlineDiv']].join(' ')}>
                                                                <img className={styles['avatar']} src={contact.avatar} width="20%" height="20%" alt={`${contact.name}-img`} />
                                                                <div>
                                                                    <h3 style={{ marginInlineStart: '10px' }}>{contact.name}</h3>
                                                                    <h6 id={message.to} style={{ marginTop: '-12px', color: 'grey' }}>{message.message}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })

                                        )
                                    })
                                }
                            </Stack>
                        </div>
                        <div className={styles['below-avatar']}>
                            <Button variant='contained' style={{ marginInline: '23%' }}
                                onClick={handleOpen}
                            >+ &nbsp;Add Conversations</Button>
                            <div className={['center1'].join(' ')}>
                                <br />
                                <img src={currentUser.avatar} className={styles['user-avatar']} width="20%" height="20%" alt='current user' />
                                <h5 style={{ color: 'white' }}>{currentUser.name}</h5>
                                <br />

                            </div>
                        </div>
                    </div>
                )
            }

        </Fragment>
    )
}

export default Contacts