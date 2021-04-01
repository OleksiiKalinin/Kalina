import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DialogsPage from './pages/DialogsPage/DialogsPage';
import ProfilePage from './pages/ProfilePage/Profile';
import UserProfile from './pages/ProfilePage/UserProfile';
import UsersPage from './pages/UsersPage/Users';
import HomePage from './pages/HomePage/HomePage';

export const useRoutes = () => {
    return (
        <Switch>
            <Route path='/dialogs' component={DialogsPage}/>
            <Route exact path='/profile' render={ () => <ProfilePage /> }/>
            <Route exact path='/profile/:userId' render={ () => <UserProfile /> }/>
            <Route exact path='/users' render={ () => <UsersPage /> }/>
            <Route exact path="/" component={HomePage}/>
        </Switch>
    )
}
