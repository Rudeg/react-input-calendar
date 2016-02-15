import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'


export default React.createClass({
    propTypes: {
        date: React.PropTypes.object,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        changeView: React.PropTypes.func
    },

    years: [],

    checkIfYearDisabled: function (year) {
        return year.clone().endOf('year').isBefore(this.props.minDate, 'day') ||
            year.clone().startOf('year').isAfter(this.props.maxDate, 'day')
    },

    next: function() {
        let nextDate = this.props.date.clone().add(10, 'years')

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
            nextDate = this.props.maxDate
        }

        this.props.setDate(nextDate)
    },

    prev: function() {
        let prevDate = this.props.date.clone().subtract(10, 'years')

        if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
            prevDate = this.props.minDate
        }

        this.props.setDate(prevDate)
    },

    rangeCheck: function (currYear) {
        if (this.years.length === 0) {
            return false
        }

        return this.years[0].label <= currYear && this.years[this.years.length-1].label >= currYear
    },

    getYears: function () {
        let now = this.props.date,
            start = now.clone().subtract(5, 'year'),
            end = now.clone().add(6, 'year'),
            currYear = now.year(),
            items = [],
            inRange = this.rangeCheck(currYear)

        if (this.years.length > 0 && inRange) {
            return this.years
        }

        moment()
            .range(start, end)
            .by('years', function(year) {
                items.push({
                    label: year.format('YYYY'),
                    disabled: this.checkIfYearDisabled(year),
                    curr: currYear === year.year()
                })
            }.bind(this))

        this.years = items
        return items
    },

    cellClick: function (e) {
        let year = parseInt(e.target.innerHTML, 10),
          date = this.props.date.clone().year(year)

        if (this.checkIfYearDisabled(date)) {
            return
        }

        this.props.prevView(date)
    },


    render: function () {
        let years = this.getYears(),
          currYear = this.props.date.year(), _class

        let yearsCells = years.map(function (item, i) {
            _class = cs({
                'year': true,
                'disabled': item.disabled,
                'current': item.label == currYear
            })
            return <Cell value={item.label} classes={_class} key={i} />
        })

        let currentDate = [years[0].label, years[years.length-1].label].join('-')

        return (
            <div className="years-view">
              <ViewHeader data={currentDate} next={this.next} prev={this.prev} />
              <div className="years" onClick={this.cellClick}>{yearsCells}</div>
            </div>
        )
    }

})
