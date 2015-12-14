var React = require('react');

module.exports = React.createClass({

    propTypes: {
        next: React.PropTypes.func,
        prev: React.PropTypes.func,
        titleAction: React.PropTypes.func,
        data: React.PropTypes.string
    },

    render: function () {
        var prop = this.props;

        return (
            <div className="navigation-wrapper">
                <span onClick={prop.prev} className="icon" >&#10092;</span>
                <span onClick={prop.titleAction} className="navigation-title" >{prop.data}</span>
                <span onClick={prop.next} className="icon" >&#10093;</span>
            </div>
        );
    }

});
