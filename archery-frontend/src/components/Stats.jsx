import React from 'react'

const iconMap = {
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
      <path d="M4 12h4" />
      <path d="M16 12h4" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h14" />
      <path d="M18 12l-4-4" />
      <path d="M18 12l-4 4" />
      <path d="M20 8l2 2-2 2" />
    </svg>
  ),
}

const Stats = () => {
  const stats = [
    { icon: 'clock', label: 'Tiempo de Actividad', value: '1250' },
    { icon: 'target', label: 'Total Reservas', value: '14' },
    { icon: 'arrow', label: 'Tasa de Cancelación', value: '0%' },
  ]

  return (
    <section className="estadisticas container">
      <div className="titulo-estadisticas text-center mb-4"><h2>Estadísticas del Sistema</h2></div>
      <div className="row g-4">
        {stats.map((stat) => (
          <div key={stat.label} className="col-md-4">
            <div className="estadistica-card">
              <div className="icono">{iconMap[stat.icon]}</div>
              <h5>{stat.label}</h5>
              <h1>{stat.value}</h1>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
