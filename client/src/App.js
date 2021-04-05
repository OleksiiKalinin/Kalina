import React, { createRef, forwardRef, useEffect, useRef } from 'react';
import './App.scss';
import {BrowserRouter as Router, HashRouter, Route} from "react-router-dom";
import Header from "./components/Header/Header";
import { connect } from 'react-redux';
import { useRoutes } from './routes';
// import Spinner from './components/Spinner/spinner';
import { loginAC } from './redux/auth-reducer';
import AuthPage from './pages/AuthPage/AuthPage';

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
                <Route path="/" exact component={AuthPage} />
                :
                <>
                    <div className='main'>
                        <Header />
                        <div ref={app} className='app'> 
                            <div className='WRAPPER'>
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