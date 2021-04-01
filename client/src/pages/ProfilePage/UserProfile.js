import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import Spinner from '../../components/Spinner/Spinner';
import './Profile.scss';
import { Avatar } from '@material-ui/core';
import userPhoto from '../../assets/images/user.png'

const Profile = (props) => {
    const {error, request, clearError} = useHttp(); 
    const [userProfile, setUserProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const {userId} = useParams();

    useEffect(async () => {
        const data = await request(`/api/users/get/user/${userId}`, 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });
        setUserProfile(data)
        console.log(data)
        setIsFollowing(data.user.followers.includes(props.user._id));
    }, []);

    const followUser = async () => {
        const data = await request(`/api/users/put/follow`, 'PUT', {followId: userId}, {
            Authorization: `Bearer ${props.token}`,
        }); 
        
        setUserProfile(prev => {
            prev.user.followers.push('');
            return prev;
        });

        setIsFollowing(true);
    }

    const unfollowUser = async () => {
        const data = await request(`/api/users/put/unfollow`, 'PUT', {unfollowId: userId}, {
            Authorization: `Bearer ${props.token}`,
        }); 
        
        setUserProfile(prev => {
            prev.user.followers.pop();
            return prev;
        });

        setIsFollowing(false);
    }

    const sendMessage = async () => {
        const chatName = 'prompt';
        const firstMsg = 'Hello';

        // if(chatName && firstMsg) {
            try {
                let chatId = '';

                const data = await request('/api/chats/new/conversation', 'POST', {chatName, other: userId}, {Authorization: `Bearer ${props.token}`});

                chatId = data._id

                await request(`/api/chats/new/message?id=${chatId}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now()
                }, {Authorization: `Bearer ${props.token}`});
            } catch(err) {console.log(err)}
        // }
    }
    
    return(
        <>
        {
            !userProfile ?
            <Spinner />
            :
            <div className='profile-page'>
                <div className='profile__info'>
                    <div>
                        <Avatar src={userProfile.profileImg || userPhoto}/>                    </div> 
                    <div>
                        <h4>{userProfile.user.displayName}</h4>
                        <div className='profile__info-attributes'>
                            <h5>{userProfile.posts.length} posts</h5>
                            <h5>{userProfile.user.followers.length} followers</h5>
                            <h5>{userProfile.user.following.length} following</h5>
                        </div>
                        {
                            isFollowing ? 
                            <button onClick={unfollowUser}>Unfollow</button>
                            :
                            <button onClick={followUser}>Follow</button>
                        }
                        
                        <button onClick={sendMessage}>Send hello message</button>
                    </div>
                </div>
                <div className='profile__gallery'>
                    {userProfile.posts.map(post => <img key={post._id} src={post.picture} alt=""/>)}
                </div>
            </div>
        }
        </>        
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
}

// let mapDispatchToProps = (dispatch) => {
//     return {
//         setDialogs: (dialogs) => {
//             dispatch(setDialogsAC(dialogs));
//         }
//     }
// }

export default connect(mapStateToProps)(Profile);