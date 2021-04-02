import React, { useEffect, useRef } from 'react';
// import ChatIcon from '@material-ui/icons/Chat';
// import DonutLargeIcon from '@material-ui/icons/DonutLarge';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import "./Dialogs.scss";
// import { IconButton, Avatar } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import DialogItem from './DialogItem';
import { Button } from '@material-ui/core';
import Pusher from 'pusher-js';
import { useHttp } from '../../../hooks/http.hook';
import { setDialogsAC } from '../../../redux/dialogs-reducer';
import { connect } from 'react-redux';
import { useState } from 'react';
import Spinner from '../../../components/Spinner/Spinner';

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const DialogsList = (props) => {    
    const {error, request, clearError} = useHttp();
    const [loading, setLoading] = useState(true);
    const [searchChats, setSearchChats] = useState('');
    const dialogs = useRef(null);
    const dialogsHeader = useRef(null);
    const dialogsItems = useRef(null);

    const getDialogs = async () => {
        try {
            const data = await request('/api/chats/get/conversations', 'GET', null, {
                Authorization: `Bearer ${props.token}`,
            });
            props.setDialogs(data);
            setLoading(false);
        } catch(err) {console.log(err)}
    }
    
    useEffect(() => {
        !props.isDialogSelected ? dialogs.current.classList.add('show') : dialogs.current.classList.remove('show');
    }, [props.isDialogSelected])
    
    useEffect(() => {
        getDialogs();
        
        const channel = pusher.subscribe('chats');
        channel.bind('newChat', () => {
            getDialogs();
        });
    }, []);

    const addNewChat = async () => {
        const chatName = prompt('Enter a chat name');
        const firstMsg = prompt('Send a welcome message');

        if(chatName && firstMsg) {
            try {
                let chatId = '';

                const data = await request('/api/chats/new/conversation', 'POST', {chatName}, {Authorization: `Bearer ${props.token}`});

                chatId = data._id

                await request(`/api/chats/new/message?id=${chatId}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now()
                }, {Authorization: `Bearer ${props.token}`});
            } catch(err) {console.log(err)}
        }
    }
    
    return (
            <div ref={dialogs} className={'dialogs show'}>
                <div ref={dialogsHeader} className='dialogs__header'>
                    <div className="search-chats">
                        <i className="material-icons" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', paddingLeft: '5px'}}>search</i>
                        <input type="text" placeholder="Search the chat or start new" id="search-chats-input" value={searchChats} onChange={(e) => setSearchChats(e.target.value)}/>
                        <i onClick={addNewChat} className="material-icons" style={{position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', paddingRight: '5px'}}>add</i>
                    </div>
                </div>
                <div ref={dialogsItems} className='dialogs__items'>
                {
                    loading ? 
                    <Spinner />
                    :
                    props.dialogs.map(dialog => <DialogItem name={dialog.name} key={dialog.id} id={dialog.id} timestamp={dialog.timestamp} extra={dialog.extra}/> )
                }
                </div>
            </div>
    )  
}

let mapStateToProps = (state) => {
    return {
        dialogs: state.dialogsPage.dialogs,
        isDialogSelected: state.dialogsPage.isDialogSelected,
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