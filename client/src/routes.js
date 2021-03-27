import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DialogsPage from './pages/DialogsPage/DialogsPage';
import ProfilePage from './pages/ProfilePage/Profile';
import UsersPage from './pages/UsersPage/UsersContainer';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';

export const useRoutes = () => {
    return (
        <Switch>
            <Route  path='/dialogs' component={DialogsPage}/>
            <Route exact path='/profile' render={ () => <ProfilePage /> }/>
            <Route exact path='/users' render={ () => <UsersPage /> }/>
            <Route exact path="/" component={HomePage}/>
        </Switch>
    )
}
