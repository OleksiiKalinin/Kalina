import React from 'react';
import './Dialogs.css';
import DialogsList from '../DialogsList/DialogsList';
import MessagesListContainer from '../MessagesList/MessagesListContainer';
import { connect } from 'react-redux';
 
const Dialogs = (props) => {
    return (
        <div className='main'>
            <DialogsList />
            {!props.isDialogChose ? <div className='chooseChat'>Choose a chat</div> : <MessagesListContainer />}
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        isDialogChose: state.dialogsPage.isDialogChose
    }
}

export default connect(mapStateToProps)(Dialogs);