import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { useHttp } from '../../hooks/http.hook';
import './Users.scss';

const Users = (props) => {
    const {request} = useHttp();
    const [searchUsers, setSearchUsers] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [foundUsers, setFoundUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(async () => {
        try{
            setIsLoading(true);
            const users = await request('/api/users/get/users', 'GET', null, {Authorization: `Bearer ${props.token}`});
            setAllUsers(users);
            setIsLoading(false);
        } catch (err) {console.log(err)}
    }, []);

    useEffect(async () => {
        if (searchUsers) {
            try{
                setIsLoading(true);
                const users = await request('/api/users/post/users-search', 'POST', {query: searchUsers}, {Authorization: `Bearer ${props.token}`});
                setFoundUsers(users);
                setIsLoading(false);
            } catch (err) {console.log(err)}
        } else {
            setFoundUsers([]);
        }
    }, [searchUsers]);

    return (
        <div className='users-page'>
            <div className="search-user">
                <i className="material-icons" style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>search</i>
                <input type="text" placeholder="Search..." className="search-input" value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)}/>
                </div>
                {
                    foundUsers.length !== 0 ?
                    <div className="dropdown-content">
                        {foundUsers.map(user => {
                            return (
                                <Link to={props.user._id !== user._id ? '/profile/' + user._id : '/profile'} 
                                    key={user._id} 
                                    onClick={() => setSearchUsers('')}>
                                        <div>
                                            <Avatar src={user.profileImg}/>
                                            <p>{user.displayName}</p>
                                        </div>
                                </Link>
                            )
                        })}
                    </div> 
                    :
                    <div className="dropdown-content">
                        {allUsers.map(user => {
                            return (
                                <Link to={props.user._id !== user._id ? '/profile/' + user._id : '/profile'} 
                                    key={user._id} 
                                    onClick={() => setSearchUsers('')}>
                                        <div>
                                            <Avatar src={user.profileImg}/>
                                            <p>{user.displayName}</p>
                                        </div>
                                </Link>
                            )
                        })}
                    </div> 
                }
                {isLoading && <Spinner />}
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Users);