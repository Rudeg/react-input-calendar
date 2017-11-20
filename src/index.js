import React from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import DaysView from './day-view'
import MonthsView from './month-view'
import YearsView from './year-view'
import Util from './util'
import getIcon from './icon'

class Calendar extends React.Component {
  constructor(props, context) {
    super(props, context)
    moment.locale(this.props.locale || 'en')
    const date = props.date ? moment(Util.toDate(props.date)) : null
    const minDate = props.minDate ? moment(Util.toDate(props.minDate)) : null
    const maxDate = props.maxDate ? moment(Util.toDate(props.maxDate)) : null
    const format = props.format || 'MM-DD-YYYY'
    const minView = parseInt(props.minView, 10) || 0
    const computableFormat = props.computableFormat || 'MM-DD-YYYY'
    const strictDateParsing = props.strictDateParsing || false
    const parsingFormat = props.parsingFormat || format

    this.state = {
      date,
      minDate,
      maxDate,
      format,
      computableFormat,
      inputValue: date ? date.format(format) : undefined,
      views: ['days', 'months', 'years'],
      minView,
      currentView: minView || 0,
      isVisible: false,
      strictDateParsing,
      parsingFormat
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.documentClick)
    if (this.props.focused) {
      this.focusDateInput()
    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {
      date: nextProps.date ? moment(Util.toDate(nextProps.date)) : this.state.date,
      inputValue: nextProps.date
        ? moment(Util.toDate(nextProps.date)).format(this.state.format)
        : null,
      minDate: nextProps.minDate ? moment(Util.toDate(nextProps.minDate)) : null,
      maxDate: nextProps.maxDate ? moment(Util.toDate(nextProps.maxDate)) : null
    }

    if (nextProps.disabled === true) {
      newState.isVisible = false
    }

    this.setState(newState)
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused !== prevProps.focused && this.props.focused) {
      this.focusDateInput()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick)
  }

  setDate = (date, isDayView = false) => {
    if (this.checkIfDateDisabled(date)) return

    this.setState({
      date,
      inputValue: date.format(this.state.format),
      isVisible:
        this.props.closeOnSelect && isDayView ? !this.state.isVisible : this.state.isVisible
    })

    if (this.props.onChange) {
      this.props.onChange(date.format(this.state.computableFormat))
    }
  }

  setVisibility(val) {
    const value = val !== undefined ? val : !this.state.isVisible
    const eventMethod = value ? 'addEventListener' : 'removeEventListener'

    document[eventMethod]('keydown', this.keyDown)

    if (this.state.isVisible !== value && !this.props.disabled) {
      this.setState({ isVisible: value })
    }
  }

  calendarClick = () => {
    this.setState({ isCalendar: true })
  }

  changeDate = e => {
    //eslint-disable-line
    this.setState({ inputValue: e.target.value })
  }

  checkIfDateDisabled(date) {
    return (
      (date && this.state.minDate && date.isBefore(this.state.minDate, 'day')) ||
      (date && this.state.maxDate && date.isAfter(this.state.maxDate, 'day'))
    )
  }

  documentClick = e => {
    if (!this.state.isCalendar) {
      this.setVisibility(false)
    }
    this.setState({ isCalendar: false })
  }

  focusDateInput = () => {
    this.dateInput && this.dateInput.focus()
  }

  inputBlur = e => {
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

    this.props.onChange && this.props.onChange(computableDate)
    this.props.onBlur && this.props.onBlur(e, computableDate)
  }

  inputFocus = e => {
    if (this.props.openOnInputFocus) {
      this.toggleClick()
    }
    this.props.onFocus && this.props.onFocus(e)
  }

  keyDown = e => {
    Util.keyDownActions.call(this, e.keyCode)
  }

  nextView = () => {
    if (this.checkIfDateDisabled(this.state.date)) return
    this.setState({ currentView: ++this.state.currentView })
  }

  prevView = date => {
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
  }

  todayClick = () => {
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
  }

  toggleClick = () => {
    this.setState({ isCalendar: true })
    this.setVisibility()
  }

  getView() {
    const calendarDate = this.state.date || moment()
    const { maxDate, minDate } = this.state
    const props = {
      date: calendarDate,
      nextView: this.nextView,
      setDate: this.setDate,
      prevView: this.prevView,
      maxDate,
      minDate
    }

    switch (this.state.currentView) {
      case 0:
        return <DaysView {...props} />
      case 1:
        return <MonthsView {...props} />
      case 2:
        return <YearsView {...props} />
      default:
        return <DaysView {...props} />
    }
  }

  render() {
    // its ok for this.state.date to be null, but we should never
    // pass null for the date into the calendar pop up, as we want
    // it to just start on todays date if there is no date set
    const view = this.getView()
    const todayText = this.props.todayText || (moment.locale() === 'de' ? 'Heute' : 'Today')
    const calendarClass = cs({
      'input-calendar-wrapper': true,
      'icon-hidden': this.props.hideIcon
    })
    const calendar =
      !this.state.isVisible || this.props.disabled ? (
        ''
      ) : (
        <div className={calendarClass} onClick={this.calendarClick}>
          {view}
          <span
            className={`today-btn${
              this.checkIfDateDisabled(moment().startOf('day')) ? ' disabled' : ''
            }`}
            onClick={this.todayClick}
          >
            {todayText}
          </span>
        </div>
      )
    const readOnly = Util.checkForMobile(this.props.hideTouchKeyboard)
    const calendarIcon = getIcon(this.props, this.toggleClick)
    const inputClass = this.props.inputFieldClass || 'input-calendar-field'

    return (
      <div className="input-calendar">
        <input
          name={this.props.inputName}
          className={inputClass}
          id={this.props.inputFieldId}
          onBlur={this.inputBlur}
          onChange={this.changeDate}
          onFocus={this.inputFocus}
          placeholder={this.props.placeholder}
          readOnly={readOnly}
          disabled={this.props.disabled}
          type="text"
          ref={input => {
            this.dateInput = input
          }}
          value={this.state.inputValue || ''}
        />
        {calendarIcon}
        {calendar}
      </div>
    )
  }
}

Calendar.propTypes = {
  closeOnSelect: PropTypes.bool,
  computableFormat: PropTypes.string,
  strictDateParsing: PropTypes.bool,
  parsingFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  date: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  format: PropTypes.string,
  inputName: PropTypes.string,
  inputFieldId: PropTypes.string,
  inputFieldClass: PropTypes.string,
  minView: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  openOnInputFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  hideTouchKeyboard: PropTypes.bool,
  hideIcon: PropTypes.bool,
  customIcon: PropTypes.string,
  todayText: PropTypes.string,
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  locale: PropTypes.string
}

export default Calendar
