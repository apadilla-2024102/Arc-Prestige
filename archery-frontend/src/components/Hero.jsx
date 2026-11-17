import React from 'react'

const Hero = ({ userName, roleLabel }) => {
  return (
    <section id="inicio" className="hero">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="container hero-content">
        <span className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {roleLabel || 'Centro de operaciones'}
        </span>
        <h1>
          {userName ? <>Hola, {userName}.</> : 'Arc Prestige'}
        </h1>
        <p className="hero-lead">
          Gestión integral para clases, asistencia e inscripciones. Todo lo que tu academia necesita, en un solo lugar.
        </p>
      </div>
    </section>
  )
}

export default Hero
