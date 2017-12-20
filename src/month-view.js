import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'

export default class MonthView extends React.Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    setInternalDate: PropTypes.func
  }

  getMonth() {
    const month = this.props.date.month()
    return moment.monthsShort().map((item, i) => {
      return {
        label: item,
        disabled: this.checkIfMonthDisabled(i),
        curr: i === month
      }
    })
  }

  cellClick = e => {
    const month = e.target.innerHTML
    if (this.checkIfMonthDisabled(month)) return

    const date = this.props.date.clone().month(month)
    this.props.prevView(date)
  }

  checkIfMonthDisabled(month) {
    const now = this.props.date
    return (
      now
        .clone()
        .month(month)
        .endOf('month')
        .isBefore(this.props.minDate, 'day') ||
      now
        .clone()
        .month(month)
        .startOf('month')
        .isAfter(this.props.maxDate, 'day')
    )
  }

  next = () => {
    let nextDate = this.props.date.clone().add(1, 'years')
    if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
      nextDate = this.props.maxDate
    }
    this.props.setInternalDate(nextDate)
  }

  prev = () => {
    let prevDate = this.props.date.clone().subtract(1, 'years')
    if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
      prevDate = this.props.minDate
    }
    this.props.setInternalDate(prevDate)
  }

  render() {
    const currentDate = this.props.date.format('YYYY')
    const months = this.getMonth().map((item, i) => (
      <Cell
        classes={cs({
          month: true,
          disabled: item.disabled,
          current: item.curr
        })}
        key={i}
        value={item.label}
      />
    ))

    return (
      <div className="months-view">
        <ViewHeader
          data={currentDate}
          next={this.next}
          prev={this.prev}
          titleAction={this.props.nextView}
        />
        <div className="months" onClick={this.cellClick}>
          {months}
        </div>
      </div>
    )
  }
}
