import React, { useEffect, useState } from 'react';
import './DialogItem.css';
import {Link} from "react-router-dom";
import { Avatar } from '@material-ui/core';
import Pusher from 'pusher-js';
import { setChatAC, setDialogsAC, setIsDialogChoseAC, setMessagesAC } from "../../../redux/dialogs-reducer";
import { connect } from 'react-redux';
import { useHttp } from '../../../hooks/http.hook';

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const DialogItem = (props) => {
    // const path = "/dialogs/" + props.id;
    const {loading, error, request, clearError} = useHttp();
    const [dialogsLastMsg, setDialogsLastMsg] = useState({});
    let displayName = '', message = '', timestamp = 0;

    const getLastMessage = async () => {
        try {
            const data = await request(`/api/chats/get/lastMessage?id=${props.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            setDialogsLastMsg(data);
        } catch {console.log(1)}
    }

    useEffect(() => {
        getLastMessage();
        
        const channel = pusher.subscribe('messages');
        channel.bind('newMessage', () => {
            getLastMessage();   
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [props.id]);

    const choosedDialog = async () => {
        try {
            const data = await request(`/api/chats/get/conversation?id=${props.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            props.setMessages(data['0'].conversation);
            props.setChat({
                chatName: data['0'].chatName,
                chatId: props.id
            });
            props.setIsDialogChose();
        } catch {console.log(1)}
    }

    try {
        displayName = dialogsLastMsg.user.displayName;
        message = dialogsLastMsg.message;
        timestamp = dialogsLastMsg.timestamp;
    } catch {}

    return (
        // <Link to={path}>
            <div onClick={() => choosedDialog()} className='dialogItem'>
                <div className='dialogItem__info'>
                    <Avatar />
                    <h2>{props.name}</h2>
                    <p>{(displayName + ': ' + message) || ''}</p>
                </div>
                <small>{new Date(parseInt(timestamp)).toISOString().replace(/T/g, ' ').replace(/\..*/, '')}</small> 
            </div>
        // </Link>  
    )
}

let mapStateToProps = (state) => {
    return {
        dialogs: state.dialogsPage.dialogs,
        token: state.auth.token
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setDialogs: (dialogs) => {
            dispatch(setDialogsAC(dialogs));
        },
        setMessages: (messages) => {
            dispatch(setMessagesAC(messages));
        },
        setChat: chat => {
            dispatch(setChatAC(chat))
        },
        setIsDialogChose: () => {
            dispatch(setIsDialogChoseAC())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogItem);