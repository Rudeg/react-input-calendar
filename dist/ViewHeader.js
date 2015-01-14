var React = require('react');

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        next: React.PropTypes.func,
        prev: React.PropTypes.func,
        titleAction: React.PropTypes.func,
        data: React.PropTypes.string
    },

    render: function () {
        var prop = this.props;

        return (
            React.createElement("div", {className: "navigation-wrapper"}, 
                React.createElement("span", {onClick: prop.prev, className: "icon"}, React.createElement("i", {className: "fa fa-angle-left"})), 
                React.createElement("span", {onClick: prop.titleAction, className: "navigation-title"}, prop.data), 
                React.createElement("span", {onClick: prop.next, className: "icon"}, React.createElement("i", {className: "fa fa-angle-right"}))
            )
        );
    }

});
