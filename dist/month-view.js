'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MonthView = function (_React$Component) {
  (0, _inherits3.default)(MonthView, _React$Component);

  function MonthView() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, MonthView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(MonthView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.cellClick = function (e) {
      var month = e.target.innerHTML;
      if (_this.checkIfMonthDisabled(month)) return;

      var date = _this.props.date.clone().month(month);
      _this.props.prevView(date);
    }, _this.next = function () {
      var nextDate = _this.props.date.clone().add(1, 'years');
      if (_this.props.maxDate && nextDate.isAfter(_this.props.maxDate, 'day')) {
        nextDate = _this.props.maxDate;
      }
      _this.props.setDate(nextDate);
    }, _this.prev = function () {
      var prevDate = _this.props.date.clone().subtract(1, 'years');
      if (_this.props.minDate && prevDate.isBefore(_this.props.minDate, 'day')) {
        prevDate = _this.props.minDate;
      }
      _this.props.setDate(prevDate);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(MonthView, [{
    key: 'checkIfMonthDisabled',
    value: function checkIfMonthDisabled(month) {
      var now = this.props.date;
      return now.clone().month(month).endOf('month').isBefore(this.props.minDate, 'day') || now.clone().month(month).startOf('month').isAfter(this.props.maxDate, 'day');
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      var _this2 = this;

      var month = this.props.date.month();
      return _moment2.default.monthsShort().map(function (item, i) {
        return {
          label: item,
          disabled: _this2.checkIfMonthDisabled(i),
          curr: i === month
        };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var currentDate = this.props.date.format('YYYY');
      var months = this.getMonth().map(function (item, i) {
        var _class = (0, _classnames2.default)({
          month: true,
          disabled: item.disabled,
          current: item.curr
        });
        return _react2.default.createElement(_cell2.default, { classes: _class, key: i, value: item.label });
      });

      return _react2.default.createElement(
        'div',
        { className: 'months-view' },
        _react2.default.createElement(_viewHeader2.default, { data: currentDate, next: this.next, prev: this.prev, titleAction: this.props.nextView }),
        _react2.default.createElement(
          'div',
          { className: 'months', onClick: this.cellClick },
          months
        )
      );
    }
  }]);
  return MonthView;
}(_react2.default.Component);

MonthView.propTypes = {
  date: _react2.default.PropTypes.object.isRequired,
  minDate: _react2.default.PropTypes.any,
  maxDate: _react2.default.PropTypes.any
};
exports.default = MonthView;