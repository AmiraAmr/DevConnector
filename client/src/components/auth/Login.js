import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'
// import axios from 'axios'

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData //destructuring of formData
    // these values are to be gotten from the values of input fields

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    //function to save the changes of the input fields to the useState
    // it takes a copy of formData elements with just changing the element that has got a change right now
    // e.target.name --> is the name (attribute) of the field which is the key to the element w need to change

    const onSubmit = async e => {
        e.preventDefault()
        login(email, password)
    }

    // Reedirecting the user to the profile
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
        // whenever the user is logged in he can't access the register nor the login pages it will redirect him to the distenation
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign in</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
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
                        minLength="6"
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Do not have an account? <Link to="/register">Ma t Sign up yasta</Link>
            </p>
        </Fragment>
    )
}

login.protoTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated // to use it to redirect the user to the profile
})

export default connect(mapStateToProps, { login })(Login)