import React from 'react'
import 'moment-range'

export default function Cell({ value, classes }) {
  const _classes = `${classes} cell`
  return <div className={_classes}>{value}</div>
}
