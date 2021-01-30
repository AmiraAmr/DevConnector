import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({ education: { school, degree, fieldOfStudy, from, to, description } }) =>
    <div>
        <h3 className="text-dark">{school}</h3>
        <p>
            <Moment format='YYYY/MM/DD'>{from}</Moment> - {!to ? 'Now' : <Moment>{to}</Moment>}
        </p>
        <p><strong>Degree: </strong>{degree}</p>
        <p><strong>Field of study: </strong>{fieldOfStudy}</p>
        {
            description &&
            (<p><strong>Description: </strong><span>{description}</span></p>)
        }
    </div>

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired //passed in when we use the component is components/profile/profile.js
}

export default ProfileEducation