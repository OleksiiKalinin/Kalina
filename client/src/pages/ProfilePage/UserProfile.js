import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import Spinner from '../../components/Spinner/Spinner';
import PostItem from '../HomePage/PostItem';
import imgParams from '../../hooks/imgParams.hook';
import './Profile.scss';

const Profile = (props) => {
    const {error, request, clearError} = useHttp(); 
    const [userProfile, setUserProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const [profileImgParams, setProfileImgParams] = useState(null);
    const {userId} = useParams();
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(async () => {
        const data = await request(`/api/users/get/user/${userId}`, 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });

        imgParams(data.posts).then(posts => {
            setUserProfile({posts, user: data.user});
            setIsFollowing(data.user.followers.includes(props.user._id));
        });
    }, []);

    useEffect(() => {
        if (userProfile) {
            imgParams(userProfile.user.profileImg).then(params => {
                setProfileImgParams(params);
            });
        }
    }, [userProfile])

    const followUser = async () => {
        await request(`/api/users/put/follow`, 'PUT', {followId: userId}, {
            Authorization: `Bearer ${props.token}`,
        }); 
        
        setUserProfile(prev => {
            prev.user.followers.push('');
            return prev;
        });

        setIsFollowing(true);
    }

    const unfollowUser = async () => {
        await request(`/api/users/put/unfollow`, 'PUT', {unfollowId: userId}, {
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

        if(chatName && firstMsg) {
            try {
                let chatId = '';

                const data = await request('/api/chats/new/conversation', 'POST', {chatName, other: userId}, {Authorization: `Bearer ${props.token}`});

                chatId = data._id

                await request(`/api/chats/new/message?id=${chatId}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now()
                }, {Authorization: `Bearer ${props.token}`});
            } catch(err) {console.log(err)}
        }
    }
    
    return(
        <>
        {
            !userProfile ?
            <Spinner />
            :
            <div className='profile-page'>
                <div className='profile__info'>
                    <div className='avatar'>
                        <img style={profileImgParams} src={userProfile.user.profileImg} alt=''/>
                    </div> 
                    <div className='info'>
                        <div className='name-settings'>
                            <h1>{userProfile.user.displayName}</h1>
                            <div className='btn-wrapper'>
                                {
                                    isFollowing ? 
                                    <button onClick={unfollowUser}>Unfollow</button>
                                    :
                                    <button onClick={followUser}>Follow</button>
                                }
                                <button onClick={sendMessage}>Send message</button>
                            </div>
                        </div>
                        <div className='attributes'>
                            <h3><strong>{userProfile.posts.length}</strong> posts</h3>
                            <h3><strong>{userProfile.user.followers.length}</strong> followers</h3>
                            <h3><strong>{userProfile.user.following.length}</strong> following</h3>
                        </div>
                    </div>
                </div>
                <div className='mobile-attributes'>
                    <h3><strong>{userProfile.posts.length}</strong> posts</h3>
                    <h3><strong>{userProfile.user.followers.length}</strong> followers</h3>
                    <h3><strong>{userProfile.user.following.length}</strong> following</h3>
                </div>
                <div className='profile__gallery'>
                {/* <i onClick={deletePost} className={"material-icons"} style={{fontSize: '30px', cursor: 'pointer', float: 'right'}}>delete</i> */}
                {userProfile.posts.map(post => <div onClick={() => {setSelectedPost(post); setIsPostDetailOpen(true)}} key={post._id}><div><img src={post.picture} alt=""  style={post.params}/></div></div>)}
                </div>
                {(selectedPost && isPostDetailOpen) && <>
                    <div onClick={() => setIsPostDetailOpen(false)} className='modal-window__close'></div>
                    <div className='modal-window'>
                        <i onClick={() => setIsPostDetailOpen(false)} className={"material-icons close-btn"}>clear</i>
                        <PostItem post={selectedPost} />
                    </div>
                </>}
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