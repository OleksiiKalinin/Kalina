import React, { useEffect, useRef } from 'react';
import DialogItem from './DialogItem';
import Pusher from 'pusher-js';
import { useHttp } from '../../../hooks/http.hook';
import { setDialogsAC, setIsDialogsLoadingAC } from '../../../redux/dialogs-reducer';
import { connect } from 'react-redux';
import { useState } from 'react';
import Spinner from '../../../components/Spinner/Spinner';
import "./Dialogs.scss";

const pusher = new Pusher('b634efb073fba40fbf3a', {
    cluster: 'eu'
});

const Dialogs = (props) => {    
    const {request} = useHttp();
    const [searchChats, setSearchChats] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const dialogs = useRef(null);
    const dialogsHeader = useRef(null);
    const dialogsItems = useRef(null);

    const getDialogs = async () => {
        try {
            const data = await request('/api/chats/get/conversations', 'GET', null, {
                Authorization: `Bearer ${props.token}`,
            });
            props.setDialogs(data);
            setIsLoading(false);
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

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            props.setIsDialogsLoading(true);
        };
    }, []);
    
    return (
            <div ref={dialogs} className={'dialogs show'}>
                <div ref={dialogsHeader} className='dialogs__header'>
                    <div className="search-chats">
                        <i className="material-icons" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', paddingLeft: '5px'}}>search</i>
                        <input type="text" placeholder="Search the chat or start new" id="search-chats-input" value={searchChats} onChange={(e) => setSearchChats(e.target.value)}/>
                        <i className="material-icons" style={{position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', paddingRight: '5px', opacity: '.5'}}>add</i>
                    </div>
                </div>
                <div ref={dialogsItems} className='dialogs__items'>
                {
                    props.isDialogsLoading && <Spinner />
                }
                {
                    !isLoading &&
                    props.dialogs.map((dialog, i) => {
                        let index = null;
                        if (i+1 === props.dialogs.length) index = i;
                        return (
                            <DialogItem index={index} dialog={dialog} key={dialog.id} extra={dialog.extra}/> 
                        )
                    })
                }
                </div>
            </div>
    )  
}

let mapStateToProps = (state) => {
    return {
        dialogs: state.dialogsPage.dialogs,
        isDialogSelected: state.dialogsPage.isDialogSelected,
        isDialogsLoading: state.dialogsPage.isDialogsLoading,
        user: state.auth.user,
        token: state.auth.token
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setDialogs: (dialogs) => {
            dispatch(setDialogsAC(dialogs));
        },
        setIsDialogsLoading: (a) => {
            dispatch(setIsDialogsLoadingAC(a))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);