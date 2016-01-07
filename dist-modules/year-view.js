'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _cell = require('./cell');

var _cell2 = _interopRequireDefault(_cell);

var _viewHeader = require('./view-header');

var _viewHeader2 = _interopRequireDefault(_viewHeader);

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    propTypes: {
        date: _react2['default'].PropTypes.object,
        minDate: _react2['default'].PropTypes.any,
        maxDate: _react2['default'].PropTypes.any,
        changeView: _react2['default'].PropTypes.func
    },

    years: [],

    checkIfYearDisabled: function checkIfYearDisabled(year) {
        return year.clone().endOf('year').isBefore(this.props.minDate) || year.clone().startOf('year').isAfter(this.props.maxDate);
    },

    next: function next() {
        var nextDate = this.props.date.clone().add(10, 'years');

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
            nextDate = this.props.maxDate;
        }

        this.props.setDate(nextDate);
    },

    prev: function prev() {
        var prevDate = this.props.date.clone().subtract(10, 'years');

        if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
            prevDate = this.props.minDate;
        }

        this.props.setDate(prevDate);
    },

    rangeCheck: function rangeCheck(currYear) {
        if (this.years.length === 0) {
            return false;
        }

        return this.years[0].label <= currYear && this.years[this.years.length - 1].label >= currYear;
    },

    getYears: function getYears() {
        var now = this.props.date,
            start = now.clone().subtract(5, 'year'),
            end = now.clone().add(6, 'year'),
            currYear = now.year(),
            items = [],
            inRange = this.rangeCheck(currYear);

        if (this.years.length > 0 && inRange) {
            return this.years;
        }

        (0, _moment2['default'])().range(start, end).by('years', (function (year) {
            items.push({
                label: year.format('YYYY'),
                disabled: this.checkIfYearDisabled(year),
                curr: currYear === year.year()
            });
        }).bind(this));

        this.years = items;
        return items;
    },

    cellClick: function cellClick(e) {
        var year = parseInt(e.target.innerHTML, 10),
            date = this.props.date.clone().year(year);

        if (this.checkIfYearDisabled(date)) {
            return;
        }

        this.props.prevView(date);
    },

    render: function render() {
        var years = this.getYears(),
            currYear = this.props.date.year(),
            _class = undefined;

        var yearsCells = years.map(function (item, i) {
            _class = (0, _classnames2['default'])({
                'year': true,
                'disabled': item.disabled,
                'current': item.label == currYear
            });
            return _react2['default'].createElement(_cell2['default'], { value: item.label, classes: _class, key: i });
        });

        var currentDate = [years[0].label, years[years.length - 1].label].join('-');

        return _react2['default'].createElement(
            'div',
            { className: 'years-view' },
            _react2['default'].createElement(_viewHeader2['default'], { data: currentDate, next: this.next, prev: this.prev }),
            _react2['default'].createElement(
                'div',
                { className: 'years', onClick: this.cellClick },
                yearsCells
            )
        );
    }

});