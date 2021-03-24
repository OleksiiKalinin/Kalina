import React from 'react';
import './Dialogs.scss';
import DialogsList from '../DialogsList/DialogsList';
import MessagesListContainer from '../MessagesList/MessagesListContainer';
import { connect } from 'react-redux';
 
const Dialogs = (props) => {
    return (
        <div className='dialogs-page'>
            <DialogsList />
            {!props.isDialogSelected ? <div className='chooseChat'>Choose a chat</div> : <MessagesListContainer />}
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        isDialogSelected: state.dialogsPage.isDialogSelected
    }
}

export default connect(mapStateToProps)(Dialogs);