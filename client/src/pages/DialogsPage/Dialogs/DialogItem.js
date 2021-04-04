import React, { useEffect, useState } from 'react';
import './DialogItem.scss';
import {Link} from "react-router-dom";
import { Avatar } from '@material-ui/core';
import Pusher from 'pusher-js';
import { setChatAC, setDialogsAC, setIsDialogSelectedAC, setMessagesAC } from "../../../redux/dialogs-reducer";
import { connect } from 'react-redux';
import { useHttp } from '../../../hooks/http.hook';
import userPhoto from "../../../assets/images/user.png";

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const DialogItem = (props) => {
    // const path = "/dialogs/" + props.id;
    const {loading, error, request, clearError} = useHttp();
    const [dialogsLastMsg, setDialogsLastMsg] = useState({});
    const [extra, setExtra] = useState({});
    let displayName = '', message = '', timestamp = 0;

    useEffect(() => {
        props.extra.forEach(el => {
            if (el.id !== props.user._id) {
                setExtra(el);
            }
        });
    }, []);

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

    const selectedDialog = async () => {
        try {
            const data = await request(`/api/chats/get/conversation?id=${props.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            props.setMessages(data.conversation);
            props.setChat({
                chatName: extra.displayName || data.chatName,
                chatImg: extra.profileImg || data.chatImg,
                chatId: props.id
            });
            props.setIsDialogSelected(true);
        } catch {console.log(1)}
    }

    try {
        displayName = dialogsLastMsg.owner.displayName;
        message = dialogsLastMsg.message;
        timestamp = dialogsLastMsg.timestamp;
    } catch {}

    return (
        <div onClick={selectedDialog} className='dialogItem'>
            <div className='dialogItem__info'>
                <div className='dialogItem__info-avatar'><Avatar src={extra.profileImg}/></div>
                <div className='dialogItem__info-main'>
                    <div><h1>{extra.displayName || props.name}</h1></div>
                    <span className='dialogItem__info-message'>{displayName}: {message}</span>
                </div>
                <div className="timaStamp"><small>{new Date(parseInt(timestamp)).getMonth()}.{new Date(parseInt(timestamp)).getDay()}</small></div>
            </div>
        </div>
    )
}


// {/* <div><small>.toISOString().replace(/T/g, ' ').replace(/\..*/, '')</small> </div> */}

let mapStateToProps = (state) => {
    return {
        dialogs: state.dialogsPage.dialogs,
        token: state.auth.token,
        user: state.auth.user
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
        setIsDialogSelected: (a) => {
            dispatch(setIsDialogSelectedAC(a))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogItem);