var React = require('react');
var moment = require('moment');
require('moment-range');

module.exports = React.createClass({displayName: "exports",

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
