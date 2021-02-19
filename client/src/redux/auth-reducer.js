let initialState = {
    token: null,
    user: {}
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            sessionStorage.setItem('storageName', JSON.stringify({
                token: action.jwtSecret,
                user: action.user
            }));

            return {
                ...state,
                token: action.jwtSecret,
                user: action.user
            }
        case 'LOGOUT':
            sessionStorage.removeItem('storageName');

            return {
                ...state,
                token: null,
                user: {}
            }
        default:
            return state;
    }
}

export const loginAC = (jwtSecret, user) => ({type: 'LOGIN', jwtSecret, user});
export const logoutAC = () => ({type: 'LOGOUT'});
export default authReducer;