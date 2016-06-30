'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _keyDownViewHelper = [{
  prev: false,
  next: true,
  exit: true,
  unit: 'day',
  upDown: 7
}, {
  prev: true,
  next: true,
  unit: 'months',
  upDown: 3
}, {
  prev: true,
  next: false,
  unit: 'years',
  upDown: 3
}];

var KEYS = {
  backspace: 8,
  enter: 13,
  esc: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

exports.default = {
  toDate: function toDate(date) {
    return date instanceof Date ? date : new Date(date);
  },
  keyDownActions: function keyDownActions(code) {
    var _viewHelper = _keyDownViewHelper[this.state.currentView];
    var unit = _viewHelper.unit;

    switch (code) {
      case KEYS.left:
        this.setDate(this.state.date.subtract(1, unit));
        break;
      case KEYS.right:
        this.setDate(this.state.date.add(1, unit));
        break;
      case KEYS.up:
        this.setDate(this.state.date.subtract(_viewHelper.upDown, unit));
        break;
      case KEYS.down:
        this.setDate(this.state.date.add(_viewHelper.upDown, unit));
        break;
      case KEYS.enter:
        if (_viewHelper.prev) {
          this.prevView(this.state.date);
        }
        if (_viewHelper.exit) {
          this.setState({ isVisible: false });
        }
        break;
      case KEYS.esc:
        this.setState({ isVisible: false });
        break;
      default:
        break;
    }
  }
};