import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'


module.exports = React.createClass({

    propTypes: {
        date: React.PropTypes.object.isRequired,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any
    },

    checkIfMonthDisabled: function (month) {
        let now = this.props.date

        return now.clone().month(month).endOf('month').isBefore(this.props.minDate) ||
            now.clone().month(month).startOf('month').isAfter(this.props.maxDate)
    },

    next: function() {
        let nextDate = this.props.date.clone().add(1, 'years')

        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate)) {
            nextDate = this.props.maxDate
        }

        this.props.setDate(nextDate)
    },

    prev: function() {
        let prevDate = this.props.date.clone().subtract(1, 'years')

        if (this.props.minDate && prevDate.isBefore(this.props.minDate)) {
            prevDate = this.props.minDate
        }

        this.props.setDate(prevDate)
    },

    cellClick: function (e) {
        let month = e.target.innerHTML,
          date = this.props.date.clone().month(month)

        if (this.checkIfMonthDisabled(month)) {
          return
        }

        this.props.prevView(date)
    },

    getMonth: function () {
        let now = this.props.date,
            month = now.month()

        return moment.monthsShort().map(function (item, i) {
            return {
                label: item,
                disabled: this.checkIfMonthDisabled(i),
                curr: i === month
            }
        }.bind(this))
    },

    render: function () {
        let currentDate = this.props.date.format('YYYY'), _class
        let months = this.getMonth().map(function (item, i) {
            _class = cs({
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

})
