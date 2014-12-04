var React = require('react');
var cs = React.addons.classSet;
var moment = require('moment-range');
var Cell = require('./Cell');
var ViewHeader = require('./ViewHeader');

module.exports = React.createClass({

    propTypes: {
        date: React.PropTypes.object,
        changeView: React.PropTypes.func
    },

    years: [],

    next: function() {
        this.props.setDate(this.props.date.add(10, 'years'));
    },

    prev: function() {
        this.props.setDate(this.props.date.subtract(10, 'years'));
    },

    rangeCheck: function (currYear) {
        if (this.years.length === 0) {
            return false;
        }

        return this.years[0].label <= currYear && this.years[this.years.length-1].label >= currYear;
    },

    getYears: function () {
        var now = this.props.date,
            start = now.clone().subtract(5, 'year'),
            end = now.clone().add(6, 'year'),
            currYear = now.year(),
            items = [],
            inRange = this.rangeCheck(currYear);

        if (this.years.length > 0 && inRange) {
            return this.years;
        }

        moment()
            .range(start, end)
            .by('years', function(year) {
                items.push({
                    label: year.format('YYYY'),
                    curr: currYear === year.year()
                });
            });
        
        this.years = items;
        return items;
    },
    
    cellClick: function (e) {
        var year = parseInt(e.target.innerHTML, 10);
        var date = this.props.date.year(year);
        this.props.prevView(date);
    },


    render: function () {
        var years = this.getYears();
        var currYear = this.props.date.year();

        var yearsCells = years.map(function (item, i) {
            var _class = cs({
                'year': true,
                'current': item.label == currYear
            });
            return <Cell value={item.label} classes={_class} key={i} />
        });

        var currentDate = [years[0].label, years[years.length-1].label].join('-');

        return (
            <div className="years-view">
                <ViewHeader
                    prev={this.prev}
                    next={this.next}
                    data={currentDate} />

                <div className="years" onClick={this.cellClick}>{yearsCells}</div>
            </div>
        );
    }

});
