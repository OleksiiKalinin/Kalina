import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
// import ProfileInfo from "./ProfileInfo/ProfileInfo";
// import MyPostsContainer from "./MyPosts/MyPostsContainer";
import './Profile.scss';
import Spinner from '../../components/Spinner/Spinner';
import userPhoto from '../../assets/images/user.png';
import { Avatar } from '@material-ui/core';

const Profile = (props) => {
    const {error, request, clearError} = useHttp();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isChangingProfileImage, setIsChangingProfileImage] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [newProfileImage, setNewProfileImage] = useState('');
    const [myPosts, setMyPosts] = useState(null);
    const [followData, setFollowData] = useState(null);

    useEffect(async () => {
        try{
            const data = await request('/api/posts/get/myposts', 'GET', null, {
                Authorization: `Bearer ${props.token}`,
            });
            const newfollowData = await request('/api/users/get/myfollowdata', 'GET', null, {
                Authorization: `Bearer ${props.token}`
            });
            
            setFollowData(newfollowData);
            setMyPosts(data.posts)
        } catch(err) {console.log(err)}
    }, []);

    const setPostData = async () => {
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
            await request('/api/posts/new/post', 'POST', {title, body, picture: formData.url}, {
                Authorization: `Bearer ${props.token}`,
            });
            setIsCreatePostOpen(false)
        })
        .catch(err => console.log(err));
    };

    const changeProfileImage = async () => {
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
            setIsChangingProfileImage(false);
        })
        .catch(err => console.log(err));
    };

    const deletePost = async () => {
        const data = await request('/api/posts/delete/post/id', 'DELETE', null, {
            Authorization: `Bearer ${props.token}`,
        });
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
                        <img onClick={() => setIsChangingProfileImage(true)} src={props.user.profileImg || userPhoto} alt=''/>
                    </div> 
                    {isChangingProfileImage && <>
                        <div className='newPostWindow'>
                            <div className='newPostBody'>
                                <span>Upload image</span>
                                <input type='file' onChange={e => setNewProfileImage(e.target.files[0])}/>
                                <button onClick={changeProfileImage}>Submit</button>
                            </div>
                        </div>
                    </>}
                    <div className='info'>
                        <div className='name-settings'>
                            <h4>{props.user.displayName}</h4>
                        </div>
                        <div className='attributes'>
                            <h5>{myPosts.length} posts</h5>
                            <h5>{followData.followers.length} followers</h5>
                            <h5>{followData.following.length} following</h5>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsCreatePostOpen(true)}>Add new post</button>
                {isCreatePostOpen && <>
                    <div className='newPostWindow'>
                        <div className='newPostBody'>
                            <span>Description</span>
                            <input type='text' placeholder='Enter Description' value={body} onChange={e => setBody(e.target.value)}/>
                            <span>Upload image</span>
                            <input type='file' onChange={e => setNewPostImage(e.target.files[0])}/>
                            <button onClick={setPostData}>Submit</button>
                        </div>
                    </div>
                </>}
                <div className='profile__gallery'>
                {/* <i onClick={deletePost} className={"material-icons"} style={{fontSize: '30px', cursor: 'pointer', float: 'right'}}>delete</i> */}
                    {myPosts.map(post => <img key={post._id} src={post.picture} alt=""/>)}
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