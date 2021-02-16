import React from 'react';
import './Message.css';

const Message = (props) => {
    return (
        <div className={`messages__item  ${props.message.user.displayName === props.userName && 'messages__receiver'}`}>
            <span className='message__name'>{props.message.user.displayName}</span>
            <div className='message'>{props.message.message}</div>
            <span className='message__timestamp'>{new Date(parseInt(props.message.timestamp)).toISOString().replace(/T/g, ' ').replace(/\..*/, '')}</span>
        </div>
    )
}

export default Message;