import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProfileItem = ({
    profile: {
        user: { _id, name, avatar }, // destructuring inside destructuring
        status,
        company,
        location,
        skills
    }
}) => {
    return (
        <div className="profile bg-light">
            <img className="round-img" src={avatar} alt="" />
            <div>
                <h2>{name}</h2>
                {/* if there is a company show it next to the status, if not doesn't do anything */}
                <p>{status} {company && <span> at {company} </span>}</p>
                <p className="my-1">{location && <span>{location}</span>}</p>
                <Link to={`/profile/${_id}`} className="btn btn-primary"> View Profile </Link>
            </div>
            <ul>
                {/* get the first 4 skills only and map on them for each skill take the index to put as its key and print the skill */}
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className="fas fa-check"></i>  {skill}
                    </li>
                )
                )}
            </ul>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileItem