import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { logoutAC } from '../../redux/auth-reducer';
import { Avatar } from '@material-ui/core';
import './Header.scss';

const Header = (props) => {
    const {logout} = props;
    const history = useHistory();
    const {request} = useHttp();
    const [searchUsers, setSearchUsers] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);

    const logoutHandler = (e) => {
        e.preventDefault();
        logout(); 
        history.push('/');
    };

    document.onmouseup = (e) => {
        const searchUser = document.querySelector('.search-user');
        if (!e.path.includes(searchUser)) {
            setFoundUsers([]);
            setSearchUsers('');
        }
    }
    
    useEffect(async () => {
        if (searchUsers) {
            try{
                const users = await request('/api/users/post/users-search', 'POST', {query: searchUsers}, {Authorization: `Bearer ${props.token}`});
                setFoundUsers(users);
            } catch (err) {console.log(err)}
        } else {
            setFoundUsers([]);
        }
    }, [searchUsers]);

    return (
        <div className='header-wrapper'>
            <div className='header'>
                <span className="label"><Link to="/"><big>Kalina</big></Link></span>
                <div className="search-user">
                    <i className="material-icons" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>search</i>
                    <input type="text" placeholder="Search users..." id="search-input" value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)}/>
                    {
                        foundUsers.length !== 0 &&
                        <div className="dropdown-content">
                            {foundUsers.map(user => <Link to={props.user._id !== user._id ? '/profile/' + user._id : '/profile'}  key={user._id} onClick={() => setSearchUsers('')}><div><Avatar src={user.profileImg}/><p>{user.displayName}</p></div></Link>)}
                        </div> 
                    }
                </div>
                <div className="navigation">
                    <Link to="/"><i className="material-icons">home</i></Link>
                    <Link to="/profile"><i className="material-icons">person</i></Link>
                    <Link to="/dialogs"><i className="material-icons">message</i></Link>
                    <Link to="/users"><i className="material-icons">people</i></Link>
                    <Link to="/" onClick={logoutHandler}><i className="material-icons">exit_to_app</i></Link>
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
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