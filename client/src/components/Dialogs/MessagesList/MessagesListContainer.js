import {sendMessageCreator, setChatAC, setMessagesAC} from "../../../redux/dialogs-reducer";
import MessagesList from "./MessagesList";
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList);
