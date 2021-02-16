import React, { useEffect } from 'react';
// import ChatIcon from '@material-ui/icons/Chat';
// import DonutLargeIcon from '@material-ui/icons/DonutLarge';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import "./DialogsList.css";
// import { IconButton, Avatar } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import DialogItem from './DialogItem';
import { Button } from '@material-ui/core';
import Pusher from 'pusher-js';
import { useHttp } from '../../../hooks/http.hook';
import { setDialogsAC } from '../../../redux/dialogs-reducer';
import { connect } from 'react-redux';

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const DialogsList = (props) => {    
    const {loading, error, request, clearError} = useHttp();

    const getDialogs = async () => {
        try {
            const data = await request('/api/chats/get/conversations', 'GET', null, {
                Authorization: `Bearer ${props.token}`,
            });
            props.setDialogs(data);
        } catch {console.log(1)}
    }

    useEffect(() => {
        getDialogs();
        
        const channel = pusher.subscribe('chats');
        channel.bind('newChat', () => {
            getDialogs();
        });
    }, []);

    const addNewChat = async (e) => {
        e.preventDefault();
        const chatName = prompt('Enter a chat name');
        const firstMsg = prompt('Send a welcome message');

        if(chatName && firstMsg) {
            try {
                let chatId = '';

                const data = await request('/api/chats/new/conversation', 'POST', {chatName}, {Authorization: `Bearer ${props.token}`});

                chatId = data._id

                await request(`/api/chats/new/message?id=${chatId}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now(),
                    user: props.user
                }, {Authorization: `Bearer ${props.token}`});
            } catch {console.log(1)}
        }
    }
    
    return (
        <div className='dialogs'>
            <div className='dialogs__header'>
                {/* <Avatar src=''/> 
                <div className='dialogs__headerRight'>
                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div> */}
                <Button onClick={addNewChat}>Add a new chat</Button>
            </div>
            <div className='dialogs__search'>
                <div className='dialogs__searchContainer'>
                    <SearchOutlined/>
                    <input placeholder='Search or start new chat' type='text' />
                </div>
            </div>
            <div className='dialogs__items'>
                {props.dialogs.map(dialog => <DialogItem name={dialog.name} key={dialog.id} id={dialog.id} timestamp={dialog.timestamp}/> )} 
            </div>
        </div>
    )  
}

let mapStateToProps = (state) => {
    return {
        dialogs: state.dialogsPage.dialogs,
        user: state.auth.user,
        token: state.auth.token
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setDialogs: (dialogs) => {
            dispatch(setDialogsAC(dialogs));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsList);