import React from 'react';
import './DialogsPage.scss';
import DialogsList from './Dialogs/Dialogs';
import MessagesListContainer from './Messages/MessagesContainer';
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