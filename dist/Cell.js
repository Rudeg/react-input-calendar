var React = require('react');
var moment = require('moment-range');

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        value: React.PropTypes.string,
        classes: React.PropTypes.string
    },

    render: function () {
        var prop = this.props;
        prop.classes += ' cell';

        return (
            React.createElement("div", {className: prop.classes}, prop.value)
        );
    }

});
