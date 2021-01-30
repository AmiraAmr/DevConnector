import React, { Fragment, useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createProfile, getCurrentProfile } from '../../actions/profile'

const EditProfile = ({ profile: { profile, loading }, createProfile, getCurrentProfile, history }) => {
    const [formData, setFormData] = useState({
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername: '',
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: ''
    })

    const [dispalySocialInputs, toggleSocialInputs] = useState(false)

    useEffect(() => {
        getCurrentProfile();

        setFormData({
            company: loading || !profile.company ? '' : profile.company,
            website: loading || !profile.website ? '' : profile.website,
            location: loading || !profile.location ? '' : profile.location,
            status: loading || !profile.status ? '' : profile.status,
            skills: loading || !profile.skills ? '' : profile.skills.join(','),
            githubusername: loading || !profile.githubusername ? '' : profile.githubusername,
            bio: loading || !profile.bio ? '' : profile.bio,
            twitter: loading || !profile.social ? '' : profile.social.twitter,
            facebook: loading || !profile.social ? '' : profile.social.facebook,
            linkedin: loading || !profile.social ? '' : profile.social.linkedin,
            youtube: loading || !profile.social ? '' : profile.social.youtube,
            instagram: loading || !profile.social ? '' : profile.social.instagram
        })

    }, [loading, getCurrentProfile])

    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }) //the name defaultValue    is the name of the input type

    const onSubmit = e => {
        e.preventDefault()
        createProfile(formData, history, true) // the edit param is set to true
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Edit Your Profile
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i> Let's get some information to make your
                profile stand out
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <select name="status" value={status} onChange={e => {
                        console.log(e.target.value, "SELECT STATUS")
                        onChange(e)
                    }}>
                        <option value="0">* Select Professional Status </option>
                        <option value="Developer">Developer</option>
                        <option value="Junior Developer">Junior Developer</option>
                        <option value="Senior Developer">Senior Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="Student or Learning">Student or Learning</option>
                        <option value="Instructor">Instructor or Teacher</option>
                        <option value="Intern">Intern</option>
                        <option value="Other">Other</option>
                    </select>
                    <small className="form-text">Give us an idea of where you are at in your career</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Company" name="company" defaultValue={company} onChange={e => onChange(e)} />
                    <small className="form-text">Could be your own company or one you work for</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Website" name="website" defaultValue={website} onChange={e => onChange(e)} />
                    <small className="form-text">Could be your own or a company website</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Location" name="location" defaultValue={location} onChange={e => onChange(e)} />
                    <small className="form-text">City and state suggested (eg. Boston, MA)</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Skills" name="skills" defaultValue={skills} onChange={e => onChange(e)} />
                    <small className="form-text">Please use comma separated defaultValue s (eg.
                    HTML,CSS,JavaScript,PHP)</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        defaultValue={githubusername}
                        onChange={e => onChange(e)}
                    />
                    <small className="form-text">If you want your latest repos and a Github link, include your
                    username</small>
                </div>
                <div className="form-group">
                    <textarea placeholder="A short bio of yourself" name="bio" defaultValue={bio} onChange={e => onChange(e)}></textarea>
                    <small className="form-text">Tell us a little about yourself</small>
                </div>

                <div className="my-2">
                    <button type="button" className="btn btn-light" onClick={() => toggleSocialInputs(!dispalySocialInputs)}>
                        Add Social Network Links
                </button>
                    <span>Optional</span>
                </div>
                {/* // If the displaySocialInputs is true then the Fragment will be shown */}
                {dispalySocialInputs &&
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x"></i>
                            <input type="text" placeholder="Twitter URL" name="twitter" defaultValue={twitter} onChange={e => onChange(e)} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x"></i>
                            <input type="text" placeholder="Facebook URL" name="facebook" defaultValue={facebook} onChange={e => onChange(e)} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-youtube fa-2x"></i>
                            <input type="text" placeholder="YouTube URL" name="youtube" defaultValue={youtube} onChange={e => onChange(e)} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-linkedin fa-2x"></i>
                            <input type="text" placeholder="Linkedin URL" name="linkedin" defaultValue={linkedin} onChange={e => onChange(e)} />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x"></i>
                            <input type="text" placeholder="Instagram URL" name="instagram" defaultValue={instagram} onChange={e => onChange(e)} />
                        </div>
                    </Fragment>
                }


                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}

EditProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile)) // usig withRouter so we can pass the history to use it to redirect (this part is in actions/profile)