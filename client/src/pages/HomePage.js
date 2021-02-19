import React from 'react';
import { connect } from 'react-redux';

const HomePage = (props) => {
    return (
        <div>
            <h1>Hi, choose "Dialogs" on navigation bar</h1>
        </div>
    );
};

const mapStateToProps = (state) => ({
    token: state.auth.token
});

export default connect(mapStateToProps)(HomePage);