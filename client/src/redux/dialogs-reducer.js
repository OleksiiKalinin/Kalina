let initialState = {
    dialogs: [],
    messages: [],
    chat: {},
    isDialogSelected: false,
    isDialogsLoading: true
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
        case 'SET_IS_DIALOG_SELECTED':
            return {
                ...state,
                isDialogSelected: action.isDialogSelected
        };
        case 'SET_IS_DIALOGS_LOADING':
            return {
                ...state,
                isDialogsLoading: action.isDialogsLoading
        };
        default:
            return state;
    }
}

export const sendMessageCreator = () => ({type: 'SEND_MESSAGE'});
export const setMessagesAC = (messages) => ({type: 'SET_MESSAGES', messages});
export const setDialogsAC = (dialogs) => ({type: 'SET_DIALOGS', dialogs});
export const setChatAC = (chat) => ({type: 'SET_CHAT', chat});
export const setIsDialogSelectedAC = (isDialogSelected) => ({type: 'SET_IS_DIALOG_SELECTED', isDialogSelected});
export const setIsDialogsLoadingAC = (isDialogsLoading) => ({type: 'SET_IS_DIALOGS_LOADING', isDialogsLoading});

export default dialogsReducer;