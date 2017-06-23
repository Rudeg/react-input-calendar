import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Calendar from '../index'
import '../../style/index.css'

storiesOf('Calendar', module).add('default view', () => {
  return <Calendar format="DD/MM/YYYY" date="01/01/2016" />
}).add('Save on close', () => {
  const saved = [''];
  return <div>
    <Calendar format="DD/MM/YYYY" closeOnSelect={true} onChange={(x)=> {
      saved[0] = x;
    }}/>
    <label>Saved:</label>
    <p>{saved[0]}</p>
  </div>
})
