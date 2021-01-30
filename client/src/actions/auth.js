import axios from 'axios'
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS, REGISTER_FAIL,
    USER_LOADED, AUTH_ERROR,
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT,
    CLEAR_PROFILE
} from './types'
import setAuthToken from '../utils/setAuthToken'

// Load User
export const loadUser = () => async dispatch => {
    // check if there is a token or not, if there is then put it in a global header like the one we used to send it in postman as x-auth-token
    // tokens are got from local Storage
    if (localStorage.token) {
        setAuthToken(localStorage.token) //pass it to the function that will either add it to the header or delete it
    }

    try {
        const res = await axios.get('/api/auth')
        dispatch({
            type: USER_LOADED,
            payload: res.data // which will be the user
        })
    } catch (err) {
        console.log(err);

        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register User
export const register = ({ name, email, password }) => async dispatch => {
    // we are sending data
    const config = {
        //Those which we tested in postman
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password })

    try {
        const res = await axios.post('/api/users', body, config) //post request with api as we added the proxy (axios) and adding the parameters to add a user

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // the data we got back which is the token
        })

        dispatch(loadUser())

    } catch (err) {
        const errors = err.response.data.errors // it is an array in the data called errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) //making a loop to go through the errors array and print each as an alert message separatly
        }
        dispatch({
            type: REGISTER_FAIL
        })

    }
}

// Login User
export const login = (email, password) => async dispatch => {
    // we are sending data
    const config = {
        //Those which we tested in postman
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password })

    try {
        const res = await axios.post('/api/auth', body, config) //post request with api as we added the proxy (axios) and adding the parameters to log in the user

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data // the data we got back which is the token
        })

        dispatch(loadUser())

    } catch (err) {
        const errors = err.response.data.errors // array in the data called errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) //making a loop to go through the errors array and print each as an alert message separatly
        }
        dispatch({
            type: LOGIN_FAIL
        })

    }
}

// Logout / Clear profile
export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    })

}