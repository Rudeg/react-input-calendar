import React from 'react'
import moment from 'moment'
import 'moment-range'

module.exports = React.createClass({

    propTypes: {
        value: React.PropTypes.string,
        classes: React.PropTypes.string
    },

    render: function () {
        var classes = this.props.classes + ' cell';

        return (
            React.createElement("div", {className: classes}, this.props.value)
        );
    }

});
