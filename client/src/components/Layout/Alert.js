// Alert component
// The msg of the alert to be shown in the UI 
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => // distructuring --> { alerts } instead of props.alerts
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        //return this jsx for each alert
        //alerts is a list so you should have a key to get that one which is here its id
        //we made the class used in css will be chosen dynamically depending on the alertType
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ))


Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({ // mapping state to props so we can use props.alerts, we used { alerts } instead of props.alerts (distructuring)
    alerts: state.alert // alert is the reducer written in combineReducers
})

export default connect(mapStateToProps)(Alert)