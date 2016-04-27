import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'

export default class YearsView extends React.Component {
  static propTypes = {
    date: React.PropTypes.object,
    minDate: React.PropTypes.any,
    maxDate: React.PropTypes.any,
    changeView: React.PropTypes.func
  }
  state = {
    years: []
  }

  checkIfYearDisabled (year) {
    return year.clone().endOf('year').isBefore(this.props.minDate, 'day') ||
      year.clone().startOf('year').isAfter(this.props.maxDate, 'day')
  }

  next = () => {
    let nextDate = this.props.date.clone().add(10, 'years')
    if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
      nextDate = this.props.maxDate
    }
    this.props.setDate(nextDate)
  }

  prev = () => {
    let prevDate = this.props.date.clone().subtract(10, 'years')
    if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
      prevDate = this.props.minDate
    }
    this.props.setDate(prevDate)
  }

  rangeCheck = currYear => {
    const { years } = this.state
    if (years.length == 0) {
      return false
    }
    return years[0].label <= currYear && years[years.length-1].label >= currYear
  }

  getYears() {
    let now = this.props.date,
      start = now.clone().subtract(5, 'year'),
      end = now.clone().add(6, 'year'),
      currYear = now.year(),
      items = [],
      inRange = this.rangeCheck(currYear)

    const { years } = this.state

    if (years.length > 0 && inRange) {
      return years
    }

    moment()
      .range(start, end)
      .by('years', year => {
        items.push({
          label: year.format('YYYY'),
          disabled: this.checkIfYearDisabled(year),
          curr: currYear === year.year()
        })
      })

    this.setState({ years: items })

    return items
  }

  cellClick = e => {
    const year = parseInt(e.target.innerHTML, 10)
    const date = this.props.date.clone().year(year)
    if (this.checkIfYearDisabled(date)) return
    this.props.prevView(date)
  }

  render() {
    const years = this.getYears()
    const currYear = this.props.date.year()
    let _class

    let yearsCells = years.map((item, i) => {
      _class = cs({
        'year': true,
        'disabled': item.disabled,
        'current': item.label == currYear
      })
      return <Cell value={item.label} classes={_class} key={i} />
    })
    const currentDate = [years[0].label, years[years.length-1].label].join('-')
    return (
      <div className="years-view">
        <ViewHeader data={currentDate} next={this.next} prev={this.prev} />
        <div className="years" onClick={this.cellClick}>{yearsCells}</div>
      </div>
    )
  }
}
