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

var YearsView = function (_React$Component) {
  (0, _inherits3.default)(YearsView, _React$Component);

  function YearsView() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, YearsView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(YearsView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = { years: [] }, _this.cellClick = function (e) {
      var year = parseInt(e.target.innerHTML, 10);
      var date = _this.props.date.clone().year(year);
      if (_this.checkIfYearDisabled(date)) return;
      _this.props.prevView(date);
    }, _this.next = function () {
      var nextDate = _this.props.date.clone().add(10, 'years');
      if (_this.props.maxDate && nextDate.isAfter(_this.props.maxDate, 'day')) {
        nextDate = _this.props.maxDate;
      }
      _this.props.setDate(nextDate);
    }, _this.prev = function () {
      var prevDate = _this.props.date.clone().subtract(10, 'years');
      if (_this.props.minDate && prevDate.isBefore(_this.props.minDate, 'day')) {
        prevDate = _this.props.minDate;
      }
      _this.props.setDate(prevDate);
    }, _this.rangeCheck = function (currYear) {
      var years = _this.state.years;

      if (years.length == 0) {
        return false;
      }
      return years[0].label <= currYear && years[years.length - 1].label >= currYear;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(YearsView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.getYears();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.getYears();
    }
  }, {
    key: 'checkIfYearDisabled',
    value: function checkIfYearDisabled(year) {
      return year.clone().endOf('year').isBefore(this.props.minDate, 'day') || year.clone().startOf('year').isAfter(this.props.maxDate, 'day');
    }
  }, {
    key: 'getYears',
    value: function getYears() {
      var _this2 = this;

      var now = this.props.date;
      var start = now.clone().subtract(5, 'year');
      var end = now.clone().add(6, 'year');
      var currYear = now.year();
      var items = [];
      var inRange = this.rangeCheck(currYear);

      var years = this.state.years;


      if (years.length > 0 && inRange) {
        return years;
      }

      (0, _moment2.default)().range(start, end).by('years', function (year) {
        items.push({
          label: year.format('YYYY'),
          disabled: _this2.checkIfYearDisabled(year),
          curr: currYear === year.year()
        });
      });

      this.setState({ years: items });

      return items;
    }
  }, {
    key: 'render',
    value: function render() {
      var years = this.state.years;
      var currYear = this.props.date.year();
      var _class = void 0;

      var yearsCells = years.map(function (item, i) {
        _class = (0, _classnames2.default)({
          year: true,
          disabled: item.disabled,
          current: item.label == currYear
        });
        return _react2.default.createElement(_cell2.default, { value: item.label, classes: _class, key: i });
      });
      var currentDate = [years[0].label, years[years.length - 1].label].join('-');
      return _react2.default.createElement(
        'div',
        { className: 'years-view' },
        _react2.default.createElement(_viewHeader2.default, { data: currentDate, next: this.next, prev: this.prev }),
        _react2.default.createElement(
          'div',
          { className: 'years', onClick: this.cellClick },
          yearsCells
        )
      );
    }
  }]);
  return YearsView;
}(_react2.default.Component);

YearsView.propTypes = {
  date: _react2.default.PropTypes.object,
  minDate: _react2.default.PropTypes.any,
  maxDate: _react2.default.PropTypes.any,
  changeView: _react2.default.PropTypes.func
};
exports.default = YearsView;