import React from 'react'
import { storiesOf } from '@storybook/react'
import Calendar from '../index'
import '../../style/index.css'

storiesOf('Calendar', module)
  .add('default view', () => <Calendar format="DD/MM/YYYY" date="01/01/2016" />)
  .add('focus example', () => (
    <div>
      <h3>Focused initially when rendered</h3>
      <Calendar focused={true} format="DD/MM/YYYY" date="01/01/2016" />
      <h3>Focus date input field programmatically</h3>
      <FocusDateInput />
    </div>
  ))
  .add('locale example', () => <Calendar locale="de" format="DD/MM/YYYY" date="01/01/2016" />)
  .add('default view month', () => (
    <Calendar format="DD/MM/YYYY" date="01/01/2016" defaultView={1} />
  ))
  .add('month/year display (day view)', () => (
    <Calendar format="DD/MM/YYYY" date="01/01/2016" displayYrWithMonth={true} />
  ))

class FocusDateInput extends React.Component {
  constructor(props) {
    super()
    this.state = { focused: false }
  }

  render() {
    const { focused } = this.state
    return (
      <div>
        <Calendar
          focused={focused}
          format="DD/MM/YYYY"
          date="01/01/2016"
          onBlur={() => {
            this.setState({ ...this.state, focused: false })
          }}
        />
        <input
          type="button"
          value="Focus date input with a button"
          onClick={() => {
            this.setState({ ...this.state, focused: true })
          }}
        />
        <div
          onClick={() => {
            this.setState({ ...this.state, focused: true })
          }}
        >
          Focus date input with a div
        </div>
      </div>
    )
  }
}
