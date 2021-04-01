import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Slider from '../../components/Slider/Slider';
import { useHttp } from '../../hooks/http.hook';
import './HomePage.scss';
import PostItem from './PostItem';
import Spinner from '../../components/Spinner/Spinner';

const HomePage = (props) => {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const {error, request, clearError} = useHttp();

    useEffect(async () => {
        const data = await request('/api/posts/get/posts', 'GET', null, {
            Authorization: `Bearer ${props.token}`,
        });
        setAllPosts(data.posts)
        setLoading(false)
    }, []);

    return (
        <div className='home-page'>
            {loading && <Spinner/>}
            {/* <div className='element'>
                <Slider imgWidth={1200} imgHeight={500}/>
            </div> */}
            <div className='home-page__inner'>
                {allPosts.map(post => <PostItem post={post} key={post._id}/>)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    token: state.auth.token
});

export default connect(mapStateToProps)(HomePage);