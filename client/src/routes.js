import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Dialogs from './components/Dialogs/Dialogs/Dialogs';
import ProfileContainer from './components/Profile/ProfileContainer';
import UsersContainer from './components/Users/UsersContainer';
import AuthPage from './pages/AuthPage';

export const useRoutes = (isAuthenticates) => {
    if (isAuthenticates) {
        return (
            <Switch>
                <Route exact path='/dialogs' component={Dialogs}/>
                <Route exact path='/profile/:userId?' render={ () => <ProfileContainer /> }/>
                <Route exact path='/users' render={ () => <UsersContainer /> }/>
                {/* <Redirect to="/"/> */}
            </Switch>
        )
    }

    return <Route path="/" exact component={AuthPage} />
}