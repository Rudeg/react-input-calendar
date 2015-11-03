var React = require('react');
var cs = require('classnames');
var moment = require('moment');
require('moment-range');
var Cell = require('./Cell');
var ViewHeader = require('./ViewHeader');

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        date: React.PropTypes.object.isRequired,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any
    },

    checkIfMonthDisabled: function (month) {
        var now = this.props.date;

        return now.clone().month(month).endOf('month').isBefore(this.props.minDate) ||
            now.clone().month(month).startOf('month').isAfter(this.props.maxDate);
    },

    next: function() {
        var nextDate = this.props.date.clone().add(1, 'years');

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
            nextDate = this.props.maxDate;
        }

        this.props.setDate(nextDate);
    },

    prev: function() {
        var prevDate = this.props.date.clone().subtract(1, 'years');

        if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
            prevDate = this.props.minDate;
        }

        this.props.setDate(prevDate);
    },

    cellClick: function (e) {
        var month = e.target.innerHTML;
        var date = this.props.date.clone().month(month);

        if (this.checkIfMonthDisabled(month)) {
            return;
        }

        this.props.prevView(date);
    },

    getMonth: function () {
        var now = this.props.date,
            month = now.month();

        return moment.monthsShort().map(function (item, i) {
            return {
                label: item,
                disabled: this.checkIfMonthDisabled(i),
                curr: i === month
            };
        }.bind(this));
    },

    render: function () {
        var months = this.getMonth().map(function (item, i) {
            var _class = cs({
                'month': true,
                'disabled': item.disabled,
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
