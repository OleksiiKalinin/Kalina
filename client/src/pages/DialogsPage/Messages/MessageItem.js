import React from 'react';
import toLocalDate from '../../../hooks/toLocalDate.hook';
import './MessageItem.scss';

const Message = (props) => {
    const timestamp = toLocalDate(parseInt(props.message.timestamp));
    
    return (
        <div className={`messages__item  ${props.message.owner.displayName === props.userName && 'messages__receiver'}`}>
            <span className='message__name'>{props.message.owner.displayName}</span>
            <div className='message'>{props.message.message}</div>
            <span className='message__timestamp'>{timestamp.date + ' ' + timestamp.time}</span>
        </div>
    )
}

export default Message;