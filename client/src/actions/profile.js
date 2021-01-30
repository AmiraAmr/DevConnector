import axios from 'axios'
import { setAlert } from './alert'
import { GET_PROFILE, GET_PROFILES, GET_REPOS, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE } from './types'

//Get the currrent user's profile
export const getCurrentProfile = () => async dispatch => {
    // api/profiles/me
    // which gives the req.user.id from the backend
    try {
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....,

        })
    }
}

// Get all profiles
export const getProfiles = () => async dispatch => {

    dispatch({ type: CLEAR_PROFILE }) //to prevent the flash of past users profiles

    // api/profiles
    try {
        const res = await axios.get('/api/profile')

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
        // console.log(res.data);

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}
// Get profile by user's id not his profile's id
export const getProfileById = userId => async dispatch => {

    dispatch({ type: CLEAR_PROFILE }) //to prevent the flash of past users profiles

    // api/profiles
    try {
        const res = await axios.get(`/api/profile/user/${userId}`)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}

// Get Github repos
export const getGithubRepos = username => async dispatch => {

    // dispatch({ type: CLEAR_PROFILE }) //to prevent the flash of past users profiles

    // api/profiles
    try {
        const res = await axios.get(`/api/profile/github/${username}`)

        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }, //that returns the text of the error and the status which is 400 or 404 ....
            error: err.response.status
        })
    }
}


// Create or update a profile
export const createProfile = (formData, history, edit = false) => async dispatch => { // edit is a param to specify if the user is editing or creating, by default it is false so the user is creating
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit ? 'Profile is Updated !' : 'Profile is Created !', 'success'))

        // if the user is creating we want to redirect, if he is editing then don't redirect
        // if (!edit) { // redirect
        //     history.push('/dashboard')
        // }
        // But i prefeared to redirect anyway
        history.push('/dashboard')


    } catch (err) {
        const errors = err.response.data.errors // array in the data called errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) //making a loop to go through the errors array and print each as an alert message separatly
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })

    }
}

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience is added !', 'success'))

        // redirect
        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors // array in the data called errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) //making a loop to go through the errors array and print each as an alert message separatly
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })

    }
}
// Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education is added !', 'success'))

        // redirect
        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors // array in the data called errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))) //making a loop to go through the errors array and print each as an alert message separatly
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })

    }
}

// Delte Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience is removed !', 'success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}
// Delte Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education is removed !', 'success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}

// Delete Account and Profile
export const deleteAccount = id => async dispatch => {
    if (window.confirm('Are you sure ? This can NOT be undone')) {

    }
    try {
        await axios.delete('/api/profile')
        dispatch({
            type: CLEAR_PROFILE
        })
        dispatch({
            type: ACCOUNT_DELETED
        })
        dispatch(setAlert('Your account has been permenantly deleted !'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}
