import {combineReducers, createStore} from "redux";
import dialogsReducer from "./dialogs-reducer";
import authReducer from "./auth-reducer";

const reducers = combineReducers({
    dialogsPage: dialogsReducer,
    auth: authReducer
});

const store = createStore(reducers);

export default store;