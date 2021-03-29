import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Link } from 'react-router-dom';

const PostItem = ({post, token, user}) => {
    const {loading, error, request, clearError} = useHttp();
    const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
    const [isLoaded, setIsLoaded] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState('');

    useEffect(async () => {
        if (isLoaded) {
            const data = await request(`/api/posts/put/${isLiked ? 'like' : 'unlike'}`, 'PUT', {postId: post._id}, {Authorization: `Bearer ${token}`});
            setLikesCount(data.likes.length);
        }
    }, [isLiked]);

    const likeHandler = () => {
        setIsLoaded(true);
        setIsLiked(!isLiked);
    }
    
    const newCommentHandler = async () => {
        const data = await request(`/api/posts/put/comment`, 'PUT', {postId: post._id, text: newComment}, {Authorization: `Bearer ${token}`});
        setComments(data.comments);
        setNewComment('');
    }

    return (
        <div className='element'>
            <div className='card'>
                <h5><Link to={user._id !== post.owner._id ? '/profile/' + post.owner._id : '/profile'}>{post.owner.displayName}</Link></h5>
                <div className='card-image'>
                    <img src={post.picture} alt=""/>
                </div>
                <div className='card-content'>
                    <i onClick={likeHandler} className={"material-icons"} style={{fontSize: '40px', cursor: 'pointer'}}>{isLiked ? 'favorite' : 'favorite_border'}</i>
                    <h6>{likesCount} likes</h6>
                    <p>{post.body}</p>
                    <small><strong>Comments</strong></small>
                    {comments.map(item => <div key={item._id}>{item.owner.displayName + ': ' + item.text}</div>)}
                    <input value={newComment} onChange={(e) => setNewComment(e.target.value)} type='text' placeholder='add a comment'/>
                    <button onClick={newCommentHandler}>Send comment</button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    token: state.auth.token,
    user: state.auth.user,
});

export default connect(mapStateToProps)(PostItem);