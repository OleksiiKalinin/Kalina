import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import Spinner from '../../components/Spinner/Spinner';
import PostItem from '../HomePage/PostItem';
import imgParams from '../../hooks/imgParams.hook';
import './Profile.scss';
import { setChatAC, setDialogsAC, setIsDialogSelectedAC, setMessagesAC } from '../../redux/dialogs-reducer';

const Profile = (props) => {
    const history = useHistory();
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
        try {
            let foundChat = null;
            let extra = null; 
            const chatName = null;
            const firstMsg = 'lalal';

            const allChats = await request('/api/chats/get/conversations', 'GET', null, {
                Authorization: `Bearer ${props.token}`,
            });
            
            allChats.forEach(chat => {
                chat.extra.forEach(item => {
                    if (item.id === userId) {
                        foundChat = chat.id;
                    } 
                })
            });

            if (foundChat) {
                await request(`/api/chats/new/message?id=${foundChat}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now()
                }, {Authorization: `Bearer ${props.token}`});
            } else {
                const data = await request('/api/chats/new/conversation', 'POST', {chatName, other: userId}, {Authorization: `Bearer ${props.token}`});

                foundChat = data._id

                await request(`/api/chats/new/message?id=${foundChat}`, 'POST', {
                    message: firstMsg,
                    timestamp: Date.now()
                }, {Authorization: `Bearer ${props.token}`});
            }

            const chat = await request(`/api/chats/get/conversation?id=${foundChat}`, 'GET', null, {Authorization: `Bearer ${props.token}`});

            props.setMessages(chat.conversation);

            chat.extra.forEach(el => {
                if (el.id !== props.user._id) {
                    extra = {...el};
                }
            });

            props.setChat({
                chatName: extra.displayName || chat.chatName,
                chatImg: extra.profileImg || chat.chatImg,
                participantId: extra.id,
                chatId: props.id
            });

            props.setIsDialogSelected(true);

            history.push('/dialogs');
        } catch(err) {console.log(err)}
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
                                {/* <button onClick={sendMessage}>Send message</button> */}
                                <div className='messages__footer'>
                                    <input 
                                        // ref={inputMessage}
                                        // value={newMessage} 
                                        // onChange={e => {setNewMessage(e.target.value); setIsOpenedEmoji(false);}} 
                                        // onKeyUp={e => (e.keyCode === 13 && newMessage) ? onSendMessageClick() : false} 
                                        type='text' 
                                        placeholder='Enter your message'/>
                                    <button 
                                        // onClick={onSendMessageClick} 
                                        // disabled={!newMessage}
                                    >
                                            <i className={"material-icons"} style={{fontSize: '35px', cursor: 'pointer', width: '35px'}}>send</i></button>
                                </div>
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
        dialogs: state.dialogsPage.dialogs,
        token: state.auth.token,
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setDialogs: (dialogs) => {
            dispatch(setDialogsAC(dialogs));
        },
        setMessages: (messages) => {
            dispatch(setMessagesAC(messages));
        },
        setChat: chat => {
            dispatch(setChatAC(chat))
        },
        setIsDialogSelected: (a) => {
            dispatch(setIsDialogSelectedAC(a))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);