import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { loginAC } from '../redux/auth-reducer';

const AuthPage = (props) => {
    const {login} = props;
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '',
        displayName: '',
        password: ''
    });
    
    useEffect(() => {
        message(error);
        clearError();
    },[error, message, clearError]);

    useEffect(() => {
        // window.M.updateTextFields();
        const data = JSON.parse(localStorage.getItem('storageName'));
        
        if (data && data.token) {
            login(data.token, data.user);
        }
    }, [])

    const changeHandler = e => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            message(data.message);
        } catch {console.log(1111)}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            login(data.token, data.user);
        } catch {console.log(1111)}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Kalina chats</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Log in</span>
                        <div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        name="email"
                                        id="email" 
                                        type="email" 
                                        className="validate"
                                        value={form.email}
                                        onChange={changeHandler}/>
                                    <label htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input
                                        name="displayName"
                                        id="displayName" 
                                        type="text" 
                                        className="validate"
                                        value={form.displayName}
                                        onChange={changeHandler}/>
                                    <label htmlFor="displayName">Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input 
                                        name="password"
                                        id="password" 
                                        type="password" 
                                        className="validate"
                                        value={form.password}
                                        onChange={changeHandler}/>
                                    <label htmlFor="password">Password</label>
                                </div>
                            </div>
                        </div>                      
                    </div>
                    <div className="card-action">
                        <button 
                            className="btn yellow darken-4" 
                            style={{marginRight: 20}}
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Log in
                        </button>
                        <button 
                            className="btn grey lighten-1 black text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Registrate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        login: (token, user) => {
            dispatch(loginAC(token, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);