import React from 'react';
import { connect } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import { logoutAC } from '../../redux/auth-reducer';
import './Header.scss';

const Header = (props) => {
    const {logout} = props;
    const history = useHistory();

    const logoutHandler = (e) => {
        e.preventDefault();
        logout(); 
        history.push('/');
    };

    return (
        <header className='header'>
            <span className="label"><Link to="/"><big>Kalina</big></Link></span>
            <div className="navigation">
                <Link to="/">Home</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/dialogs">Dialogs</Link>
                <Link to="/users">Users</Link>
                <Link to="/" onClick={logoutHandler}>Log out</Link>
            </div>
        </header>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logoutAC());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);