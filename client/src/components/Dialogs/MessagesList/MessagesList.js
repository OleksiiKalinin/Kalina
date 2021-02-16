import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import React, { useEffect, useState } from 'react';
import './MessagesList.css';
import Pusher from 'pusher-js';
import Message from './Message';
import { useHttp } from '../../../hooks/http.hook';

const MessagesList = (props) => {
    const {loading, error, request, clearError} = useHttp();
    const [newMessage, setNewMessage] = useState('');
    
    const onSendMessageClick = async (e) => {
        e.preventDefault();
        try {
            await request(`/api/chats/new/message?id=${props.chat.chatId}`, 'POST', {
                message: newMessage,
                timestamp: Date.now(),
                user: props.user
            }, {Authorization: `Bearer ${props.token}`});
        } catch {console.log(1)}
        setNewMessage('');
    }

    const fixScroll = () => {
        const block = document.querySelector('.messages__body');
        block.scrollTop = block.scrollHeight;
    }

    const onNewMessageChange = (e) => {
        let body = e.target.value;
        setNewMessage(body);
    }

    useEffect(() => {
        const pusher = new Pusher('b634efb073fba40fbf3a', {
            cluster: 'eu'
        });
      
        const channel = pusher.subscribe('messages');
        channel.bind('newMessage', async () => {
            try {
                const data = await request(`/api/chats/get/conversation?id=${props.chat.chatId}`, 'GET', null, {Authorization: `Bearer ${props.token}`});
                props.setMessages(data['0'].conversation);
                fixScroll();
            } catch {console.log(1)}
        });

        fixScroll();

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [props.chat.chatId]);

    return (
        <div className='messages'>
            <div className='messages__header'>
                <Avatar />
                <div className='messages__headerInfo'>
                    <h3>{props.chat.chatName}</h3>
                    <p>Last seen at...</p>
                </div>
                <div className='messages__headerRight'>
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
            </div>
            <div className='messages__body'>
                { props.messages.map( message => <Message userName={props.user.displayName} message={message} key={message._id} /> ) }
            </div>
            <div className='messages__footer'>
                <InsertEmoticon />
                <form>
                    <input 
                        type='text'
                        value={newMessage}
                        onChange={onNewMessageChange}
                        placeholder='Enter your message'/>
                    <button 
                        type='submit'
                        onClick={onSendMessageClick}>Send</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default MessagesList;