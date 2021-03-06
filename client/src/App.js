import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Landing from './components/Layout/Landing'

import Routes from './components/Routing/Routes'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token) //pass it to the function that will either add it to the header or delete it
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, []) //didn't understand it, but the second param [] will make it run once when the user is mounted

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
