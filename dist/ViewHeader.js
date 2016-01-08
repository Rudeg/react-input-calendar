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
                prop.fastPrev && React.createElement("span", {onClick: function(ev)  {prop.fastPrev();ev.preventDefault()}, className: "icon", style: {paddingRight: '4px'}}, "❮❮"), 
                React.createElement("span", {onClick: function(ev)  {prop.prev();ev.preventDefault()}, className: "icon"}, "❮"), 
                React.createElement("span", {onClick: function(ev)  {prop.titleAction();ev.preventDefault()}, className: "navigation-title"}, prop.data), 
                React.createElement("span", {onClick: function(ev)  {prop.next();ev.preventDefault()}, className: "icon"}, "❯"), 
                prop.fastNext && React.createElement("span", {onClick: function(ev)  {prop.fastNext();ev.preventDefault()}, className: "icon", style: {paddingLeft: '4px'}}, "❯❯")
            )
        );
    }

});
