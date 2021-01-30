import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({ experience: { company, title, from, to, description } }) =>
    <div>
        <h3 className="text-dark">{company}</h3>
        <p>
            <Moment format='YYYY/MM/DD'>{from}</Moment> - {!to ? 'Now' : <Moment>{to}</Moment>}
        </p>
        <p><strong>Position: </strong>{title}</p>
        {
            description &&
            (<p><strong>Description: </strong><span>{description}</span></p>)
        }
    </div>

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired //passed in when we use the component is components/profile/profile.js
}

export default ProfileExperience