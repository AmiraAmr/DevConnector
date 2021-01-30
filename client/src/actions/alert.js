import { v4 as uuid } from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

// dispatching 
// we are able to write "(params) => dispatch" because of using thunk middleware 
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid(); //creating a random id
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout) // wait 5 seconds then remove the alert viewed on the screen
} 