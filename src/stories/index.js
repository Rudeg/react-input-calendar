import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Calendar from '../index'
import '../../style/index.css'

storiesOf('Calendar', module)
  .add('default view', () => {
    return (
      <Calendar format="DD/MM/YYYY" date="4-12-2014" />
    )
  })
