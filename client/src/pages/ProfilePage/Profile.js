import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import './Profile.scss';
import Spinner from '../../components/Spinner/Spinner';
import { loginAC } from '../../redux/auth-reducer';
import PostItem from '../HomePage/PostItem';
import imgParams from '../../hooks/imgParams.hook';


const Profile = (props) => {
    const {error, request, clearError} = useHttp();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
    const [isChangingProfileImage, setIsChangingProfileImage] = useState(false);
    const [body, setBody] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [newProfileImage, setNewProfileImage] = useState('');
    const [myPosts, setMyPosts] = useState(null);
    const [followData, setFollowData] = useState(null);
    const [profileImgParams, setProfileImgParams] = useState(null);
    const [isChangesLoading, setIsChangesLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    
    useEffect(async () => {
        const data = await request('/api/posts/get/myposts', 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });
        
        const newfollowData = await request('/api/users/get/myfollowdata', 'GET', null, {
            Authorization: `Bearer ${props.token}`
        });

        setFollowData(newfollowData);

        imgParams(data.posts).then((data) => {
            setMyPosts(data);
        });

        imgParams(props.user.profileImg).then(params => {
            setProfileImgParams(params);
        });
    }, []);

    const setPostData = async () => {
        setIsChangesLoading(true);
        const formData = new FormData();
        formData.append('file', newPostImage);
        formData.append('upload_preset', 'kalina-why-not');
        formData.append('cloud_name', 'kalina-why-not');
        await fetch('https://api.cloudinary.com/v1_1/kalina-why-not/image/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(async formData => {
            const newPost = await request('/api/posts/new/post', 'POST', {body, picture: formData.url}, {
                Authorization: `Bearer ${props.token}`,
            });

            imgParams([newPost]).then((data) => {
                setMyPosts([data[0], ...myPosts]);
                setIsChangesLoading(false);
                setIsCreatePostOpen(false);
            });
        })
        .catch(err => console.log(err));
    };

    const changeProfileImage = async () => {
        setIsChangesLoading(true);
        const formData = new FormData();
        formData.append('file', newProfileImage);
        formData.append('upload_preset', 'kalina-why-not');
        formData.append('cloud_name', 'kalina-why-not');
        await fetch('https://api.cloudinary.com/v1_1/kalina-why-not/image/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(async formData => {
            const data = await request('/api/users/put/profileImg', 'PUT', {picture: formData.url}, {
                Authorization: `Bearer ${props.token}`,
            });
            sessionStorage.setItem('storageName', JSON.stringify({
                token: props.token, user: data
            }));
            const newData = JSON.parse(sessionStorage.getItem('storageName'));
            if (newData && newData.token) {
                props.login(newData.token, newData.user);
            }
            setIsChangesLoading(false);
            setIsChangingProfileImage(false);
        })
        .catch(err => console.log(err));
    };

    const deletePost = async (postId) => {
        setIsChangesLoading(true);
        await request(`/api/posts/delete/post/${postId}`, 'DELETE', null, {
            Authorization: `Bearer ${props.token}`,
        });
        const data = await request('/api/posts/get/myposts', 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });

        imgParams(data.posts).then(data => setMyPosts(data));

        setIsChangesLoading(false);
        setIsPostDetailOpen(false);
    }

    return (
        <>
        {
            !myPosts ? 
            <Spinner />
            :
            <div className='profile-page'>
                <div className='profile__info'>
                    <div className='avatar'>
                        <img style={profileImgParams} src={props.user.profileImg} alt=''/>
                    </div> 
                    <div className='info'>
                        <div className='name-settings'>
                            <h1>{props.user.displayName}</h1>
                            <div>
                                <i onClick={() => setIsChangingProfileImage(true)} className={"material-icons"}>settings</i>
                                <i onClick={() => setIsCreatePostOpen(true)} className={"material-icons"}>add_to_photos</i>
                            </div>
                        </div> 
                        <div className='attributes'>
                            <h3><strong>{myPosts.length}</strong> posts</h3>
                            <h3><strong>{followData.followers.length}</strong> followers</h3>
                            <h3><strong>{followData.following.length}</strong> following</h3>
                        </div>
                    </div>
                </div>
                <div className='mobile-attributes'>
                    <h3><strong>{myPosts.length}</strong> posts</h3>
                    <h3><strong>{followData.followers.length}</strong> followers</h3>
                    <h3><strong>{followData.following.length}</strong> following</h3>
                </div>
                <div className='profile__gallery'>
                {myPosts.map(post => <div onClick={() => {setSelectedPost(post); setIsPostDetailOpen(true)}} key={post._id}><div><img src={post.picture} alt=""  style={post.params}/></div></div>)}
                </div>
                
                {isChangingProfileImage && <>
                    <div onClick={() => setIsPostDetailOpen(false)} className='modal-window__close'></div>
                    <div className='modal-window'>
                        {isChangesLoading && <Spinner />}
                        <i onClick={() => setIsChangingProfileImage(false)} className={"material-icons close-btn"}>clear</i>
                        <div className='newPostBody'>
                            <h1>Account settings</h1>
                            <div>
                                <span>Upload image</span>
                                <input type='file' accept="image/jpeg,image/png,image/bmp" onChange={e => setNewProfileImage(e.target.files[0])}/>
                            </div>
                            <button onClick={changeProfileImage}>Submit</button>
                        </div>
                    </div>
                </>}
                {isCreatePostOpen && <>
                    <div onClick={() => setIsPostDetailOpen(false)} className='modal-window__close'></div>
                    <div className='modal-window'>
                        {isChangesLoading && <Spinner />}
                        <i onClick={() => setIsCreatePostOpen(false)} className={"material-icons close-btn"}>clear</i>
                        <div className='newPostBody'>
                            <span>Description</span>
                            <input type='text' placeholder='Enter Description' value={body} onChange={e => setBody(e.target.value)}/>
                            <span>Upload image</span>
                            <input type='file' accept="image/jpeg,image/png,image/bmp" onChange={e => setNewPostImage(e.target.files[0])}/>
                            <button onClick={setPostData}>Submit</button>
                        </div>
                    </div>
                </>}
                {(selectedPost && isPostDetailOpen) && 
                <>
                    <div onClick={() => setIsPostDetailOpen(false)} className='modal-window__close'></div>
                    <div className='modal-window'>
                        {isChangesLoading && <Spinner />}
                        <i onClick={() => deletePost(selectedPost._id)} className={"material-icons delete-btn"}>delete</i>
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

const mapDispatchToProps = (dispatch) => {
    return {
        login: (token, user) => {
            dispatch(loginAC(token, user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);