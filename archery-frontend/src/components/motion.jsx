import React, { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Counts up to `value` once, the first time it appears. Seen rarely, so it may move. */
export const CountUp = ({ value, duration = 900, format = (n) => n }) => {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0))
  const done = useRef(false)

  useEffect(() => {
    if (done.current || prefersReducedMotion()) {
      setDisplay(value)
      return undefined
    }
    done.current = true
    let raf
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setDisplay(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{format(display)}</>
}

/* Fades a block in the first time it scrolls into view. */
export const Reveal = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setShown(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-shown' : ''} ${className}`} style={{ transitionDelay: shown ? `${delay}ms` : undefined }}>
      {children}
    </Tag>
  )
}

/* Cursor-following highlight. Sets vars on the hovered element itself. */
export const trackSpot = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

