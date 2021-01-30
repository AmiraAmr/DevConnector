import React, { Fragment } from "react";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => { // destructuring auth inside the params
    const authLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/Dashboard">
                <i className="fas fa-user"></i>
                <span className="hide-sm"> Dashboard</span>
            </Link></li>
            <li><a href="#!" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> {' '} <span className="hide-sm">Logout</span>
            </a></li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    // the down condition says that if it isn't loaded then return the fragment
    // for the fragment if the user is authenticated (logged in) then show to him the authlinks, if not then show the guest links
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">
                    <i className="fas fa-code"></i> Developers Connector
                </Link>
            </h1>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)