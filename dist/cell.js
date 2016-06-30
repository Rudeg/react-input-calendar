'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Cell;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Cell(_ref) {
  var value = _ref.value;
  var classes = _ref.classes;

  var _classes = classes + ' cell';
  return _react2.default.createElement(
    'div',
    { className: _classes },
    value
  );
}