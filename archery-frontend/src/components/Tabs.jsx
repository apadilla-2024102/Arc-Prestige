import React, { useLayoutEffect, useRef, useState } from 'react'

/*
 * Segmented tabs. The active state is a duplicated tab list clipped to the
 * active tab, so background and text color change together in one motion.
 */
const Tabs = ({ tabs, value, onChange, ariaLabel, size = 'md' }) => {
  const listRef = useRef(null)
  const [clip, setClip] = useState(null)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const measure = () => {
      const active = list.querySelector(`[data-value="${value}"]`)
      if (!active) return
      const { offsetLeft, offsetWidth } = active
      const total = list.offsetWidth
      const right = total - (offsetLeft + offsetWidth)
      setClip(`inset(3px ${(right / total) * 100}% 3px ${(offsetLeft / total) * 100}% round 8px)`)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [value, tabs.length])

  return (
    <div className={`seg-tabs seg-tabs-${size}`}>
      <div ref={listRef} className="seg-tabs-list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            data-value={tab.key}
            aria-selected={value === tab.key}
            className="seg-tab"
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="seg-tabs-list seg-tabs-active"
        aria-hidden="true"
        style={clip ? { clipPath: clip } : { opacity: 0 }}
      >
        {tabs.map((tab) => (
          <span key={tab.key} className="seg-tab">{tab.label}</span>
        ))}
      </div>
    </div>
  )
}

export default Tabs
