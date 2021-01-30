// A function that taken a token, if it is there added to the header and if not delete it

import axios from 'axios'

const setAuthToken = token => {
    //when we have a token we send it with each request instead of choosing which request to send it with
    if (token) {
        // it will come from local storage
        axios.defaults.headers.common['x-auth-token'] = token //setting the header
    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;