import React, { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#inicio', label: 'INICIO' },
    { href: '#dashboard', label: 'DASHBOARD' },
    { href: '#contacto', label: 'CONTACTO' },
  ]

  return (
    <nav className="custom-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setOpen(false)}>
          <div className="navbar-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 8.5C15.5 10.9853 13.4853 13 11 13C8.51472 13 6.5 10.9853 6.5 8.5C6.5 6.01472 8.51472 4 11 4C13.4853 4 15.5 6.01472 15.5 8.5Z" stroke="#1F5538" strokeWidth="2.2" />
              <path d="M18.5 11.5C18.5 15.0899 15.5899 18 12 18C8.41015 18 5.5 15.0899 5.5 11.5C5.5 7.91015 8.41015 5 12 5C15.5899 5 18.5 7.91015 18.5 11.5Z" stroke="#c9a24b" strokeWidth="2.2" />
              <path d="M21 14.5C21 19.1944 16.6944 23.5 12 23.5C7.30558 23.5 3 19.1944 3 14.5C3 9.80558 7.30558 5.5 12 5.5C16.6944 5.5 21 9.80558 21 14.5Z" stroke="#1F5538" strokeWidth="2.2" />
            </svg>
          </div>
          <span className="brand-text">
            <span className="brand-light">Arc</span> Prestige
          </span>
        </a>

        <button
          type="button"
          className={`navbar-toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav navbar-nav d-flex gap-4 ${open ? 'is-open' : ''}`} style={{ listStyle: 'none' }}>
          {links.map((link) => (
            <li className="nav-item" key={link.href}>
              <a className="nav-link" href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
