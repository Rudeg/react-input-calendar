import React from 'react'

export default ({ prev, next, titleAction, data }) => (
  <div className="navigation-wrapper">
    <span className="icon" onClick={prev}>
      &lt;
    </span>
    <span className="navigation-title" onClick={titleAction}>
      {data}
    </span>
    <span className="icon" onClick={next}>
      &gt;
    </span>
  </div>
)
