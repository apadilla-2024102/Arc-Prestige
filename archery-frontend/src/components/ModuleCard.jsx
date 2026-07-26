import React from 'react'

const ModuleCard = ({ img, title, desc, cta, onClick }) => {
  return (
    <div className="card-modulo">
      {img ? (
        <div className="imagen"><img src={img} alt={title} /></div>
      ) : null}
      <div className="contenido">
        <h4>{title}</h4>
        <p>{desc}</p>
        <button className="btn-modulo" onClick={onClick}>{cta}</button>
      </div>
    </div>
  )
}

export default ModuleCard
