import React, { useEffect, useRef } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Header from "./components/Header/Header";
import { connect } from 'react-redux';
import { useRoutes } from './routes';
import { loginAC } from './redux/auth-reducer';
import AuthPage from './pages/AuthPage/AuthPage';
import './App.scss';

const App = (props) => {
    const data = JSON.parse(sessionStorage.getItem('storageName'));
    const app = useRef(null);

    const isAuthenticated = !!props.token;
    const routes = useRoutes();

    if (data && data.token) {
        props.login(data.token, data.user);
    }

    useEffect(() => {
        fixOffset()
        
        window.addEventListener('resize', fixOffset);

        return () => window.removeEventListener('resize', fixOffset);
    }, [isAuthenticated]);

    function fixOffset() {
        try{
            app.current.style.height = document.body.clientHeight - (isAuthenticated ? 40 : 0) + 'px';
        } catch {}    
    }

    return (
        <Router>
            {!isAuthenticated ? 
                <Switch>
                    <Route path="/" exact component={AuthPage} />
                    <Redirect to='/' />
                </Switch>
                :
                <>
                    <div className='main'>
                        <Header />
                        <div ref={app} className='app'> 
                            <div className='app-inner'>
                                {routes}
                            </div>
                        </div>
                    </div>
                </>
            }
        </Router>
    )
}

const mapStateToProps = (state) => ({
    token: state.auth.token
});

const mapDispatchToProps = (dispatch) => {
    return {
        login: (token, user) => {
            dispatch(loginAC(token, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);