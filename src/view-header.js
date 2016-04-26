import React from 'react'

export default class ViewHeader extends React.Component {
  static propTypes = {
    next: React.PropTypes.func,
    prev: React.PropTypes.func,
    titleAction: React.PropTypes.func,
    data: React.PropTypes.string
  }
  render() {
    let prop = this.props
    return (
      <div className="navigation-wrapper">
        <span className="icon" onClick={prop.prev}>&lt;</span>
        <span className="navigation-title" onClick={prop.titleAction} >{prop.data}</span>
        <span className="icon" onClick={prop.next}>&gt;</span>
      </div>
    )
  }
}
