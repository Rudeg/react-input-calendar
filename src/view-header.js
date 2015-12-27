import React from 'react'

module.exports = React.createClass({

    propTypes: {
        next: React.PropTypes.func,
        prev: React.PropTypes.func,
        titleAction: React.PropTypes.func,
        data: React.PropTypes.string
    },

    render: function () {
        let prop = this.props

        return (
            <div className="navigation-wrapper">
                <span className="icon" onClick={prop.prev} ><i className="fa fa-angle-left"></i></span>
                <span className="navigation-title" onClick={prop.titleAction} >{prop.data}</span>
                <span className="icon" onClick={prop.next} ><i className="fa fa-angle-right"></i></span>
            </div>
        );
    }

});
