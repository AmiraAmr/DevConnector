import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
// import axios from 'axios'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'


const Register = ({ setAlert, register, isAuthenticated }) => { //props is of the setAlert action
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData //destructuring of formData
  // these values are to be gotten from the values of input fields

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  //function to save the changes of the input fields to the useState
  // it takes a copy of formData elements with just changing the element that has got a change right now
  // e.target.name --> is the name (attribute) of the field which is the key to the element w need to change

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Not matched passwords !', 'danger');
      // danger is the alertType (param to be passed)
      // also we have the option to enter a param of the time we want the msg to disappear after which is default 5000msec

    } else {
      register({ name, email, password }) //got from the formData
    }
  }

  // Reedirecting the user to the profile
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
    // whenever the user is logged in he can't access the register nor the login pages it will redirect him to the distenation
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}

          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}

          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}

          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}

          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Ma t Sign In yasta</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated // to use it to redirect the user to the profile
})

export default connect(mapStateToProps, { setAlert, register })(Register)
// connect takes 2 params: any state you want to map, the actions you implemented in the component