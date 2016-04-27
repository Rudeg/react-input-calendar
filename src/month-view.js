import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'

export default class MonthView extends React.Component {
  propTypes = {
    date: React.PropTypes.object.isRequired,
    minDate: React.PropTypes.any,
    maxDate: React.PropTypes.any
  }

  checkIfMonthDisabled(month) {
    const now = this.props.date
    return now.clone().month(month).endOf('month').isBefore(this.props.minDate, 'day') ||
      now.clone().month(month).startOf('month').isAfter(this.props.maxDate, 'day')
  }

  next = () => {
    let nextDate = this.props.date.clone().add(1, 'years')
    if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
      nextDate = this.props.maxDate
    }
    this.props.setDate(nextDate)
  }

  prev = () => {
    let prevDate = this.props.date.clone().subtract(1, 'years')
    if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
      prevDate = this.props.minDate
    }
    this.props.setDate(prevDate)
  }

  cellClick = e => {
    const month = e.target.innerHTML
    if (this.checkIfMonthDisabled(month)) return

    const date = this.props.date.clone().month(month)
    this.props.prevView(date)
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

  render() {
    const currentDate = this.props.date.format('YYYY')
    let months = this.getMonth().map((item, i) => {
      let _class = cs({
        'month': true,
        'disabled': item.disabled,
        'current': item.curr
      })
      return <Cell classes={_class} key={i} value={item.label} />
    })

    return (
      <div className="months-view" >
        <ViewHeader data={currentDate} next={this.next} prev={this.prev} titleAction={this.props.nextView} />
        <div className="months" onClick={this.cellClick}>{months}</div>
      </div>
    )
  }
}
