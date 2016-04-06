import React from 'react'
import Calendar from '../src/Calendar'

export default class App extends React.Component {
  render() {
    return (
      <Calendar
        date={'01-20-2015'}
        iconInsideInput={true}
        format="MM-DD-YYYY"
      />
    )
  }
}
