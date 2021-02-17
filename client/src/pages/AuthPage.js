import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { loginAC } from '../redux/auth-reducer';
import Spinner from '../components/Spinner/spinner';
import './AuthPage.css';

const AuthPage = (props) => {
    const {login} = props;
    const message = useMessage();
    const {error, request, clearError} = useHttp();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        displayName: '',
        password: ''
    });
    const [isRegistrateForm, setIsRegistrateForm] = useState(false);
    
    useEffect(() => {
        message(error);
        clearError();
    },[error, message, clearError]);

    useEffect(() => {
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
            setLoading(true);
            const register = await request('/api/auth/register', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            message(register.message);
            setLoading(false);
            changeFormHandler();
        } catch {console.log(-1)}
    }

    const loginHandler = async () => {
        try {
            setLoading(true);
            const data = await request('/api/auth/login', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            login(data.token, data.user);
        } catch {console.log(-1)}
    }

    const changeFormHandler = () => {
        setIsRegistrateForm(!isRegistrateForm);
    }
    
    return (
        <>
            {loading ?
                <Spinner />
            :
                <div className="auth-form">
                    <div className="auth-form__inner">
                        <h1>Sign In With</h1>
                        <div className='auth-form__main'>
                            <div className='auth-form__fields'>
                                <div className="auth-form__email">
                                    <input
                                        name="email"
                                        id="email" 
                                        type="email" 
                                        className="validate"
                                        value={form.email}
                                        onChange={changeHandler}
                                        placeholder='Email'
                                    />
                                </div>
                                {isRegistrateForm && <div className="auth-form__name">
                                    <input
                                        name="displayName"
                                        id="displayName" 
                                        type="text" 
                                        className="validate"
                                        value={form.displayName}
                                        onChange={changeHandler}
                                        placeholder='Name'
                                    />
                                </div> }
                                <div className="auth-form__password">
                                    <input 
                                        name="password"
                                        id="password" 
                                        type="password" 
                                        className="validate"
                                        value={form.password}
                                        onChange={changeHandler}
                                        placeholder='Password'
                                    />
                                </div>
                            </div>  
                            <div className='auth-form__btn'>
                                {!isRegistrateForm ?
                                    <button
                                        onClick={loginHandler}
                                        >
                                            Sign in
                                    </button>
                                    :
                                    <button 
                                        onClick={registerHandler}>
                                            Sign up
                                    </button>
                                }
                                {!isRegistrateForm ?
                                    <div>
                                        <p>or</p>
                                        <p>Not a member? <a onClick={changeFormHandler}>Sign up</a> now!</p>
                                    </div>
                                    :
                                    <a onClick={changeFormHandler}>&larr;Back</a>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
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