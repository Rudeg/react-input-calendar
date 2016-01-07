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
        date: _react2['default'].PropTypes.object.isRequired,
        minDate: _react2['default'].PropTypes.any,
        maxDate: _react2['default'].PropTypes.any
    },

    checkIfMonthDisabled: function checkIfMonthDisabled(month) {
        var now = this.props.date;

        return now.clone().month(month).endOf('month').isBefore(this.props.minDate) || now.clone().month(month).startOf('month').isAfter(this.props.maxDate);
    },

    next: function next() {
        var nextDate = this.props.date.clone().add(1, 'years');

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
            nextDate = this.props.maxDate;
        }

        this.props.setDate(nextDate);
    },

    prev: function prev() {
        var prevDate = this.props.date.clone().subtract(1, 'years');

        if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
            prevDate = this.props.minDate;
        }

        this.props.setDate(prevDate);
    },

    cellClick: function cellClick(e) {
        var month = e.target.innerHTML,
            date = this.props.date.clone().month(month);

        if (this.checkIfMonthDisabled(month)) {
            return;
        }

        this.props.prevView(date);
    },

    getMonth: function getMonth() {
        var now = this.props.date,
            month = now.month();

        return _moment2['default'].monthsShort().map((function (item, i) {
            return {
                label: item,
                disabled: this.checkIfMonthDisabled(i),
                curr: i === month
            };
        }).bind(this));
    },

    render: function render() {
        var currentDate = this.props.date.format('YYYY'),
            _class = undefined;
        var months = this.getMonth().map(function (item, i) {
            _class = (0, _classnames2['default'])({
                'month': true,
                'disabled': item.disabled,
                'current': item.curr
            });
            return _react2['default'].createElement(_cell2['default'], { classes: _class, key: i, value: item.label });
        });

        return _react2['default'].createElement(
            'div',
            { className: 'months-view' },
            _react2['default'].createElement(_viewHeader2['default'], { data: currentDate, next: this.next, prev: this.prev, titleAction: this.props.nextView }),
            _react2['default'].createElement(
                'div',
                { className: 'months', onClick: this.cellClick },
                months
            )
        );
    }

});