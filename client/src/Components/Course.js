import React from 'react'

const displayComponents = components => {
  return components
    .map(component => {
      if (component === 'LEC') return 'Lecture'
      if (component === 'LAB') return 'Lab'
      if (component === 'TUT') return 'Tutorial'
      return component
    })
    .join(', ')
}

const Course = ({ code, name, credits, description, components, prerequisites, equivalencies }) => {
  return (
    <div className="card">
      <div className="header">
        <span className="name">
          <b>{code}</b>: {name}
        </span>
        <span>
          <i>{credits} credits</i>
        </span>
      </div>
      <hr />
      <div className="description">{description}</div>
      <hr />

      <div className="components">
        <b>Components</b>: {displayComponents(components)}
      </div>
      <div className="prereqs">
        <b>Prerequisites</b>: {prerequisites}
      </div>
      <div className="equivs">
        <b>Equivalencies</b>: {equivalencies}
      </div>
    </div>
  )
}

export default Course
