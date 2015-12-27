import React from 'react'
import moment from 'moment'
import 'moment-range'

class Cell extends React.Component {
    static propTypes = {
      value: React.PropTypes.string,
      classes: React.PropTypes.string
    }
    render() {
        let classes = this.props.classes + ' cell'
        return (
          <div className={classes}>{this.props.value}</div>
        )
    }
}

export default Cell
