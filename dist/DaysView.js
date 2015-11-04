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
        maxDate: React.PropTypes.any,
        setDate: React.PropTypes.func,
        nextView: React.PropTypes.func
    },

    getDaysTitles: function () {
        if(moment.locale() === 'de') {
          return 'Mo_Di_Mi_Do_Fr_Sa_So'.split('_').map(function (item) {
              return {
                  val: item,
                  label: item
              };
          });
        }

        return moment.weekdaysMin().map(function (item) {
            return {
                val: item,
                label: item
            };
        });
    },

    next: function() {
        var nextDate = this.props.date.clone().add(1, 'months');

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
            nextDate = this.props.maxDate;
        }

        this.props.setDate(nextDate);
    },

    prev: function() {
        var prevDate = this.props.date.clone().subtract(1, 'months');

        if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
            prevDate = this.props.minDate;
        }

        this.props.setDate(prevDate);
    },

    cellClick: function (e) {
        var cell = e.target,
            date = parseInt(cell.innerHTML, 10),
            newDate = this.props.date ? this.props.date.clone() : moment();

        if (isNaN(date)) {
            return;
        }

        if (cell.className.indexOf('prev') > -1 ) {
            newDate.subtract(1, 'months');
        } else if (cell.className.indexOf('next') > -1) {
            newDate.add(1, 'months');
        }

        newDate.date(date);
        this.props.setDate(newDate, true);
    },


    getDays: function () {
        var now = this.props.date ? this.props.date : moment(),
            start = now.clone().startOf('month').weekday(0),
            end = now.clone().endOf('month').weekday(6),
            minDate = this.props.minDate,
            maxDate = this.props.maxDate,
            month = now.month(),
            today = moment(),
            currDay = now.date(),
            year = now.year(),
            days = [];

        moment()
            .range(start, end)
            .by('days', function(day) {
                days.push({
                    label: day.format('D'),
                    prev: (day.month() < month && !(day.year() > year)) || day.year() < year ,
                    next: day.month() > month || day.year() > year,
                    disabled: day.isBefore(minDate) || day.isAfter(maxDate),
                    curr: day.date() === currDay && day.month() === month,
                    today: day.date() === today.date() && day.month() === today.month()
                });
            });

        return days;
    },

    render: function () {
        var titles = this.getDaysTitles().map(function (item, i) {
            return React.createElement(Cell, {value: item.label, classes: "day title", key: i})
        });

        var days = this.getDays().map(function (item, i) {
            var _class = cs({
                'day': true,
                'next': item.next,
                'prev': item.prev,
                'disabled': item.disabled,
                'current': item.curr,
                'today': item.today
            });
            return React.createElement(Cell, {value: item.label, classes: _class, key: i})
        });

        var currentDate = this.props.date ? this.props.date.format('MMMM') : moment().format('MMMM');

        return (
            React.createElement("div", {className: "view days-view", onKeyDown: this.keyDown}, 
                React.createElement(ViewHeader, {
                    prev: this.prev, 
                    next: this.next, 
                    data: currentDate, 
                    titleAction: this.props.nextView}), 

                React.createElement("div", {className: "days-title"}, titles), 
                React.createElement("div", {className: "days", onClick: this.cellClick}, days)
            )
        );
    }

});
