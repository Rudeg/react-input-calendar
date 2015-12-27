import React from 'react'
import moment from 'moment'
import 'moment-range'

module.exports = React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        classes: React.PropTypes.string
    },
    render: function () {
        let classes = this.props.classes + ' cell'
        return (
          <div className={classes}>{this.props.value}</div>
        )
    }
})
