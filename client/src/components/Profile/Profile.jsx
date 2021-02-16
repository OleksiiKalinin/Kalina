import React from 'react';
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import MyPostsContainer from "./MyPosts/MyPostsContainer";
import './Profile.css';

const Profile = (props) => {
    return (
        <div className='profile'>
            <div className='profile__inner'>
                <ProfileInfo profile={props.profile} />
                <MyPostsContainer />
            </div>
        </div>
    )
}

export default Profile;