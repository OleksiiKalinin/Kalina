import React from 'react';
import { connect } from 'react-redux';
import Slider from '../components/Slider/Slider';
import './HomePage.scss';

const HomePage = (props) => {
    return (
        <>
            <div className='element'>
                <Slider/>
            </div>
            <div className='element'>
                <div>There will be posts your followings</div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    token: state.auth.token
});

export default connect(mapStateToProps)(HomePage);