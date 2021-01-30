import axios from 'axios'
import { setAlert } from './alert'
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types'

// Get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}

// Add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}
// Remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Delete Post
export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`)

        dispatch({
            type: DELETE_POST,
            payload: postId
        })
        dispatch(setAlert('Post is removed !', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}
// ADD Post
export const addPost = formData => async dispatch => {
    const config = {
        // headers: {  // wierd thing without commenting this it wasn't working !
        'Content-Type': 'application.JSON'
        // }
    }
    try {
        const res = await axios.post('/api/posts', formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post is created !', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Get a post
export const getPost = postId => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postId}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status } //that returns the text of the error and the status which is 400 or 404 ....
        })
    }
}

// ADD Comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        // headers: {
        'Content-Type': 'application.JSON'
        // }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment is added !', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}
// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Comment is removed !', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}