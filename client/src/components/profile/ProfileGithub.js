import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getGithubRepos } from '../../actions/profile'

const ProfileGithub = ({ username, getGithubRepos, repos, profile: { error } }) => {
    // console.log("The error is " + error.status);

    useEffect(() => {
        getGithubRepos(username)
    }, [getGithubRepos])

    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">Github Repos</h2>
            {
                repos === null || error.status == '404' ?
                    (<h4>No Repos or no user found</h4>) :
                    (repos.map(repo => (
                        <div key={repo._id} className="repo bg-white p-1 my-1">
                            <div>
                                <h4>
                                    <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>{repo.name}</a>
                                </h4>
                                <p>{repo.description}</p>
                            </div>
                        </div>
                    )))
            }
        </div>
    )


}

ProfileGithub.propTypes = {
    repos: PropTypes.array.isRequired,
    // error: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    getGithubRepos: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    repos: state.profile.repos,
    profile: state.profile
})

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub)