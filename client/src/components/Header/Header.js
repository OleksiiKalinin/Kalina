import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { logoutAC } from '../../redux/auth-reducer';
import userPhoto from '../../assets/images/user.png';
import './Header.scss';

const Header = (props) => {
    const {logout} = props;
    const history = useHistory();
    const {error, request, clearError} = useHttp();
    const [searchUsers, setSearchUsers] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);

    const logoutHandler = (e) => {
        e.preventDefault();
        logout(); 
        history.push('/');
    };
    
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
        <header className='header'>
            <span className="label"><Link to="/"><big>Kalina</big></Link></span>
            <div className="search-user">
                <i className="material-icons" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: 'blue'}}>search</i>
                <input type="text" placeholder="Search..." id="search-input" value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)}/>
                {
                    foundUsers.length !== 0 &&
                    <div className="dropdown-content">
                        {foundUsers.map(user => <Link to={'/profile/' + user._id}  key={user._id} onClick={() => setSearchUsers('')}><div><img style={{width: '30px'}} src={user.profileImg || userPhoto} alt='' />{user.displayName}</div></Link>)}
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