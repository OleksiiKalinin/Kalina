import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Dialogs from './components/Dialogs/Dialogs/Dialogs';
import ProfileContainer from './components/Profile/ProfileContainer';
import UsersContainer from './components/Users/UsersContainer';
import AuthPage from './pages/AuthPage';
import Home from './pages/HomePage';

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route  path='/dialogs' component={Dialogs}/>
                {/* <Route exact path='/profile' render={ () => <ProfileContainer /> }/> */}
                <Route exact path='/users' render={ () => <UsersContainer /> }/>
                <Route exact path="/" component={Home}/>
            </Switch>
        )
    }

    return <Route path="/" exact component={AuthPage} />
}