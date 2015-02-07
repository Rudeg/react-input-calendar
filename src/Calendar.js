var React = require('react/addons');
var cs = React.addons.classSet;
var moment = require('moment-range');
var DaysView = require('./DaysView');
var MonthsView = require('./MonthsView');
var YearsView = require('./YearsView');
var Utils = require('./Utils');

var _keyDownActions = Utils.keyDownActions;

module.exports = React.createClass({

    propTypes: {
        closeOnSelect: React.PropTypes.bool,
        computableFormat: React.PropTypes.string,
        date: React.PropTypes.any,
        format: React.PropTypes.string,
        minView: React.PropTypes.number,
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string
    },

    getInitialState: function() {
        var date = this.props.date ? moment(this.props.date) : null,
            format = this.props.format || 'MM-DD-YYYY',
            minView = parseInt(this.props.minView, 10) || 0,
            computableFormat = this.props.computableFormat || 'MM-DD-YYYY';

        return {
            date: date,
            format: format,
            computableFormat: computableFormat,
            inputValue: date ? date.format(format) : null,
            views: ['days', 'months', 'years'],
            minView: minView,
            currentView: minView || 0,
            isVisible: false
        };
    },

    componentDidMount: function() {
        document.addEventListener('click', this.documentClick);
    },

    componentWillUnmount: function() {
        document.removeEventListener('click', this.documentClick);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            date: nextProps.date ? moment(nextProps.date) : null,
            inputValue: nextProps.date ? moment(nextProps.date).format(this.state.format) : null
        });
    },

    keyDown: function (e) {
        _keyDownActions.call(this, e.keyCode);
    },

    nextView: function () {
        this.setState({
            currentView: ++this.state.currentView
        });
    },

    prevView: function (date) {
        if (this.state.currentView === this.state.minView) {
            this.setState({
                date: date,
                inputValue: date.format(this.state.format)
            });
        } else {
            this.setState({
                date: date,
                currentView: --this.state.currentView
            });
        }
    },

    setDate: function (date, isDayView) {
        this.setState({
            date: date,
            inputValue: date.format(this.state.format),
            isVisible: this.props.closeOnSelect && isDayView ? !this.state.isVisible : this.state.isVisible
        });

        if (this.props.onChange) {
            this.props.onChange(date.format(this.state.computableFormat));
        }
    },

    changeDate: function (e) {
        this.setState({
            inputValue: e.target.value
        })
    },

    inputBlur: function () {
        var date = this.state.inputValue,
            newDate = null,
            computableDate = null,
            format = this.state.format;

        if (date) {
            // format, with strict parsing true, so we catch bad dates
            newDate = moment(date, format, true);

            // if the new date didn't match our format, see if the native
            // js date can parse it
            if (!newDate.isValid()) {
                var d = new Date(date);

                // if native js cannot parse, just make a new date
                if (isNaN(d.getTime())) {
                    d = new Date();
                }

                newDate = moment(d);
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
    },

    //small hack for hide calendar
    isCalendar: false,

    documentClick: function () {
        if (!this.isCalendar) {
            this.setVisibility(false);
        }
        this.isCalendar = false;
    },

    calendarClick: function () {
        this.isCalendar = true;
    },

    todayClick: function () {
        var today = moment();

        this.setState({
            date: today,
            inputValue: today.format(this.state.format),
            currentView: 0
        });

        if (this.props.onChange) {
            this.props.onChange(today.format(this.state.computableFormat));
        }
    },

    toogleClick: function () {
        this.isCalendar = true;
        this.setVisibility();
    },

    setVisibility: function (val) {
        var value = val !== undefined ? val : !this.state.isVisible;
        var eventMethod = value ? 'addEventListener' : 'removeEventListener';
        document[eventMethod]('keydown', this.keyDown);

        this.setState({
            isVisible: value
        });
    },

    render: function () {

        // its ok for this.state.date to be null, but we should never
        // pass null for the date into the calendar pop up, as we want
        // it to just start on todays date if there is no date set
        var calendarDate = this.state.date || moment();

        var view;
        switch (this.state.currentView) {
            case 0:
                view = <DaysView
                    date={calendarDate}
                    setDate={this.setDate}
                    nextView={this.nextView} />;
                break;
            case 1:
                view = <MonthsView
                    date={calendarDate}
                    setDate={this.setDate}
                    nextView={this.nextView}
                    prevView={this.prevView} />;
                break;
            case 2:
                view = <YearsView
                    date={calendarDate}
                    setDate={this.setDate}
                    prevView={this.prevView} />;
                break;
        }

        var calendar = !this.state.isVisible ? '' :
            <div className="input-calendar-wrapper" onClick={this.calendarClick}>
                {view}<span className="today-btn" onClick={this.todayClick} >Today</span>
            </div>;

        var iconClass = cs({
            'fa': true,
            'fa-calendar': !this.state.isVisible,
            'fa-calendar-o': this.state.isVisible
        });

        return (
            <div className="input-calendar">
                <input type="text"
                    className="input-calendar-value"
                    value={this.state.inputValue}
                    onBlur={this.inputBlur}
                    onChange={this.changeDate}
                    placeholder={this.props.placeholder} />

                <span onClick={this.toogleClick} className="icon-wrapper calendar-icon">
                    <i className={iconClass}></i>
                </span>
                {calendar}
            </div>
        );
    }

});