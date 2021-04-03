import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
// import ProfileInfo from "./ProfileInfo/ProfileInfo";
// import MyPostsContainer from "./MyPosts/MyPostsContainer";
import './Profile.scss';
import Spinner from '../../components/Spinner/Spinner';
import userPhoto from '../../assets/images/user.png';
import Jimp from 'jimp';


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
    const [profileImgParams, setProfileImgParams] = useState(null);
    
    useEffect(async () => {
        const data = await request('/api/posts/get/myposts', 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });
        const newfollowData = await request('/api/users/get/myfollowdata', 'GET', null, {
            Authorization: `Bearer ${props.token}`
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
            setFollowData(newfollowData);
            setMyPosts(data.posts)
        });

        new Promise(function(resolve, reject) {
            let img = document.createElement('img');
            img.src = props.user.profileImg;
            img.onload = () => { 
                setProfileImgParams(() => {
                    if (img.width > img.height)
                    return {height: '100%', minWidth: '100%'} 
                    else if (img.width < img.height)
                    return {width: '100%', minHeight: '100%'}
                    else return {height: '100%', width: '100%'}
                })
                
                resolve();
            };
        })
        
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
                        <img style={profileImgParams} onClick={() => setIsChangingProfileImage(true)} src={props.user.profileImg || userPhoto} alt=''/>
                    </div> 
                    <div className='info'>
                        <div className='name-settings'>
                            <h1>{props.user.displayName}</h1>
                            <button>Settings</button>
                            <button onClick={() => setIsCreatePostOpen(true)}>New post</button>
                        </div>
                        <div className='attributes'>
                            <h3><strong>{myPosts.length}</strong> posts</h3>
                            <h3><strong>{followData.followers.length}</strong> followers</h3>
                            <h3><strong>{followData.following.length}</strong> following</h3>
                        </div>
                    </div>
                </div>
                
                <div className='profile__gallery'>
                {/* <i onClick={deletePost} className={"material-icons"} style={{fontSize: '30px', cursor: 'pointer', float: 'right'}}>delete</i> */}
                {myPosts.map((post, i) => <div key={post._id}><div><img src={post.picture} alt=""  style={post.params}/></div></div>)}
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