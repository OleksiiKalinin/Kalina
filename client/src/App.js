import React from 'react';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import Header from "./components/Header/Header";
import { connect } from 'react-redux';
import { useRoutes } from './routes';

const App = (props) => {
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
    token: state.auth.token
});

export default connect(mapStateToProps)(App);