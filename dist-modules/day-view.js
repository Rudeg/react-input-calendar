'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var DayView = (function (_React$Component) {
    _inherits(DayView, _React$Component);

    function DayView() {
        _classCallCheck(this, DayView);

        _get(Object.getPrototypeOf(DayView.prototype), 'constructor', this).call(this);
        this.cellClick = this.cellClick.bind(this);
    }

    _createClass(DayView, [{
        key: 'getDaysTitles',
        value: function getDaysTitles() {
            if (_moment2['default'].locale() === 'de') {
                return 'Mo_Di_Mi_Do_Fr_Sa_So'.split('_').map(function (item) {
                    return { val: item, label: item };
                });
            }
            return _moment2['default'].weekdaysMin().map(function (item) {
                return { val: item, label: item };
            });
        }
    }, {
        key: 'next',
        value: function next() {
            var nextDate = this.props.date.clone().add(1, 'months');
            if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
                nextDate = this.props.maxDate;
            }
            this.props.setDate(nextDate);
        }
    }, {
        key: 'prev',
        value: function prev() {
            var prevDate = this.props.date.clone().subtract(1, 'months');
            if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
                prevDate = this.props.minDate;
            }
            this.props.setDate(prevDate);
        }
    }, {
        key: 'cellClick',
        value: function cellClick(e) {
            var cell = e.target,
                date = parseInt(cell.innerHTML, 10),
                newDate = this.props.date ? this.props.date.clone() : (0, _moment2['default'])();

            if (isNaN(date)) return;

            if (cell.className.indexOf('prev') > -1) {
                newDate.subtract(1, 'months');
            } else if (cell.className.indexOf('next') > -1) {
                newDate.add(1, 'months');
            }

            newDate.date(date);
            this.props.setDate(newDate, true);
        }
    }, {
        key: 'getDays',
        value: function getDays() {
            var now = this.props.date ? this.props.date : (0, _moment2['default'])(),
                start = now.clone().startOf('month').weekday(0),
                end = now.clone().endOf('month').weekday(6),
                minDate = this.props.minDate,
                maxDate = this.props.maxDate,
                month = now.month(),
                today = (0, _moment2['default'])(),
                currDay = now.date(),
                year = now.year(),
                days = [];

            (0, _moment2['default'])().range(start, end).by('days', function (day) {
                days.push({
                    label: day.format('D'),
                    prev: day.month() < month && !(day.year() > year) || day.year() < year,
                    next: day.month() > month || day.year() > year,
                    disabled: day.isBefore(minDate) || day.isAfter(maxDate),
                    curr: day.date() === currDay && day.month() === month,
                    today: day.date() === today.date() && day.month() === today.month()
                });
            });
            return days;
        }
    }, {
        key: 'render',
        value: function render() {
            var titles = this.getDaysTitles().map(function (item, i) {
                return _react2['default'].createElement(_cell2['default'], { classes: 'day title', key: i, value: item.label });
            }),
                _class = undefined;

            var days = this.getDays().map(function (item, i) {
                _class = (0, _classnames2['default'])({
                    'day': true,
                    'next': item.next,
                    'prev': item.prev,
                    'disabled': item.disabled,
                    'current': item.curr,
                    'today': item.today
                });
                return _react2['default'].createElement(_cell2['default'], { classes: _class, key: i, value: item.label });
            });

            var currentDate = this.props.date ? this.props.date.format('MMMM') : (0, _moment2['default'])().format('MMMM');

            return _react2['default'].createElement(
                'div',
                { className: 'view days-view', onKeyDown: this.keyDown },
                _react2['default'].createElement(_viewHeader2['default'], {
                    data: currentDate,
                    next: this.next,
                    prev: this.prev,
                    titleAction: this.props.nextView }),
                _react2['default'].createElement(
                    'div',
                    { className: 'days-title' },
                    titles
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'days', onClick: this.cellClick },
                    days
                )
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            date: _react2['default'].PropTypes.object.isRequired,
            minDate: _react2['default'].PropTypes.any,
            maxDate: _react2['default'].PropTypes.any,
            setDate: _react2['default'].PropTypes.func,
            nextView: _react2['default'].PropTypes.func
        },
        enumerable: true
    }]);

    return DayView;
})(_react2['default'].Component);

exports['default'] = DayView;
module.exports = exports['default'];