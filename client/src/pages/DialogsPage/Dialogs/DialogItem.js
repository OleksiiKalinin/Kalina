import React, { useEffect, useState } from 'react';
import './DialogItem.scss';
import { Avatar } from '@material-ui/core';
import Pusher from 'pusher-js';
import { setChatAC, setDialogsAC, setIsDialogSelectedAC, setIsDialogsLoadingAC, setMessagesAC } from "../../../redux/dialogs-reducer";
import { connect } from 'react-redux';
import { useHttp } from '../../../hooks/http.hook';
import toLocalDate from '../../../hooks/toLocalDate.hook';

const pusher = new Pusher('private :)', {
    cluster: 'eu'
});

const DialogItem = (props) => {
    const {dialog, index} = props;
    const {request} = useHttp();
    const [dialogsLastMsg, setDialogsLastMsg] = useState({});
    const [extra, setExtra] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
            const data = await request(`/api/chats/get/lastMessage?id=${dialog.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            setDialogsLastMsg(data);
            setIsLoading(false);

            if (index) props.setIsDialogsLoading(false);
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
    }, [dialog.id]);

    const selectedDialog = async () => {
        try {
            const data = await request(`/api/chats/get/conversation?id=${dialog.id}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
            props.setMessages(data.conversation);
            props.setChat({
                chatName: extra.displayName || data.chatName,
                chatImg: extra.profileImg || data.chatImg,
                participantId: extra.id,
                chatId: dialog.id
            });
            props.setIsDialogSelected(true);
        } catch(err) {console.log(err)}
    }

    return (
        <>
        {
            !isLoading &&
            <div onClick={selectedDialog} className='dialogItem'>
                <div className='dialogItem__info'>
                    <div className='dialogItem__info-avatar'><Avatar src={extra.profileImg}/></div>
                    <div className='dialogItem__info-main'>
                        <div><h1>{dialog.name || extra.displayName}</h1></div>
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
        isDialogsLoading: state.dialogsPage.isDialogsLoading,
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
        },
        setIsDialogsLoading: (a) => {
            dispatch(setIsDialogsLoadingAC(a))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogItem);
