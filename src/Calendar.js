import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import DaysView from './day-view'
import MonthsView from './month-view'
import YearsView from './year-view'
import Util from './util'


module.exports = React.createClass({

    propTypes: {
        closeOnSelect: React.PropTypes.bool,
        computableFormat: React.PropTypes.string,
        strictDateParsing: React.PropTypes.bool,
        parsingFormat: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)
        ]),
        date: React.PropTypes.any,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        format: React.PropTypes.string,
        inputFieldId: React.PropTypes.string,
        inputFieldClass: React.PropTypes.string,
        minView: React.PropTypes.number,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        hideTouchKeyboard: React.PropTypes.bool,
        hideIcon: React.PropTypes.bool,
        hideOnBlur: React.PropTypes.bool,
        customIcon: React.PropTypes.string,
        todayText: React.PropTypes.string,
        disabled: React.PropTypes.bool
    },

    getInitialState: function() {
        let date = this.props.date ? moment(Util.toDate(this.props.date)) : '',
            minDate = this.props.minDate ? moment(Util.toDate(this.props.minDate)) : '',
            maxDate = this.props.maxDate ? moment(Util.toDate(this.props.maxDate)) : '',
            inputFieldId = this.props.inputFieldId ? this.props.inputFieldId : '',
            inputFieldClass = this.props.inputFieldClass ? this.props.inputFieldClass : 'input-calendar-value',
            format = this.props.format || 'MM-DD-YYYY',
            minView = parseInt(this.props.minView, 10) || 0,
            computableFormat = this.props.computableFormat || 'MM-DD-YYYY',
            strictDateParsing = this.props.strictDateParsing || false,
            parsingFormat = this.props.parsingFormat || format;

        return {
            date: date,
            minDate: minDate,
            maxDate: maxDate,
            format: format,
            computableFormat: computableFormat,
            inputValue: date ? date.format(format) : '',
            views: ['days', 'months', 'years'],
            minView: minView,
            currentView: minView || 0,
            isVisible: false,
            hideOnBlur: false,
            strictDateParsing: strictDateParsing,
            parsingFormat: parsingFormat
        }
    },

    componentDidMount: function() {
        document.addEventListener('click', this.documentClick)
    },

    componentWillUnmount: function() {
        document.removeEventListener('click', this.documentClick)
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.disabled === true) {
            this.setState({
                isVisible: false
            });
        }

        this.setState({
            date: nextProps.date ? moment(Util.toDate(nextProps.date)) : this.state.date,
            inputValue: nextProps.date ? moment(Util.toDate(nextProps.date)).format(this.state.format) : ''
        })
    },

    keyDown: function (e) {
        Util.keyDownActions.call(this, e.keyCode)
    },

    checkIfDateDisabled: function (date) {
        if (date && this.state.minDate && date.isBefore(this.state.minDate, 'day')) {
            return true
        }
        if (date && this.state.maxDate && date.isAfter(this.state.maxDate, 'day')) {
            return true
        }
        return false
    },

    nextView: function () {
        if (this.checkIfDateDisabled(this.state.date)) return
        this.setState({ currentView: ++this.state.currentView })
    },

    prevView: function (date) {
        if (this.state.minDate && date.isBefore(this.state.minDate, 'day')) {
            date = this.state.minDate.clone()
        }

        if (this.state.maxDate && date.isAfter(this.state.maxDate, 'day')) {
            date = this.state.maxDate.clone()
        }

        if (this.state.currentView === this.state.minView) {
            this.setState({
                date: date,
                inputValue: date.format(this.state.format),
                isVisible: false
            })

            if (this.props.onChange) {
                this.props.onChange(date.format(this.state.computableFormat))
            }

        } else {
            this.setState({
                date: date,
                currentView: --this.state.currentView
            })
        }
    },

    setDate: function (date, isDayView) {
        if (this.checkIfDateDisabled(date)) return

        this.setState({
            date: date,
            inputValue: date.format(this.state.format),
            isVisible: this.props.closeOnSelect && isDayView ? !this.state.isVisible : this.state.isVisible
        })

        if (this.props.onChange) {
            this.props.onChange(date.format(this.state.computableFormat))
        }
    },

    changeDate: function (e) {
      this.setState({ inputValue: e.target.value })
    },

    inputBlur: function (e) {
        let date = this.state.inputValue,
            newDate = null,
            computableDate = null,
            format = this.state.format,
            parsingFormat = this.state.parsingFormat

        if (date) {
            // format, with strict parsing true, so we catch bad dates
            newDate = moment(date, parsingFormat, true)
            // if the new date didn't match our format, see if the native
            // js date can parse it
            if (!newDate.isValid() && !this.props.strictDateParsing) {
                let d = new Date(date)
                // if native js cannot parse, just make a new date
                if (isNaN(d.getTime())) {
                    d = new Date()
                }
                newDate = moment(d)
            }

            computableDate = newDate.format(this.state.computableFormat)
        }

        this.setState({
            date: newDate,
            inputValue: newDate ? newDate.format(format) : ''
        })

        if (this.props.onChange) {
            this.props.onChange(computableDate)
        }

        if (this.props.onBlur) {
            this.state.isVisible = this.props.hideOnBlur;
            this.props.onBlur(e, computableDate)
        }

        if(this.props.hideOnBlur) {
          this.state.isVisible = !this.state.isVisible;
        }
    },

    //small hack for hide calendar
    isCalendar: false,

    documentClick: function () {
        if (!this.isCalendar) {
          this.setVisibility(false)
        }
        this.isCalendar = false
    },

    calendarClick: function () {
        this.isCalendar = true
    },

    todayClick: function () {
        let today = moment().startOf('day')

        if (this.checkIfDateDisabled(today)) return

        this.setState({
            date: today,
            inputValue: today.format(this.state.format),
            currentView: this.state.minView
        })

        if (this.props.onChange) {
          this.props.onChange(today.format(this.state.computableFormat))
        }
    },

    toggleClick: function () {
        this.isCalendar = true
        this.setVisibility()
    },

    setVisibility: function (val) {
        let value = val !== undefined ? val : !this.state.isVisible,
          eventMethod = value ? 'addEventListener' : 'removeEventListener'

        document[eventMethod]('keydown', this.keyDown)

        if (this.state.isVisible !== value && !this.props.disabled){
          this.setState({ isVisible: value })
        }
    },

    render: function () {
        // its ok for this.state.date to be null, but we should never
        // pass null for the date into the calendar pop up, as we want
        // it to just start on todays date if there is no date set
        let calendarDate = this.state.date || moment(), view

        switch (this.state.currentView) {
            case 0:
                view = <DaysView
                    date={calendarDate}
                    nextView={this.nextView}
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                    setDate={this.setDate} />
                break
            case 1:
                view = <MonthsView date={calendarDate}
                    nextView={this.nextView}
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                    prevView={this.prevView}
                    setDate={this.setDate}
                   />
                break
            case 2:
                view = <YearsView date={calendarDate}
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                    prevView={this.prevView}
                    setDate={this.setDate} />
                break
        }

        let todayText = this.props.todayText || (moment.locale() === 'de' ? 'Heute' : 'Today'),
          calendarClass = cs({
            'input-calendar-wrapper': true,
            'icon-hidden': this.props.hideIcon
          })

        let calendar = !this.state.isVisible ? '' :
            <div className={calendarClass} onClick={this.calendarClick}>
                {view}
                <span
                  className={'today-btn' + (this.checkIfDateDisabled(moment().startOf('day')) ? ' disabled' : '')}
                  onClick={this.todayClick}>
                  {todayText}
                </span>
            </div>

        let iconClass = this.props.customIcon == null ? (iconClass = cs({
            'fa': true,
            'fa-calendar': !this.state.isVisible,
            'fa-calendar-o': this.state.isVisible
        })) : null;

        let readOnly = false;

        if (this.props.hideTouchKeyboard) {
          // do not break server side rendering:
          try {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                readOnly = true
            }
          } catch (e) {}
        }

        let calendarIcon;
        if (this.props.customIcon == null)
        // Do not show calendar icon if hideIcon is true
        calendarIcon = this.props.hideIcon || this.props.disabled ? '' :
            <span className="icon-wrapper calendar-icon" onClick={this.toggleClick} >
              <i className={iconClass}></i>
            </span>
        else {
          calendarIcon = <span className={cs('icon-wrapper', 'calendar-icon', this.props.customIcon)} onClick={this.toggleClick}/>
        }

        return (
            <div className="input-calendar">
              <input
                className={this.props.inputFieldClass}
                id={this.props.inputFieldId}
                onBlur={this.inputBlur}
                onChange={this.changeDate}
                onFocus={this.props.openOnInputFocus ? this.toggleClick : ''}
                placeholder={this.props.placeholder}
                readOnly={readOnly}
                disabled={this.props.disabled}
                type="text"
                value={this.state.inputValue}
                />
              {calendarIcon}
              {calendar}
            </div>
        )
    }
})
