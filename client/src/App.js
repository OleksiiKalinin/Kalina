import React, { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter as Router, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import { connect } from 'react-redux';
import { useRoutes } from './routes';
// import Spinner from './components/Spinner/spinner';
import { loginAC } from './redux/auth-reducer';

const App = (props) => {
    const data = JSON.parse(sessionStorage.getItem('storageName'));
        
    if (data && data.token) {
        props.login(data.token, props.user);
    }

    const isAuthenticated = !!props.token;
    const routes = useRoutes(isAuthenticated);

    return (
        <Router>
            <div className='root__child'>
                {isAuthenticated && <Header />}
                <div className='app-wrapper'> 
                    <div className='app-wrapper-content'>
                        {routes}
                    </div>
                </div>
            </div>
        </Router>
    )
}

const mapStateToProps = (state) => ({
    token: state.auth.token,
    user: state.auth.user
});

let mapDispatchToProps = (dispatch) => {
    return {
        login: (token, user) => {
            dispatch(loginAC(token, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);