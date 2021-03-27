import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
// import ProfileInfo from "./ProfileInfo/ProfileInfo";
// import MyPostsContainer from "./MyPosts/MyPostsContainer";
import './Profile.scss';

const Profile = (props) => {
    const {error, request, clearError} = useHttp();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [myPosts, setMyPosts] = useState([]);

    useEffect(async () => {
        const data = await request('/api/posts/get/myposts', 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });
        setMyPosts(data.posts)
    }, []);

    const postDetails = async () => {
        const formData = new FormData();
        formData.append('file', image);
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
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='profile-page'>
            <div className='profile__info'>
                <div>
                    <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5952bfa6-4594-4d7c-bee6-0b5a3988a099/dapn32z-2a11b870-38b2-4caf-ba16-5bbe9a84fe7f.png/v1/fill/w_200,h_200,strp/moonlight_deer___200x200_pixelart_by_fluffzee_dapn32z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0yMDAiLCJwYXRoIjoiXC9mXC81OTUyYmZhNi00NTk0LTRkN2MtYmVlNi0wYjVhMzk4OGEwOTlcL2RhcG4zMnotMmExMWI4NzAtMzhiMi00Y2FmLWJhMTYtNWJiZTlhODRmZTdmLnBuZyIsIndpZHRoIjoiPD0yMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.nf-qh5IpeWu7UCzndssg2ee6_hETzDEAjAQ8cmU0JXE" alt="" />
                </div> 
                <div>
                    <h4>{props.user.displayName}</h4>
                    <div className='profile__info-attributes'>
                        <h5>40 posts</h5>
                        <h5>30 followers</h5>
                        <h5>40 following</h5>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsCreatePostOpen(true)}>Add new post</button>
            {isCreatePostOpen && <>
                <div className='newPostWindow'>
                    <div className='closeWindow' onClick={() => setIsCreatePostOpen(false)}>Close</div>
                    <div className='newPostBody'>
                        <span>Title</span>
                        <input type='text' placeholder='Enter title' value={title} onChange={e => setTitle(e.target.value)} />
                        <span>Description</span>
                        <input type='text' placeholder='Enter Description' value={body} onChange={e => setBody(e.target.value)}/>
                        <span>Upload image</span>
                        <input type='file' onChange={e => setImage(e.target.files[0])}/>
                        <button onClick={postDetails}>Submit</button>
                    </div>
                </div>
            </>}
            <div className='profile__gallery'>
                {myPosts.map(post => <img src={post.picture} alt=""/>)}
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

// let mapDispatchToProps = (dispatch) => {
//     return {
//         setDialogs: (dialogs) => {
//             dispatch(setDialogsAC(dialogs));
//         }
//     }
// }

export default connect(mapStateToProps)(Profile);