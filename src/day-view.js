import React from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'

export default class DayView extends React.Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    setDate: PropTypes.func,
    nextView: PropTypes.func
  }

  getDays() {
    const { minDate, maxDate, date } = this.props
    const now = date ? date : moment()
    const start = now
      .clone()
      .startOf('month')
      .weekday(0)
    const end = now
      .clone()
      .endOf('month')
      .weekday(6)
    const month = now.month()
    const today = moment()
    const currDay = now.date()
    const year = now.year()
    let days = []

    moment()
      .range(start, end)
      .by('days', day => {
        days.push({
          label: day.format('D'),
          prev: (day.month() < month && !(day.year() > year)) || day.year() < year,
          next: day.month() > month || day.year() > year,
          disabled: day.isBefore(minDate, 'day') || day.isAfter(maxDate, 'day'),
          curr: day.date() === currDay && day.month() === month,
          today:
            day.date() === today.date() &&
            day.month() === today.month() &&
            day.year() === today.year()
        })
      })
    return days
  }

  getDaysTitles() {
    return [0, 1, 2, 3, 4, 5, 6].map(i => ({
      label: moment()
        .weekday(i)
        .format('dd')
    }))
  }

  cellClick = e => {
    let cell = e.target
    let date = parseInt(cell.innerHTML, 10)
    let newDate = this.props.date ? this.props.date.clone() : moment()

    if (isNaN(date)) return

    if (cell.className.indexOf('prev') > -1) {
      newDate.subtract(1, 'months')
    } else if (cell.className.indexOf('next') > -1) {
      newDate.add(1, 'months')
    }

    newDate.date(date)
    this.props.setDate(newDate, true)
  }

  next = () => {
    let nextDate = this.props.date.clone().add(1, 'months')
    if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
      nextDate = this.props.maxDate
    }
    this.props.setDate(nextDate)
  }

  prev = () => {
    let prevDate = this.props.date.clone().subtract(1, 'months')
    if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
      prevDate = this.props.minDate
    }
    this.props.setDate(prevDate)
  }

  render() {
    const titles = this.getDaysTitles().map((item, i) => (
      <Cell classes="day title" key={i} value={item.label} />
    ))
    const days = this.getDays().map((item, i) => (
      <Cell
        classes={cs({
          day: true,
          next: item.next,
          prev: item.prev,
          disabled: item.disabled,
          current: item.curr,
          today: item.today
        })}
        key={i}
        value={item.label}
      />
    ))
    const currentDate = this.props.date ? this.props.date.format('MMMM') : moment().format('MMMM')

    return (
      <div className="view days-view" onKeyDown={this.keyDown}>
        <ViewHeader
          data={currentDate}
          next={this.next}
          prev={this.prev}
          titleAction={this.props.nextView}
        />
        <div className="days-title">{titles}</div>
        <div className="days" onClick={this.cellClick}>
          {days}
        </div>
      </div>
    )
  }
}
