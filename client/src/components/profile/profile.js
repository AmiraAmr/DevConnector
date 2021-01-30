// A user profile itself

import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from '../Layout/spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperince from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGithub from './ProfileGithub'
import { getProfileById } from '../../actions/profile'

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => { // match instead of props.match mainly
    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById])
    return (
        <Fragment>
            {
                profile === null || loading ?
                    <Spinner /> :
                    <Fragment>
                        <Link to='/profiles' className="btn btn-light">Back to profiles</Link>
                        {
                            // if those conditions are all true then the current user is the same user of the profile opened
                            auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
                            // so we want to make him able to edit his own profile
                            (<Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>)
                        }
                        <div className="profile-grid my-1">
                            <ProfileTop profile={profile} />
                            <ProfileAbout profile={profile} />
                            <div className="profile-exp bg-white p-2">
                                <h2 className="text-primary">Experience</h2>
                                {
                                    profile.experience.length > 0 ?
                                        (
                                            <Fragment>
                                                {profile.experience.map(experience => (
                                                    <ProfileExperince key={experience._id} experience={experience} />
                                                ))}
                                            </Fragment>
                                        ) :
                                        (<h4>No experience credentials</h4>)
                                }
                            </div>
                            <div className="profile-edu bg-white p-2">
                                <h2 className="text-primary">Education</h2>
                                {
                                    profile.education.length > 0 ?
                                        (
                                            <Fragment>
                                                {profile.education.map(education => (
                                                    <ProfileEducation key={education._id} education={education} />
                                                ))}
                                            </Fragment>
                                        ) :
                                        (<h4>No education credentials</h4>)
                                }
                            </div>

                            {
                                profile.githubusername && <ProfileGithub username={profile.githubusername} />
                            }
                        </div>
                    </Fragment>
            }
        </Fragment>
    )
}



Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth // in order to see if it is the current user's profile or another one so we either display an edit button or not
})
export default connect(mapStateToProps, { getProfileById })(Profile)