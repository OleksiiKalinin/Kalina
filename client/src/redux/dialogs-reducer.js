let initialState = {
    dialogs: [],
    messages: [],
    chat: {},
    isDialogChose: false
};

const dialogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SEND_MESSAGE':
            return {
                ...state
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                newMessageBody: '',
                messages: action.messages
            };
        case 'SET_DIALOGS':
            return {
                ...state,
                dialogs: action.dialogs
            };
        case 'SET_CHAT':
            return {
                ...state,
                chat: action.chat
            };
        case 'SET_IS_DIALOG_CHOSEN':
            return {
                ...state,
                isDialogChose: true
        };
        default:
            return state;
    }
}

export const sendMessageCreator = () => ({type: 'SEND_MESSAGE'});
export const setMessagesAC = (messages) => ({type: 'SET_MESSAGES', messages});
export const setDialogsAC = (dialogs) => ({type: 'SET_DIALOGS', dialogs});
export const setChatAC = (chat) => ({type: 'SET_CHAT', chat});
export const setIsDialogChoseAC = () => ({type: 'SET_IS_DIALOG_CHOSEN'});

export default dialogsReducer;