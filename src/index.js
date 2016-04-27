import React from 'react'

import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import DaysView from './day-view'
import MonthsView from './month-view'
import YearsView from './year-view'
import Util from './util'

const Calendar = React.createClass({
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
    inputName: React.PropTypes.string,
    inputFieldId: React.PropTypes.string,
    inputFieldClass: React.PropTypes.string,
    minView: React.PropTypes.number,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    openOnInputFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    hideTouchKeyboard: React.PropTypes.bool,
    hideIcon: React.PropTypes.bool,
    customIcon: React.PropTypes.string,
    todayText: React.PropTypes.string
  },


  getInitialState() {
    const date = this.props.date ? moment(Util.toDate(this.props.date)) : null
    const minDate = this.props.minDate ? moment(Util.toDate(this.props.minDate)) : null
    const maxDate = this.props.maxDate ? moment(Util.toDate(this.props.maxDate)) : null
    const format = this.props.format || 'MM-DD-YYYY'
    const minView = parseInt(this.props.minView, 10) || 0
    const computableFormat = this.props.computableFormat || 'MM-DD-YYYY'
    const strictDateParsing = this.props.strictDateParsing || false
    const parsingFormat = this.props.parsingFormat || format

    return {
      date,
      minDate,
      maxDate,
      format,
      computableFormat,
      inputValue: date ? date.format(format) : null,
      views: ['days', 'months', 'years'],
      minView,
      currentView: minView || 0,
      isVisible: false,
      strictDateParsing,
      parsingFormat
    }
  },

  componentDidMount() {
    document.addEventListener('click', this.documentClick)
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      date: nextProps.date ? moment(Util.toDate(nextProps.date)) : this.state.date,
      inputValue: nextProps.date
        ? moment(Util.toDate(nextProps.date)).format(this.state.format) : null
    })
  },

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick)
  },

  setVisibility(val) {
    const value = val !== undefined ? val : !this.state.isVisible
    const eventMethod = value ? 'addEventListener' : 'removeEventListener'

    document[eventMethod]('keydown', this.keyDown)

    if (this.state.isVisible !== value) {
      this.setState({ isVisible: value })
    }
  },

  setDate(date, isDayView) {
    if (this.checkIfDateDisabled(date)) return

    this.setState({
      date,
      inputValue: date.format(this.state.format),
      isVisible: this.props.closeOnSelect
        && isDayView ? !this.state.isVisible : this.state.isVisible
    })

    if (this.props.onChange) {
      this.props.onChange(date.format(this.state.computableFormat))
    }
  },

  checkIfDateDisabled(date) {
    return date && this.state.minDate && date.isBefore(this.state.minDate, 'day')
      || date && this.state.maxDate && date.isAfter(this.state.maxDate, 'day')
  },

  nextView() {
    if (this.checkIfDateDisabled(this.state.date)) return
    this.setState({ currentView: ++this.state.currentView })
  },

  prevView(date) {
    let newDate = date
    if (this.state.minDate && date.isBefore(this.state.minDate, 'day')) {
      newDate = this.state.minDate.clone()
    }

    if (this.state.maxDate && date.isAfter(this.state.maxDate, 'day')) {
      newDate = this.state.maxDate.clone()
    }

    if (this.state.currentView === this.state.minView) {
      this.setState({
        date: newDate,
        inputValue: date.format(this.state.format),
        isVisible: false
      })
      if (this.props.onChange) {
        this.props.onChange(date.format(this.state.computableFormat))
      }
    } else {
      this.setState({
        date,
        currentView: --this.state.currentView
      })
    }
  },

  changeDate(e) {
    this.setState({ inputValue: e.target.value })
  },

  inputBlur(e) {
    let newDate = null
    let computableDate = null
    const date = this.state.inputValue
    const format = this.state.format
    const parsingFormat = this.state.parsingFormat

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
      inputValue: newDate ? newDate.format(format) : null
    })

    if (this.props.onChange) {
      this.props.onChange(computableDate)
    }

    if (this.props.onBlur) {
      this.props.onBlur(e, computableDate)
    }
  },


  documentClick() {
    if (!this.isCalendar) {
      this.setVisibility(false)
    }
    this.isCalendar = false
  },

  calendarClick() {
    this.isCalendar = true
  },

  todayClick() {
    const today = moment().startOf('day')

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

  toggleClick() {
    this.isCalendar = true
    this.setVisibility()
  },

  keyDown(e) {
    Util.keyDownActions.call(this, e.keyCode)
  },

  isCalendar: false,

  render() {
    // its ok for this.state.date to be null, but we should never
    // pass null for the date into the calendar pop up, as we want
    // it to just start on todays date if there is no date set
    let calendarDate = this.state.date || moment()
    let view

    switch (this.state.currentView) {
      case 0:
        view = <DaysView
          date={calendarDate}
          nextView={this.nextView}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          setDate={this.setDate}
        />
        break
      case 1:
        view = (<MonthsView
          date={calendarDate}
          nextView={this.nextView}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          prevView={this.prevView}
          setDate={this.setDate}
        />)
        break
      case 2:
        view = (<YearsView
          date={calendarDate}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          prevView={this.prevView}
          setDate={this.setDate}
        />)
        break
      default:
        view = (<DaysView
          date={calendarDate}
          nextView={this.nextView}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          setDate={this.setDate}
        />)
    }

    let todayText = this.props.todayText || (moment.locale() === 'de' ? 'Heute' : 'Today')
    let calendarClass = cs({
      'input-calendar-wrapper': true,
      'icon-hidden': this.props.hideIcon
    })

    let calendar = !this.state.isVisible ? '' :
      <div className={calendarClass} onClick={this.calendarClick}>
        {view}
        <span
          className={'today-btn' + (this.checkIfDateDisabled(moment().startOf('day')) ? ' disabled' : '')}
          onClick={this.todayClick}
        >
          {todayText}
        </span>
      </div>

    let readOnly = false

    if (this.props.hideTouchKeyboard) {
      // do not break server side rendering:
      try {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          readOnly = true
        }
      } catch (e) {}
    }

    let calendarIcon
    if (this.props.customIcon == null) {
      // Do not show calendar icon if hideIcon is true
      calendarIcon = this.props.hideIcon ? '' :
        <span className="icon-wrapper calendar-icon" onClick={this.toggleClick} >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M5 6h2v2h-2zM8 6h2v2h-2zM11 6h2v2h-2zM2 12h2v2h-2zM5
              12h2v2h-2zM8 12h2v2h-2zM5 9h2v2h-2zM8 9h2v2h-2zM11 9h2v2h-2zM2
              9h2v2h-2zM13 0v1h-2v-1h-7v1h-2v-1h-2v16h15v-16h-2zM14
              15h-13v-11h13v11z"
            />
          </svg>
        </span>
    } else {
      calendarIcon = (
        <span
          className={cs('icon-wrapper', 'calendar-icon', this.props.customIcon)}
          onClick={this.toggleClick}
        />
      )
    }

    const inputClass = this.props.inputFieldClass || 'input-calendar-field'

    return (
      <div className="input-calendar">
        <input
          name={this.props.inputName}
          className={inputClass}
          id={this.props.inputFieldId}
          onBlur={this.inputBlur}
          onChange={this.changeDate}
          onFocus={this.props.openOnInputFocus ? this.toggleClick : ''}
          placeholder={this.props.placeholder}
          readOnly={readOnly}
          type="text"
          value={this.state.inputValue}
        />
        {calendarIcon}
        {calendar}
      </div>
    )
  }
})

export default Calendar
