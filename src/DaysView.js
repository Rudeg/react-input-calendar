var React = require('react/addons');
var cs = React.addons.classSet;
var moment = require('moment-range');
var Cell = require('./Cell');
var ViewHeader = require('./ViewHeader');

module.exports = React.createClass({

    propTypes: {
        date: React.PropTypes.object.isRequired,
        setDate: React.PropTypes.func,
        nextView: React.PropTypes.func
    },

    getDaysTitles: function () {
        return moment.weekdaysMin().map(function (item) {
            return {
                val: item,
                label: item
            };
        });
    },

    next: function() {
        this.props.setDate(this.props.date.add(1, 'months'));
    },

    prev: function() {
        this.props.setDate(this.props.date.subtract(1, 'months'));
    },

    cellClick: function (e) {
        var cell = e.target,
            date = parseInt(cell.innerHTML, 10),
            newDate = this.props.date ? this.props.date : moment();

        if (isNaN(date)) {
            return;
        }

        if (cell.className.indexOf('prev') > -1 ) {
            newDate.subtract(1, 'months');
        } else if (cell.className.indexOf('next') > -1) {
            newDate.add(1, 'months');
        }

        newDate.date(date);
        this.props.setDate(newDate, true);
    },


    getDays: function () {
        var now = this.props.date ? this.props.date : moment(),
            start = now.clone().startOf('month').day(0),
            end = now.clone().endOf('month').day(6),
            month = now.month(),
            today = moment(),
            currDay = now.date(),
            year = now.year(),
            days = [];

        moment()
            .range(start, end)
            .by('days', function(day) {
                days.push({
                    label: day.format('D'),
                    prev: (day.month() < month && !(day.year() > year)) || day.year() < year ,
                    next: day.month() > month || day.year() > year,
                    curr: day.date() === currDay && day.month() === month,
                    today: day.date() === today.date() && day.month() === today.month()
                });
            });

        return days;
    },

    render: function () {
        var titles = this.getDaysTitles().map(function (item, i) {
            return <Cell value={item.label} classes="day title" key={i} />
        });

        var days = this.getDays().map(function (item, i) {
            var _class = cs({
                'day': true,
                'next': item.next,
                'prev': item.prev,
                'current': item.curr,
                'today': item.today
            });
            return <Cell value={item.label} classes={_class} key={i} />
        });

        var currentDate = this.props.date ? this.props.date.format('MMMM') : moment().format('MMMM');

        return (
            <div className="view days-view" onKeyDown={this.keyDown}>
                <ViewHeader
                    prev={this.prev}
                    next={this.next}
                    data={currentDate}
                    titleAction={this.props.nextView} />

                <div className="days-title">{titles}</div>
                <div className="days" onClick={this.cellClick} >{days}</div>
            </div>
        );
    }

});
