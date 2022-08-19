import { Container } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchChats, updateChats } from '../../Store/Actions/user';
import { axiosGetAllMessages, axiosSendMessage } from '../../utils/Api';
import { toastOptions } from '../../utils/constants';
import ChatInput from '../chatinput/ChatInput'
import Messages from '../messages/Messages';
import NavBar from '../navbar/NavBar';
import styles from './ChatContainer.module.css';

function ChatContainer({ currentUser, socket }) {
    // const [messages, setMessages] = useState([]);

    const messages = useSelector(state => state.user.chats);
    console.log('messages')
    console.log(messages)

    const dispatch = useDispatch();
    const scrollRef = useRef();

    useEffect(() => {
        async function callApi() {
            const sender = JSON.parse(localStorage.getItem('chat-app-user'));

            // const response = await axiosGetAllMessages({
            //     from: sender.id,
            //     to: currentUser._id
            // });

            dispatch(fetchChats({
                from: sender.id,
                to: currentUser._id
            }))


        }
        if (currentUser) {
            callApi();
        }
    }, [currentUser])

    const sendMsgHandler = async (msg) => {
        const sender = JSON.parse(localStorage.getItem('chat-app-user'));
        // const data = await axiosSendMessage({
        //     from: sender.id,
        //     to: currentUser._id,
        //     message: msg
        // })


        dispatch(updateChats({
            from: sender.id,
            to: currentUser._id,
            message: msg,
            fromSelf: true
        }))


        const msgs = [...messages];
        console.log('msgs')
        console.log(msgs)
        msgs.push({ fromSelf: true, message: msg });
        // setMessages(msgs);


    }


    useEffect(() => {
        scrollRef.current && scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }, [messages])


    return (
        <>
            {currentUser &&
                <Container className={styles['container']}>
                    <NavBar currentUser={currentUser} />
                    <Container className={styles['container2']}>
                        <Messages messages={messages} scrollRef={scrollRef} />
                        <ChatInput sendMsgHandler={sendMsgHandler} />
                    </Container>
                </Container >
            }
        </>
    )
}

export default ChatContainer