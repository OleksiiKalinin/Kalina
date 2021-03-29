import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import Spinner from '../../components/Spinner/Spinner';
import './Profile.scss';

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
    
    return(
        <>
        {
            !userProfile ?
            <Spinner />
            :
            <div className='profile-page'>
                <div className='profile__info'>
                    <div>
                        <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5952bfa6-4594-4d7c-bee6-0b5a3988a099/dapn32z-2a11b870-38b2-4caf-ba16-5bbe9a84fe7f.png/v1/fill/w_200,h_200,strp/moonlight_deer___200x200_pixelart_by_fluffzee_dapn32z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0yMDAiLCJwYXRoIjoiXC9mXC81OTUyYmZhNi00NTk0LTRkN2MtYmVlNi0wYjVhMzk4OGEwOTlcL2RhcG4zMnotMmExMWI4NzAtMzhiMi00Y2FmLWJhMTYtNWJiZTlhODRmZTdmLnBuZyIsIndpZHRoIjoiPD0yMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.nf-qh5IpeWu7UCzndssg2ee6_hETzDEAjAQ8cmU0JXE" alt="" />
                    </div> 
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