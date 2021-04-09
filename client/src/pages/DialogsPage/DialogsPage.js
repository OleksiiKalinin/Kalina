import React from 'react';
import './DialogsPage.scss';
import Dialogs from './Dialogs/Dialogs';
import Messages from './Messages/Messages';
import { connect } from 'react-redux';
 
const DialogsPage = (props) => {
    return (
        <div className='dialogs-page'>
            <Dialogs />
            {!props.isDialogSelected ? 
                <div className='chooseChat'>Choose a chat</div> 
                : 
                <Messages />
            }
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        isDialogSelected: state.dialogsPage.isDialogSelected
    }
}

export default connect(mapStateToProps)(DialogsPage);