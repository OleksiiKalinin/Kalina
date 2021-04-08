import React, { useEffect, useState } from 'react';
import './DialogItem.scss';
import { Avatar } from '@material-ui/core';
import Pusher from 'pusher-js';
import { setChatAC, setDialogsAC, setIsDialogSelectedAC, setMessagesAC } from "../../../redux/dialogs-reducer";
import { connect } from 'react-redux';
import { useHttp } from '../../../hooks/http.hook';
import toLocalDate from '../../../hooks/toLocalDate.hook';

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const DialogItem = (props) => {
    const {loading, error, request, clearError} = useHttp();
    const [dialogsLastMsg, setDialogsLastMsg] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [extra, setExtra] = useState({});

    useEffect(() => {
        props.extra.forEach(el => {
            if (el.id !== props.user._id) {
                setExtra(el);
            }
        });
        
        return () =>  props.setIsDialogSelected(false);
    }, []);

    const getLastMessage = async () => {
        try {
            const data = await request(`/api/chats/get/lastMessage?id=${props.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            setDialogsLastMsg(data);
            setIsLoaded(true);
        } catch(err) {console.log(err)}
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
                participantId: extra.id,
                chatId: props.id
            });
            props.setIsDialogSelected(true);
        } catch(err) {console.log(err)}
    }

    return (
        <>
            {isLoaded &&
            <div onClick={selectedDialog} className='dialogItem'>
                <div className='dialogItem__info'>
                    <div className='dialogItem__info-avatar'><Avatar src={extra.profileImg}/></div>
                    <div className='dialogItem__info-main'>
                        <div><h1>{props.name || extra.displayName}</h1></div>
                        <span className='dialogItem__info-message'>{dialogsLastMsg.owner.displayName}: {dialogsLastMsg.message}</span>
                    </div>
                    <div className="timeStamp">
                        <div>{toLocalDate(parseInt(dialogsLastMsg.timestamp)).date}</div>
                        <div>{toLocalDate(parseInt(dialogsLastMsg.timestamp)).time}</div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

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