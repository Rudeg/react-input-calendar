var React = require('react');
var cs = React.addons.classSet;
var moment = require('moment-range');
var Cell = require('./Cell');
var ViewHeader = require('./ViewHeader');

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        date: React.PropTypes.object
    },

    next: function() {
        this.props.setDate(this.props.date.add(1, 'years'));
    },

    prev: function() {
        this.props.setDate(this.props.date.subtract(1, 'years'));
    },

    cellClick: function (e) {
        var month = e.target.innerHTML;
        var date = this.props.date.month(month);
        this.props.prevView(date);
    },

    getMonth: function () {
        var now = this.props.date,
            month = now.month();

        return moment.monthsShort().map(function (item, i) {
            return {
                label: item,
                curr: i === month
            };
        });
    },

    render: function () {
        var months = this.getMonth().map(function (item, i) {
            var _class = cs({
                'month': true,
                'current': item.curr
            });
            return React.createElement(Cell, {value: item.label, classes: _class, key: i})
        });

        var currentDate = this.props.date.format('YYYY');

        return (
            React.createElement("div", {className: "months-view"}, 
                React.createElement(ViewHeader, {
                    prev: this.prev, 
                    next: this.next, 
                    data: currentDate, 
                    titleAction: this.props.nextView}), 

                React.createElement("div", {className: "months", onClick: this.cellClick}, months)
            )
        );
    }

});
