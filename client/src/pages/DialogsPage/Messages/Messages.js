import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import React, { useEffect, useState } from 'react';
import './Messages.scss';
import Pusher from 'pusher-js';
import MessageItem from './MessageItem';
import { useHttp } from '../../../hooks/http.hook';
import btnBack from '../../../assets/images/arrowback.svg';

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
        try {
            const block = document.querySelector('.messages__body');
            block.scrollTop = block.scrollHeight;
        } catch{}
    }

    const onNewMessageChange = (e) => {
        let body = e.target.value;
        setNewMessage(body);
    }

    useEffect(() => {
        window.addEventListener('resize', () => fixScroll());

        return () => window.removeEventListener('resize', () => fixScroll());
    }, [])

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
            } catch {}
        });

        fixScroll();

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [props.chat.chatId]);

    const toggleChat = () => {props.setIsDialogSelected(false)}

    return (
        <div className='messages'>
            <div className='messages__header'>
                <div className='btnBack' onClick={toggleChat}><svg  xmlns="http://www.w3.org/2000/svg"><line x1="2" x2="30" y1="15" y2="15" stroke="black" strokeWidth="3"/><line x1="0" x2="15" y1="15" y2="10" stroke="black" strokeWidth="3"/><line x1="0" x2="15" y1="15" y2="20" stroke="black" strokeWidth="3"/></svg></div>
                <Avatar />
                <div className='messages__headerInfo'>
                    <h3>{props.chat.chatName}</h3>
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
                { props.messages.map( message => <MessageItem userName={props.user.displayName} message={message} key={message._id} /> ) }
            </div>
            <div className='messages__footer'>
                <InsertEmoticon className='emoji'/>
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