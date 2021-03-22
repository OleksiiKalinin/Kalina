import React from 'react';
import './App.scss';
import {BrowserRouter as Router, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import { connect } from 'react-redux';
import { useRoutes } from './routes';
// import Spinner from './components/Spinner/spinner';
import { loginAC } from './redux/auth-reducer';

const App = (props) => {
    const data = JSON.parse(sessionStorage.getItem('storageName'));
        
    if (data && data.token) {
        props.login(data.token, data.user);
    }

    const isAuthenticated = !!props.token;
    const routes = useRoutes(isAuthenticated);

    return (
        <Router>
            <div className='white-line'></div>
            <div className='app'>
                {isAuthenticated && <Header />}
                <div className='app-wrapper'> 
                    {routes}
                </div>
            </div>
        </Router>
    )
}

const mapStateToProps = (state) => ({
    token: state.auth.token
});

let mapDispatchToProps = (dispatch) => {
    return {
        login: (token, user) => {
            dispatch(loginAC(token, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);