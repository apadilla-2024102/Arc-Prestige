import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, XCircle, Users2, Target, Gauge, CalendarCheck } from 'lucide-react'
import {
  fetchAttendanceList,
  fetchClassList,
  fetchInscriptionList,
  fetchReportAttendance,
  fetchReportClassStats,
  fetchEnrolledStudents,
} from '../api'
import { CountUp, Reveal, trackSpot } from './motion'

const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.data)) return value.data
  return []
}

const toObject = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value.data && typeof value.data === 'object' && !Array.isArray(value.data) ? value.data : value
  }
  return {}
}

const norm = (v) => String(v || '').trim().toLowerCase()

const SPORT_LABELS = {
  archery: 'Tiro con arco',
  'tiro con arco': 'Tiro con arco',
  soccer: 'Fútbol',
  football: 'Fútbol',
  futbol: 'Fútbol',
  'fútbol': 'Fútbol',
  basketball: 'Básquetbol',
  basquet: 'Básquetbol',
  'básquetbol': 'Básquetbol',
}

const sportLabel = (value) => SPORT_LABELS[norm(value)] || (value ? String(value) : 'Tiro con arco')

const statusOf = (value) => {
  const v = norm(value)
  if (v.includes('present')) return 'present'
  if (v.includes('tard') || v.includes('late')) return 'late'
  if (v.includes('ausen') || v.includes('absent')) return 'absent'
  return null
}

const STATUS = [
  { key: 'present', label: 'Presentes', Icon: CheckCircle2 },
  { key: 'late', label: 'Tarde', Icon: Clock },
  { key: 'absent', label: 'Ausentes', Icon: XCircle },
]

const pct = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0)
const fmt = (n) => new Intl.NumberFormat('es').format(n)

/* -------------------------------------------------------------------------- */

const KpiTile = ({ icon: Icon, label, value, hint, loading, featured }) => (
  <div className={`kpi-tile spot ${featured ? 'is-featured' : ''}`} onPointerMove={trackSpot}>
    <div className="kpi-head">
      <span className="kpi-icon" aria-hidden="true"><Icon size={16} strokeWidth={2} /></span>
      <span className="kpi-label">{label}</span>
    </div>
    <div className={`kpi-value tabular ${loading ? 'is-loading' : ''}`}>{loading ? '—' : value}</div>
    {hint && <div className="kpi-hint">{hint}</div>}
  </div>
)

/* Donut: attendance split by status. Status colors always ship with icon + label. */
const DONUT_R = 62
const DONUT_W = 14
const DONUT_C = 2 * Math.PI * DONUT_R
const DONUT_GAP = 3

