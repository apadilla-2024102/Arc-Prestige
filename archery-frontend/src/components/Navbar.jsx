import React, { useState } from 'react'

const BrandMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="5.5" stroke="var(--gold)" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
  </svg>
)

const Navbar = ({ userName, onLogout }) => {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#dashboard', label: 'Panel' },
    { href: '#contacto', label: 'Contacto' },
  ]

  return (
    <nav className="custom-navbar">
      <div className="container nav-inner">
        <a className="navbar-brand" href="#inicio" onClick={() => setOpen(false)}>
          <span className="navbar-icon"><BrandMark /></span>
          <span className="brand-text">Arc Prestige</span>
        </a>

        <ul className={`navbar-nav ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <li className="nav-item" key={link.href}>
              <a className="nav-link" href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {userName && (
            <span className="nav-user" title={userName}>
              <span className="nav-avatar" aria-hidden="true">{userName.charAt(0).toUpperCase()}</span>
              <span className="nav-user-name">{userName}</span>
            </span>
          )}
          {onLogout && (
            <button type="button" className="btn-ghost nav-logout" onClick={onLogout}>Salir</button>
          )}
          <button
            type="button"
            className={`navbar-toggle ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
