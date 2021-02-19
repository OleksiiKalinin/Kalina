import React from 'react';
import { connect } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import { logoutAC } from '../../redux/auth-reducer';
import './Header.css';

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
            <span className="label"><Link to="/"><big>Kalina chats</big></Link></span>
            <ul className="navigation">
                <li><Link to="/dialogs">Dialogs</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/" onClick={logoutHandler}>Log out</Link></li>
            </ul>
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