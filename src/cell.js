import React from 'react'
import moment from 'moment'
import 'moment-range'


export default class Cell extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    classes: React.PropTypes.string
  }
  render() {
      const classes = this.props.classes + ' cell'
      return <div className={classes}>{this.props.value}</div>
  }
}
