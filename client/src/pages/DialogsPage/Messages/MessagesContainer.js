import {sendMessageCreator, setChatAC, setIsDialogSelectedAC, setMessagesAC} from "../../../redux/dialogs-reducer";
import MessagesList from "./Messages";
import {connect} from "react-redux";

let mapStateToProps = (state) => {
    return {
        messages: state.dialogsPage.messages,
        chat: state.dialogsPage.chat,
        user: state.auth.user,
        token: state.auth.token
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: () => {
            dispatch(sendMessageCreator());
        },
        setMessages: (messages) => {
            dispatch(setMessagesAC(messages));
        },
        setChat: chat => {
            dispatch(setChatAC(chat))
        },
        setIsDialogSelected: (a) => {
            dispatch(setIsDialogSelectedAC(a))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList);
