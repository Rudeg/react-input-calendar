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
                {prop.fastPrev && <span onClick={ev => {prop.fastPrev();ev.preventDefault()}} className="icon" style={{paddingRight: '4px'}}>&#10094;&#10094;</span>}
                <span onClick={ev => {prop.prev();ev.preventDefault()}} className="icon" >&#10094;</span>
                <span onClick={ev => {prop.titleAction();ev.preventDefault()}} className="navigation-title" >{prop.data}</span>
                <span onClick={ev => {prop.next();ev.preventDefault()}} className="icon" >&#10095;</span>
                {prop.fastNext && <span onClick={ev => {prop.fastNext();ev.preventDefault()}} className="icon" style={{paddingLeft: '4px'}}>&#10095;&#10095;</span>}
            </div>
        );
    }

});
