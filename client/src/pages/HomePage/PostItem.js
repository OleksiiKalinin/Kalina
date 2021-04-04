import { connect } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { Link } from 'react-router-dom';
import userPhoto from '../../assets/images/user.png';
import { Avatar } from '@material-ui/core';
import Picker from 'emoji-picker-react';

const PostItem = ({post, token, user}) => {
    const {loading, error, request, clearError} = useHttp();
    const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
    const [isLoaded, setIsLoaded] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [comments, setComments] = useState(post.comments);
    const [commentsCount, setCommentsCount] = useState(post.comments.length);
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const commentsField = useRef(null);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [isOpenedEmoji, setIsOpenedEmoji] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
    };

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
        setCommentsCount(data.comments.length);
        setIsOpenedEmoji(false);
    }
    
    useEffect(() => {
        commentsField.current.classList.toggle('show-comments');
    }, [showAllComments]);

    useEffect(() => {
        setComments(comments.sort((a, b) => b.timestamp - a.timestamp));
    }, [comments]);

    useEffect(() => {
        if (chosenEmoji)
        setNewComment(prev => prev + chosenEmoji.emoji)
    }, [chosenEmoji]);

    return (
        <div className='element'>
            <div className='card'>
                <div className='card-header'>
                    <Link to={user._id !== post.owner._id ? '/profile/' + post.owner._id : '/profile'}><Avatar src={post.owner.profileImg}/><p>{post.owner.displayName}</p></Link>
                </div>
                <div className='card-image'>
                    <img src={post.picture} alt=""/>
                </div>
                <div className='card-content'>
                    <i onClick={likeHandler} className={"material-icons"} style={{fontSize: '35px', cursor: 'pointer', color: 'red'}} >{isLiked ? 'favorite' : 'favorite_border'}</i>
                    <small><strong>Likes: {likesCount}</strong></small>
                    <p><strong>{post.owner.displayName}</strong> {post.body}</p>
                    <div><strong className='show-comments-btn' onClick={() => setShowAllComments(!showAllComments)}>{!showAllComments ? 'Show' : 'Hide'} all comments ({commentsCount})</strong></div>
                    <div className={'comments show-comments'} ref={commentsField}>
                        {comments.map(item => <div key={item._id}><strong>{item.owner.displayName}</strong> {item.text}</div>)}
                    </div>
                    <div className='timestamp'>{post.createdAt}</div>
                </div>
                <div className='new-comment'>
                    {isOpenedEmoji && 
                    <div style={{position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: '1000'}}>
                        <Picker disableAutoFocus={true} onEmojiClick={onEmojiClick} />
                    </div>}
                    <i onClick={() => setIsOpenedEmoji(!isOpenedEmoji)} className={"material-icons emojicon"} style={{fontSize: '35px', cursor: 'pointer', width: '35px'}} >insert_emoticon</i>
                    <input value={newComment} onChange={e => {setNewComment(e.target.value); setIsOpenedEmoji(false);}} onKeyUp={e => (e.keyCode === 13 && newComment) ? newCommentHandler() : false} type='text' placeholder='Add a comment...'/>
                    <button onClick={newCommentHandler} disabled={!newComment}>Publish</button>
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