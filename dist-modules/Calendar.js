'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _dayView = require('./day-view');

var _dayView2 = _interopRequireDefault(_dayView);

var _monthView = require('./month-view');

var _monthView2 = _interopRequireDefault(_monthView);

var _yearView = require('./year-view');

var _yearView2 = _interopRequireDefault(_yearView);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    propTypes: {
        closeOnSelect: _react2['default'].PropTypes.bool,
        computableFormat: _react2['default'].PropTypes.string,
        date: _react2['default'].PropTypes.any,
        minDate: _react2['default'].PropTypes.any,
        maxDate: _react2['default'].PropTypes.any,
        format: _react2['default'].PropTypes.string,
        inputFieldId: _react2['default'].PropTypes.string,
        inputFieldClass: _react2['default'].PropTypes.string,
        minView: _react2['default'].PropTypes.number,
        onBlur: _react2['default'].PropTypes.func,
        onChange: _react2['default'].PropTypes.func,
        placeholder: _react2['default'].PropTypes.string,
        hideTouchKeyboard: _react2['default'].PropTypes.bool,
        hideIcon: _react2['default'].PropTypes.bool
    },

    getInitialState: function getInitialState() {
        var date = this.props.date ? (0, _moment2['default'])(_util2['default'].toDate(this.props.date)) : null,
            minDate = this.props.minDate ? (0, _moment2['default'])(_util2['default'].toDate(this.props.minDate)) : null,
            maxDate = this.props.maxDate ? (0, _moment2['default'])(_util2['default'].toDate(this.props.maxDate)) : null,
            inputFieldId = this.props.inputFieldId ? this.props.inputFieldId : null,
            inputFieldClass = this.props.inputFieldClass ? this.props.inputFieldClass : 'input-calendar-value',
            format = this.props.format || 'MM-DD-YYYY',
            minView = parseInt(this.props.minView, 10) || 0,
            computableFormat = this.props.computableFormat || 'MM-DD-YYYY';

        return {
            date: date,
            minDate: minDate,
            maxDate: maxDate,
            format: format,
            computableFormat: computableFormat,
            inputValue: date ? date.format(format) : null,
            views: ['days', 'months', 'years'],
            minView: minView,
            currentView: minView || 0,
            isVisible: false
        };
    },

    componentDidMount: function componentDidMount() {
        document.addEventListener('click', this.documentClick);
    },

    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('click', this.documentClick);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState({
            date: nextProps.date ? (0, _moment2['default'])(_util2['default'].toDate(nextProps.date)) : this.state.date,
            inputValue: nextProps.date ? (0, _moment2['default'])(_util2['default'].toDate(nextProps.date)).format(this.state.format) : null
        });
    },

    keyDown: function keyDown(e) {
        _util2['default'].keyDownActions.call(this, e.keyCode);
    },

    checkIfDateDisabled: function checkIfDateDisabled(date) {
        if (this.state.minDate && date.isBefore(this.state.minDate)) {
            return true;
        }
        if (this.state.maxDate && date.isAfter(this.state.maxDate)) {
            return true;
        }
        return false;
    },

    nextView: function nextView() {
        if (this.checkIfDateDisabled(this.state.date)) return;
        this.setState({ currentView: ++this.state.currentView });
    },

    prevView: function prevView(date) {
        if (this.state.minDate && date.isBefore(this.state.minDate)) {
            date = this.state.minDate.clone();
        }

        if (this.state.maxDate && date.isAfter(this.state.maxDate)) {
            date = this.state.maxDate.clone();
        }

        if (this.state.currentView === this.state.minView) {
            this.setState({
                date: date,
                inputValue: date.format(this.state.format),
                isVisible: false
            });

            if (this.props.onChange) {
                this.props.onChange(date.format(this.state.computableFormat));
            }
        } else {
            this.setState({
                date: date,
                currentView: --this.state.currentView
            });
        }
    },

    setDate: function setDate(date, isDayView) {
        if (this.checkIfDateDisabled(date)) return;

        this.setState({
            date: date,
            inputValue: date.format(this.state.format),
            isVisible: this.props.closeOnSelect && isDayView ? !this.state.isVisible : this.state.isVisible
        });

        if (this.props.onChange) {
            this.props.onChange(date.format(this.state.computableFormat));
        }
    },

    changeDate: function changeDate(e) {
        this.setState({ inputValue: e.target.value });
    },

    inputBlur: function inputBlur(e) {
        var date = this.state.inputValue,
            newDate = null,
            computableDate = null,
            format = this.state.format;

        if (date) {
            // format, with strict parsing true, so we catch bad dates
            newDate = (0, _moment2['default'])(date, format, true);
            // if the new date didn't match our format, see if the native
            // js date can parse it
            if (!newDate.isValid()) {
                var d = new Date(date);
                // if native js cannot parse, just make a new date
                if (isNaN(d.getTime())) {
                    d = new Date();
                }
                newDate = (0, _moment2['default'])(d);
            }

            computableDate = newDate.format(this.state.computableFormat);
        }

        this.setState({
            date: newDate,
            inputValue: newDate ? newDate.format(format) : null
        });

        if (this.props.onChange) {
            this.props.onChange(computableDate);
        }

        if (this.props.onBlur) {
            this.props.onBlur(e, computableDate);
        }
    },

    //small hack for hide calendar
    isCalendar: false,

    documentClick: function documentClick() {
        if (!this.isCalendar) {
            this.setVisibility(false);
        }
        this.isCalendar = false;
    },

    calendarClick: function calendarClick() {
        this.isCalendar = true;
    },

    todayClick: function todayClick() {
        var today = (0, _moment2['default'])().startOf('day');

        if (this.checkIfDateDisabled(today)) return;

        this.setState({
            date: today,
            inputValue: today.format(this.state.format),
            currentView: this.state.minView
        });

        if (this.props.onChange) {
            this.props.onChange(today.format(this.state.computableFormat));
        }
    },

    toggleClick: function toggleClick() {
        this.isCalendar = true;
        this.setVisibility();
    },

    setVisibility: function setVisibility(val) {
        var value = val !== undefined ? val : !this.state.isVisible,
            eventMethod = value ? 'addEventListener' : 'removeEventListener';

        document[eventMethod]('keydown', this.keyDown);

        if (this.state.isVisible !== value) {
            this.setState({ isVisible: value });
        }
    },

    render: function render() {
        // its ok for this.state.date to be null, but we should never
        // pass null for the date into the calendar pop up, as we want
        // it to just start on todays date if there is no date set
        var calendarDate = this.state.date || (0, _moment2['default'])(),
            view = undefined;

        switch (this.state.currentView) {
            case 0:
                view = _react2['default'].createElement(_dayView2['default'], {
                    date: calendarDate,
                    nextView: this.nextView,
                    maxDate: this.state.maxDate,
                    minDate: this.state.minDate,
                    setDate: this.setDate });
                break;
            case 1:
                view = _react2['default'].createElement(_monthView2['default'], { date: calendarDate,
                    nextView: this.nextView,
                    maxDate: this.state.maxDate,
                    minDate: this.state.minDate,
                    prevView: this.prevView,
                    setDate: this.setDate
                });
                break;
            case 2:
                view = _react2['default'].createElement(_yearView2['default'], { date: calendarDate,
                    maxDate: this.state.maxDate,
                    minDate: this.state.minDate,
                    prevView: this.prevView,
                    setDate: this.setDate });
                break;
        }

        let todayText ;
        switch(_moment2['default'].locale()) {
          case 'de':
            todayText = 'Heute';
            break;
          case 'fr':
            todayText = "aujourd'hui";
            break;
          case 'nl':
            todayText = 'Heden';
            break;
          default:
            todayText = 'Heute';
        }


        // _moment2['default'].locale() === 'de' ? 'Heute' : 'Today',
            calendarClass = (0, _classnames2['default'])({
            'input-calendar-wrapper': true,
            'icon-hidden': this.props.hideIcon
        });

        var calendar = !this.state.isVisible ? '' : _react2['default'].createElement(
            'div',
            { className: calendarClass, onClick: this.calendarClick },
            view,
            _react2['default'].createElement(
                'span',
                {
                    className: 'today-btn' + (this.checkIfDateDisabled((0, _moment2['default'])().startOf('day')) ? ' disabled' : ''),
                    onClick: this.todayClick },
                todayText
            )
        );

        var iconClass = (0, _classnames2['default'])({
            'fa': true,
            'fa-calendar': !this.state.isVisible,
            'fa-calendar-o': this.state.isVisible
        }),
            readOnly = false;

        if (this.props.hideTouchKeyboard) {
            // do not break server side rendering:
            try {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    readOnly = true;
                }
            } catch (e) {}
        }

        // Do not show calendar icon if hideIcon is true
        var calendarIcon = this.props.hideIcon ? '' : _react2['default'].createElement(
            'span',
            { className: 'icon-wrapper calendar-icon', onClick: this.toggleClick },
            _react2['default'].createElement('i', { className: iconClass })
        );

        return _react2['default'].createElement(
            'div',
            { className: 'input-calendar' },
            _react2['default'].createElement('input', {
                className: this.props.inputFieldClass,
                id: this.props.inputFieldId,
                onBlur: this.inputBlur,
                onChange: this.changeDate,
                onFocus: this.props.openOnInputFocus ? this.toggleClick : '',
                placeholder: this.props.placeholder,
                readOnly: readOnly,
                type: 'text',
                value: this.state.inputValue
            }),
            calendarIcon,
            calendar
        );
    }
});
