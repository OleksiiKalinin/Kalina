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
    const [profileImgParams, setProfileImgParams] = useState(null);
    const {userId} = useParams();

    useEffect(async () => {
        const data = await request(`/api/users/get/user/${userId}`, 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });

        new Promise(function(resolve, reject) {
            for (let i = 0; i < data.posts.length; ++i){
                let img = document.createElement('img');
                img.src=data.posts[i].picture;
                img.onload = function () { 
                    data.posts[i].params = img.width >= img.height ? 
                    {height: '100%', minWidth: '100%', width: 'none', minHeight: 'none'} 
                    : 
                    {height: 'none', minWidth: 'none', width: '100%', minHeight: '100%'}

                    if (i+1 === data.posts.length) resolve();
                };
            }
        }).then(() => {
            setUserProfile(data);
            setIsFollowing(data.user.followers.includes(props.user._id));
        });
    }, []);

    useEffect(() => {
        if (userProfile) {
            new Promise(function(resolve, reject) {
                let img = document.createElement('img');
                img.src = userProfile.user.profileImg;
                img.onload = function () { 
                    setProfileImgParams(img.width >= img.height ? 
                    {height: '100%', minWidth: '100%', width: 'none', minHeight: 'none'} 
                    : 
                    {height: 'none', minWidth: 'none', width: '100%', minHeight: '100%'}
                    )
                    resolve();
                };
            });
        }
    }, [userProfile])

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
            // <div className='profile-page'>
            //     <div className='profile__info'>
            //         <div>
            //             <Avatar src={userProfile.profileImg || userPhoto}/>                    </div> 
            //         <div>
            //             <h4>{userProfile.user.displayName}</h4>
            //             <div className='profile__info-attributes'>
            //                 <h5>{userProfile.posts.length} posts</h5>
            //                 <h5>{userProfile.user.followers.length} followers</h5>
            //                 <h5>{userProfile.user.following.length} following</h5>
            //             </div>
            //             {
            //                 isFollowing ? 
            //                 <button onClick={unfollowUser}>Unfollow</button>
            //                 :
            //                 <button onClick={followUser}>Follow</button>
            //             }
                        
            //             <button onClick={sendMessage}>Send hello message</button>
            //         </div>
            //     </div>
            //     <div className='profile__gallery'>
            //         {userProfile.posts.map(post => <img key={post._id} src={post.picture} alt=""/>)}
            //     </div>
            // </div>
            <div className='profile-page'>
                <div className='profile__info'>
                    <div className='avatar'>
                        <img style={profileImgParams} src={userProfile.user.profileImg || userPhoto} alt=''/>
                    </div> 
                    <div className='info'>
                        <div className='name-settings'>
                            <h1>{userProfile.user.displayName}</h1>
                        {
                            isFollowing ? 
                            <button onClick={unfollowUser}>Unfollow</button>
                            :
                            <button onClick={followUser}>Follow</button>
                        }
                        <button onClick={sendMessage}>Send message</button>
                        </div>
                        <div className='attributes'>
                            <h3><strong>{userProfile.posts.length}</strong> posts</h3>
                            <h3><strong>{userProfile.user.followers.length}</strong> followers</h3>
                            <h3><strong>{userProfile.user.following.length}</strong> following</h3>
                        </div>
                    </div>
                </div>
                
                <div className='profile__gallery'>
                {/* <i onClick={deletePost} className={"material-icons"} style={{fontSize: '30px', cursor: 'pointer', float: 'right'}}>delete</i> */}
                {userProfile.posts.map(post => <div key={post._id}><div><img src={post.picture} alt=""  style={post.params}/></div></div>)}
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