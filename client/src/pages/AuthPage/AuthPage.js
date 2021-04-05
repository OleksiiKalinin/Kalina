import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { loginAC } from '../../redux/auth-reducer';
import Spinner from '../../components/Spinner/Spinner';
import './AuthPage.scss';

const AuthPage = (props) => {
    const {login} = props;
    const {error, request, clearError} = useHttp();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        displayName: '',
        password: ''
    });
    const [isRegistrateForm, setIsRegistrateForm] = useState(false);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('storageName'));
        
        if (data && data.token) {
            login(data.token, data.user);
        }
    }, [login])

    const changeHandler = e => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const registerHandler = async () => {
        try {
            setLoading(true);
            const register = await request('/api/auth/register', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            setLoading(false);
            changeFormHandler();
        } catch (err) {
            alert(err.message);
            setLoading(false);
        }
    }

    const loginHandler = async () => {
        try {
            setLoading(true);
            const data = await request('/api/auth/login', 'POST', {...form}, {Authorization: `Bearer ${props.token}`});
            
            login(data.token, data.user);
        } catch (err) {
            alert(err.message);
            setLoading(false);
        }
    }

    const changeFormHandler = () => {
        setIsRegistrateForm(!isRegistrateForm);
    }
    
    return (
        <>
            {loading ?
                <Spinner />
                :
                <div className='split-screen'>
                    <div className='left'>
                        <section className='copy'>
                            <h1>Kalina</h1>
                            <p>Text for the beauty.</p>
                        </section>
                    </div>
                    <div className='right'>
                        <form>
                            <section className='copy'>
                                <h2>Sign {isRegistrateForm ? 'up' : 'in'}</h2>
                                <div className='login-container'>
                                    {isRegistrateForm ?
                                        <p>Already have an account? <a onClick={changeFormHandler}><strong>Sign in!</strong></a></p>
                                        :
                                        <p>Don't have an account? <a onClick={changeFormHandler}><strong>Sign up!</strong></a></p>
                                    }
                                </div>
                            </section>
                            {isRegistrateForm && <div className='input-container name'>
                                <label htmlFor='displayName'>Nickname</label>
                                <input 
                                    name="displayName"
                                    id="displayName" 
                                    type="text"
                                    value={form.displayName}
                                    onChange={changeHandler}
                                    required/>
                            </div>}
                            <div className='input-container email'>
                                <label htmlFor='email'>Email</label>
                                <input 
                                    name="email"
                                    id="email" 
                                    type="email" 
                                    value={form.email}
                                    onChange={changeHandler}
                                    required/>
                            </div>
                            <div className='input-container password'>
                                <label htmlFor='password'>Password</label>
                                <input 
                                    name="password"
                                    id="password" 
                                    type="password" 
                                    value={form.password}
                                    onChange={changeHandler}
                                    placeholder='At least 6 characters!' 
                                    required/>
                                <i className='far fa-eye-slash' />
                            </div>
                            {isRegistrateForm ?
                                <button className='signup-btn' type='submit' onClick={registerHandler}>Sign up</button>
                                :
                                <button className='signup-btn' type='submit' onClick={loginHandler}>Sign in</button>
                            }
                            <section className='copy legal'>
                                <p>
                                    <span className='small'>
                                        By continuing, you agree to accept our <br/><a>Privacy Policy</a> & <a>Terms of Service</a>.
                                    </span>
                                </p>
                            </section>
                        </form>
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