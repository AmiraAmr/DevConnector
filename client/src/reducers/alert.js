import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = []


// A reducer takes an action and sends a state to the component depending on the action
export default function (state = initialState, action) {
    const { type, payload } = action //destrucuring --> payload instead of action.payload

    switch (type) {
        case SET_ALERT:
            return [...state, payload]; //to make sure if there is already an alert in the state so as to add this to it
        // payload is the data will be in the initial state we can access it by for example action.payload.msg
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload); // in this case the payload will just be the id
        default:
            return state;
    }
}