const AttendanceSplit = ({ counts }) => {
  const [hover, setHover] = useState(null)
  const [drawn, setDrawn] = useState(false)
  const total = counts.present + counts.late + counts.absent

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  let offset = 0
  const segments = STATUS.filter((s) => counts[s.key] > 0).map((s) => {
    const len = (counts[s.key] / total) * DONUT_C
    const seg = { ...s, len: Math.max(len - DONUT_GAP, 1), offset }
    offset += len
    return seg
  })

  const focus = hover ? STATUS.find((s) => s.key === hover) : STATUS[0]
  const focusPct = pct(counts[focus.key], total)

  return (
    <div className="viz-card caja viz-featured">
      <div className="viz-head">
        <div>
          <h5>Asistencia</h5>
          <p>{total > 0 ? `${fmt(total)} registros en total` : 'Sin registros todavía'}</p>
        </div>
      </div>

      <div className="donut-wrap">
        <svg viewBox="0 0 160 160" className="donut" role="img" aria-label={STATUS.map((s) => `${s.label}: ${counts[s.key]}`).join(', ')}>
          <circle cx="80" cy="80" r={DONUT_R} className="donut-track" strokeWidth={DONUT_W} fill="none" />
          {segments.map((s) => (
            <circle
              key={s.key}
              cx="80"
              cy="80"
              r={DONUT_R}
              fill="none"
              strokeWidth={hover === s.key ? DONUT_W + 4 : DONUT_W}
              strokeLinecap="butt"
              className={`donut-seg seg-${s.key} ${hover && hover !== s.key ? 'is-dim' : ''}`}
              strokeDasharray={`${drawn ? s.len : 0} ${DONUT_C}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 80 80)"
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="donut-center" aria-hidden="true">
          <span className="donut-value tabular">{focusPct}%</span>
          <span className="donut-label">{focus.label.toLowerCase()}</span>
        </div>
      </div>

      <table className="legend-table on-dark">
        <tbody>
          {STATUS.map(({ key, label, Icon }) => (
            <tr
              key={key}
              className={hover && hover !== key ? 'is-dim' : ''}
              onMouseEnter={() => setHover(key)}
              onMouseLeave={() => setHover(null)}
            >
              <td>
                <span className={`legend-key status-${key}`} aria-hidden="true" />
                <Icon size={14} strokeWidth={2} className="legend-icon" aria-hidden="true" />
                {label}
              </td>
              <td className="num tabular">{fmt(counts[key])}</td>
              <td className="num tabular muted">{pct(counts[key], total)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DAY_ORDER = ['lun', 'mar', 'mié', 'mie', 'jue', 'vie', 'sáb', 'sab', 'dom']
const DAY_INDEX = { lun: 0, mar: 1, 'mié': 2, mie: 2, jue: 3, vie: 4, 'sáb': 5, sab: 5, dom: 6 }

const parseSchedule = (text) => {
  const s = norm(text)
  const day = DAY_ORDER.find((d) => s.startsWith(d))
  const time = (s.match(/\d{1,2}:\d{2}/) || [])[0] || ''
  return { day: day ? day.slice(0, 3) : '', dayIndex: day ? DAY_INDEX[day] : 9, time }
}

const UpcomingClasses = ({ rows }) => {
  const items = rows
    .map((r) => ({ ...r, ...parseSchedule(r.schedule) }))
    .sort((a, b) => a.dayIndex - b.dayIndex || a.time.localeCompare(b.time))
    .slice(0, 5)

  return (
    <div className="viz-card caja">
      <div className="viz-head">
        <div>
          <h5>Calendario semanal</h5>
          <p>Clases ordenadas por día y hora</p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="viz-empty">Sin horarios registrados</div>
      ) : (
        <ol className="agenda">
          {items.map((r) => (
            <li key={r.key} className="agenda-item">
              <span className="agenda-day">
                <span>{r.day ? r.day.charAt(0).toUpperCase() + r.day.slice(1) : '—'}</span>
                <small className="tabular">{r.time || '--:--'}</small>
              </span>
              <span className="agenda-body">
                <strong>{r.name}</strong>
                <span>{r.sport} · {r.coach}</span>
              </span>
              <span className="agenda-seats tabular" title="Inscritos / capacidad">
                {r.enrolled}<small>/{r.capacity || '—'}</small>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* Single-series column chart: classes per sport. No legend — the title names the series. */
const ClassesBySport = ({ rows }) => {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...rows.map((r) => r.value))
  const ticks = max <= 4 ? Array.from({ length: max + 1 }, (_, i) => i) : [0, Math.round(max / 2), max]

  return (
    <div className="viz-card caja">
      <div className="viz-head">
        <div>
          <h5>Clases por deporte</h5>
          <p>Número de clases registradas</p>
        </div>
      </div>

      <div className="col-chart">
        <div className="col-grid" aria-hidden="true">
          {ticks.slice().reverse().map((t) => (
            <div key={t} className="col-gridline" style={{ bottom: `${(t / max) * 100}%` }}>
              <span className="tabular">{t}</span>
            </div>
          ))}
        </div>
        <div className="col-plot">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`col-slot ${hover && hover !== r.label ? 'is-dim' : ''}`}
              onMouseEnter={() => setHover(r.label)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="col-bar-wrap">
                <div className="col-bar" style={{ height: `${(r.value / max) * 100}%` }}>
                  <span className="col-cap tabular">{r.value}</span>
                  {hover === r.label && (
                    <span className="viz-tooltip" role="tooltip">
                      <strong>{r.label}</strong> {r.value} {r.value === 1 ? 'clase' : 'clases'} · {fmt(r.capacity)} cupos
                    </span>
                  )}
                </div>
              </div>
              <span className="col-label">{r.label}</span>
            </div>
          ))}
          {rows.length === 0 && <div className="viz-empty">Sin clases registradas</div>}
        </div>
      </div>
    </div>
  )
}

const OccupancyMeter = ({ value }) => (
  <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={`Ocupación ${value}%`}>
    <div className="meter-track">
      <div className="meter-fill" style={{ transform: `scaleX(${Math.min(value, 100) / 100})` }} />
    </div>
    <span className="meter-value tabular">{value}%</span>
  </div>
)

/* -------------------------------------------------------------------------- */

const Dashboard = ({ token }) => {
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    let alive = true
    const safe = (p) => Promise.resolve(p).catch(() => null)

    Promise.all([
      safe(fetchClassList(token)),
      safe(fetchInscriptionList(token)),
      safe(fetchAttendanceList(token)),
      safe(fetchReportAttendance(token)),
      safe(fetchReportClassStats(token)),
      safe(fetchEnrolledStudents(token)),
    ]).then(([classes, inscriptions, attendance, repAtt, repClass, repEnrolled]) => {
      if (!alive) return
      setState({
        loading: false,
        classes: toArray(classes),
        inscriptions: toArray(inscriptions),
        attendance: toArray(attendance),
        repAtt: toObject(repAtt),
        repClass: toObject(repClass),
        repEnrolled: toObject(repEnrolled),
      })
    })

    return () => { alive = false }
  }, [token])

  const stats = useMemo(() => {
    if (state.loading) return null
    const { classes, inscriptions, attendance, repAtt, repClass, repEnrolled } = state

    // Attendance by status — prefer raw records, fall back to the report.
    const fromRecords = { present: 0, late: 0, absent: 0 }
    attendance.forEach((a) => {
      const s = statusOf(a.status)
      if (s) fromRecords[s] += 1
    })
    const recordTotal = fromRecords.present + fromRecords.late + fromRecords.absent
    const reportCounts = {
      present: Number(repAtt.present) || 0,
      late: Number(repAtt.late) || 0,
      absent: Number(repAtt.absent) || 0,
    }
    const reportTotal = reportCounts.present + reportCounts.late + reportCounts.absent
    const statusCounts = reportTotal > recordTotal ? reportCounts : fromRecords

    // Per-class table
    const classRows = classes.map((c, i) => {
      const name = c.name || c.title || c.className || `Clase ${i + 1}`
      const capacity = Number(c.maxCapacity ?? c.capacity) || 0
      const enrolledFromList = inscriptions.filter((r) => norm(r.className || r.class) === norm(name)).length
      const enrolled = Math.max(Number(c.currentEnrollment) || 0, Array.isArray(c.participants) ? c.participants.length : 0, enrolledFromList)
      const att = { present: 0, late: 0, absent: 0 }
      attendance
        .filter((a) => norm(a.className || a.class) === norm(name) || (a.classId && (a.classId === c._id || a.classId === c.id)))
        .forEach((a) => {
          const s = statusOf(a.status)
          if (s) att[s] += 1
        })
      const attTotal = att.present + att.late + att.absent
      return {
        key: c._id || c.id || name,
        name,
        sport: sportLabel(c.sport || c.type),
        coach: c.coach || c.instructorName || '—',
        schedule: typeof c.schedule === 'string' ? c.schedule : c.schedule?.day ? `${c.schedule.day} ${c.schedule.startTime || ''}`.trim() : '—',
        capacity,
        enrolled,
        occupancy: pct(enrolled, capacity),
        att,
        attTotal,
        attRate: attTotal > 0 ? pct(att.present + att.late, attTotal) : null,
      }
    })

    // Classes per sport
    const bySport = new Map()
    classRows.forEach((r) => {
      const prev = bySport.get(r.sport) || { label: r.sport, value: 0, capacity: 0 }
      bySport.set(r.sport, { ...prev, value: prev.value + 1, capacity: prev.capacity + r.capacity })
    })

    const totalCapacity = classRows.reduce((s, r) => s + r.capacity, 0)
    const totalEnrolled = Math.max(Number(repEnrolled.totalEnrolled) || 0, inscriptions.length)
    const occupancy = repClass.occupancyRate || `${pct(classRows.reduce((s, r) => s + r.enrolled, 0), totalCapacity)}%`
    const statusTotal = statusCounts.present + statusCounts.late + statusCounts.absent

    return {
      statusCounts,
      classRows,
      sports: Array.from(bySport.values()).sort((a, b) => b.value - a.value),
      kpis: {
        enrolled: totalEnrolled,
        newThisMonth: Number(repEnrolled.newThisMonth) || 0,
        activeClasses: Number(repClass.activeClasses) || classRows.length,
        totalClasses: Number(repClass.totalClasses) || classRows.length,
        occupancy,
        attendanceRate: statusTotal > 0 ? pct(statusCounts.present + statusCounts.late, statusTotal) : 0,
        weeklyTrend: repAtt.weeklyTrend,
        capacity: totalCapacity,
      },
      attendanceRows: classRows.filter((r) => r.attTotal > 0),
    }
  }, [state])

  const loading = state.loading
  const k = stats?.kpis

  return (
    <div className="stats-dashboard">
      <div className="kpi-grid">
        <KpiTile featured icon={Users2} label="Alumnos inscritos" loading={loading} value={k && <CountUp value={k.enrolled} format={fmt} />} hint={k && (k.newThisMonth ? `+${k.newThisMonth} este mes` : 'Total registrado')} />
        <KpiTile icon={Target} label="Clases activas" loading={loading} value={k && <CountUp value={k.activeClasses} format={fmt} />} hint={k && `de ${fmt(k.totalClasses)} clases en total`} />
        <KpiTile icon={Gauge} label="Ocupación" loading={loading} value={k && (/^\d+%$/.test(String(k.occupancy)) ? <CountUp value={parseInt(k.occupancy, 10)} format={(n) => `${n}%`} /> : k.occupancy)} hint={k && `${fmt(k.capacity)} cupos disponibles en total`} />
        <KpiTile icon={CalendarCheck} label="Tasa de asistencia" loading={loading} value={k && <CountUp value={k.attendanceRate} format={(n) => `${n}%`} />} hint={k && (k.weeklyTrend ? `${k.weeklyTrend} vs. semana anterior` : 'Presentes y tarde')} />
      </div>

      {stats && (
        <>
          <div className="viz-grid">
            <Reveal><AttendanceSplit counts={stats.statusCounts} /></Reveal>
            <Reveal delay={60}><ClassesBySport rows={stats.sports} /></Reveal>
            <Reveal delay={120}><UpcomingClasses rows={stats.classRows} /></Reveal>
          </div>

          <Reveal className="caja table-section">
            <div className="viz-head">
              <div>
                <h5>Ocupación por clase</h5>
                <p>Inscritos frente a la capacidad de cada clase</p>
              </div>
              <span className="result-badge tabular">{stats.classRows.length} clases</span>
            </div>
            <div className="table-responsive">
              <table className="table nicer-table stats-table">
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Deporte</th>
                    <th>Entrenador</th>
                    <th>Horario</th>
                    <th className="num">Inscritos</th>
                    <th className="num">Capacidad</th>
                    <th className="meter-col">Ocupación</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.classRows.map((r) => (
                    <tr key={r.key}>
                      <td className="strong">{r.name}</td>
                      <td><span className="sport-tag">{r.sport}</span></td>
                      <td>{r.coach}</td>
                      <td className="muted">{r.schedule}</td>
                      <td className="num">{fmt(r.enrolled)}</td>
                      <td className="num muted">{r.capacity ? fmt(r.capacity) : '—'}</td>
                      <td className="meter-col">{r.capacity ? <OccupancyMeter value={r.occupancy} /> : <span className="muted">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
                {stats.classRows.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={4}>Total</td>
                      <td className="num">{fmt(stats.classRows.reduce((s, r) => s + r.enrolled, 0))}</td>
                      <td className="num">{fmt(k.capacity)}</td>
                      <td className="meter-col">
                        <OccupancyMeter value={pct(stats.classRows.reduce((s, r) => s + r.enrolled, 0), k.capacity)} />
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Reveal>

          <Reveal className="caja table-section">
            <div className="viz-head">
              <div>
                <h5>Asistencia por clase</h5>
                <p>Registros de asistencia agrupados por clase</p>
              </div>
            </div>
            {stats.attendanceRows.length > 0 ? (
              <div className="table-responsive">
                <table className="table nicer-table stats-table">
                  <thead>
                    <tr>
                      <th>Clase</th>
                      <th className="num">Presentes</th>
                      <th className="num">Tarde</th>
                      <th className="num">Ausentes</th>
                      <th className="num">Registros</th>
                      <th className="meter-col">Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.attendanceRows.map((r) => (
                      <tr key={r.key}>
                        <td className="strong">{r.name}</td>
                        <td className="num">{fmt(r.att.present)}</td>
                        <td className="num">{fmt(r.att.late)}</td>
                        <td className="num">{fmt(r.att.absent)}</td>
                        <td className="num muted">{fmt(r.attTotal)}</td>
                        <td className="meter-col"><OccupancyMeter value={r.attRate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">Aún no hay asistencias vinculadas a una clase.</div>
            )}
          </Reveal>
        </>
      )}
    </div>
  )
}

export default Dashboard
