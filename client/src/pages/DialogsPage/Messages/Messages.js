import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import './Messages.scss';
import Pusher from 'pusher-js';
import MessageItem from './MessageItem';
import { useHttp } from '../../../hooks/http.hook';
import Picker from 'emoji-picker-react';

const MessagesList = (props) => {
    const {loading, error, request, clearError} = useHttp();
    const [newMessage, setNewMessage] = useState('');
    const [isOpenedEmoji, setIsOpenedEmoji] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const inputMessage = useRef(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };
    
    useEffect(() => {
        document.onmouseup = (e) => {
            inputMessage.current.focus();
            const emojiDiv = document.querySelector('.emojiDiv');
            if (!e.path.includes(emojiDiv)) {
                setIsOpenedEmoji(false);
            }
        }
        
        return () => document.onmouseup = null;
    }, [isOpenedEmoji]);
    
    const onSendMessageClick = async () => {
        setNewMessage('');
        setIsOpenedEmoji(false);
        try {
            await request(`/api/chats/new/message?id=${props.chat.chatId}`, 'POST', {
                message: newMessage,
                timestamp: Date.now()
            }, {Authorization: `Bearer ${props.token}`});
        } catch(err) {console.log(err)}
    }

    const fixScroll = () => {
        try {
            const block = document.querySelector('.messages__body');
            block.scrollTop = block.scrollHeight;
        } catch{}
    }

    useEffect(() => {
        window.addEventListener('resize', () => fixScroll());
        inputMessage.current.focus();

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
                props.setMessages(data.conversation);
                fixScroll();
            } catch {}
        });

        fixScroll();

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [props.chat.chatId]);

    useEffect(() => {
        if (chosenEmoji)
        setNewMessage(prev => prev + chosenEmoji.emoji);
    }, [chosenEmoji]);

    return (
        <div className='messages'>
            <div className='messages__header'>
                <div className="btnBack" style={{height: '50px', width: '30px'}}>
                    <i onClick={() => props.setIsDialogSelected(false)} className="material-icons" style={{fontSize: '50px', position: 'absolute', left: '-5px'}}>chevron_left</i>
                </div>
                <Avatar src={props.chat.chatImg}/>
                <div className='messages__headerInfo'>
                    <h3>{props.chat.chatName}</h3>
                </div>
                <div className='messages__headerRight'>
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    {/* <IconButton>
                        <AttachFile/>
                    </IconButton> */}
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
            </div>
            <div className='messages__body'>
                { props.messages.map( message => <MessageItem userName={props.user.displayName} message={message} key={message._id} /> ) }
            </div>
            <div className='messages__footer'>
                <i onClick={() => setIsOpenedEmoji(!isOpenedEmoji)} 
                    className={"material-icons emojicon"} 
                    style={{fontSize: '35px', cursor: 'pointer', width: '35px'}} >insert_emoticon</i>
                <input 
                    ref={inputMessage}
                    value={newMessage} 
                    onChange={e => {setNewMessage(e.target.value); setIsOpenedEmoji(false);}} 
                    onKeyUp={e => (e.keyCode === 13 && newMessage) ? onSendMessageClick() : false} 
                    type='text' 
                    placeholder='Enter your message'/>
                <button onClick={onSendMessageClick} disabled={!newMessage}><i className={"material-icons"} style={{fontSize: '35px', cursor: 'pointer', width: '35px'}}>send</i></button>
            </div>
            {isOpenedEmoji && 
            <div className='emojiDiv' style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000'}}>
                <Picker disableAutoFocus={true} onEmojiClick={onEmojiClick} />
            </div>}
        </div>
    )
}

export default MessagesList;