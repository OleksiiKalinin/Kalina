import React from 'react';

const PostItem = ({post}) => {
    return (
        <div className='element'>
            <div className='card'>
                <h5>{post.owner.displayName}</h5>
                <div className='card-image'>
                    <img src={post.picture} alt=""/>
                </div>
                <div className='card-content'>
                    <div className='favo'></div>
                    <h6>{post.title}</h6>
                    <p>{post.body}</p>
                    <input type='text' placeholder='add a comment'/>
                </div>
            </div>
        </div>
    );
};

export default PostItem;