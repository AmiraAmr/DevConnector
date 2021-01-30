import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, ACCOUNT_DELETED } from '../actions/types'
// import { func } from '../../node_modules/@types/prop-types';

const initialState = {
    token: localStorage.getItem('token'), //the tokens will be stored in the local storage
    isAuthenticated: null, //when we make a req and the res is REGISTER_SUCCESS, and this is what we will check on
    loading: true, // once we get the data and the res we will set it to false
    user: null //when we get the user data it we will be put here
}

export default function (state = initialState, action) {
    const { type, payload } = action //destructuring
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true, //the token worked and the user is logged in
                loading: false,
                user: payload // which will includes the user's data except for the password (from the backend)
            }

        case REGISTER_SUCCESS: // we get the token back and we want the user to be loggen in
        case LOGIN_SUCCESS:
            // for both cases do the following
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }

        case AUTH_ERROR:
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
        case ACCOUNT_DELETED:
            // for those cases do the following
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }

        default:
            return state;
    }
} 