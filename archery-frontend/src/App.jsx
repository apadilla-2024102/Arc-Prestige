import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DataAdmin from './components/DataAdmin'
import Tabs from './components/Tabs'
import Dashboard from './components/Dashboard'
import HeroTarget from './components/HeroTarget'
import { trackSpot } from './components/motion'
import {
    login,
    fetchAttendanceList,
    fetchClassList,
    fetchInscriptionList,
    fetchReportAttendance,
    fetchReportClassStats,
    fetchEnrolledStudents,
    querySportsAI,
    sendContactMessage,
} from './api'
import {
    Target,
    Milestone,
    Calendar,
    ClipboardList,
    BarChart3,
    CheckCircle2,
    Users2,
    Activity,
    Volleyball,
    BrainCircuit,
    Star,
    Clock,
    HelpCircle,
    MessageCircle,
    ArrowUp,
    ArrowRight,
    X,
} from 'lucide-react'

const buildAuthServiceUrl = (path) => {
    const base = String(import.meta.env.VITE_AUTH_SERVICE_URL || '').trim().replace(/\/$/, '')
    return `${base}${path}`
}

const Icon = ({ name, size = 22 }) => {
    const icons = {
        archery: <Target size={size} strokeWidth={1.8} />,
        target: <Target size={size} strokeWidth={1.8} />,
        quiver: <Milestone size={size} strokeWidth={1.8} />,
        calendar: <Calendar size={size} strokeWidth={1.8} />,
        clipboard: <ClipboardList size={size} strokeWidth={1.8} />,
        chart: <BarChart3 size={size} strokeWidth={1.8} />,
        check: <CheckCircle2 size={size} strokeWidth={1.8} />,
        users: <Users2 size={size} strokeWidth={1.8} />,
        football: <Activity size={size} strokeWidth={1.8} />,
        basketball: <Volleyball size={size} strokeWidth={1.8} />,
        brain: <BrainCircuit size={size} strokeWidth={1.8} />,
        star: <Star size={size} strokeWidth={1.8} />,
        clock: <Clock size={size} strokeWidth={1.8} />,
        message: <MessageCircle size={size} strokeWidth={1.8} />,
    }

    return icons[name] || <HelpCircle size={size} strokeWidth={1.8} />
}

const archeryServices = [
    {
        key: 'attendance',
        title: 'Asistencia',
        desc: 'Revisa los registros de asistencia disponibles.',
        actionLabel: 'Ver asistencias',
        action: fetchAttendanceList,
        accent: 'calendar',
    },
    {
        key: 'inscription',
        title: 'Inscripciones',
        desc: 'Consulta las inscripciones registradas.',
        actionLabel: 'Ver inscripciones',
        action: fetchInscriptionList,
        accent: 'quiver',
    },
    {
        key: 'class',
        title: 'Clases',
        desc: 'Mira las clases activas y la información de cada una.',
        actionLabel: 'Ver clases',
        action: fetchClassList,
        accent: 'archery',
    },
    {
        key: 'report-class',
        title: 'Reporte de clases',
        desc: 'Obtén el reporte de estadísticas de clases.',
        actionLabel: 'Ver reporte de clases',
        action: fetchReportClassStats,
        accent: 'chart',
    },
    {
        key: 'report-attendance',
        title: 'Reporte de asistencia',
        desc: 'Consulta el reporte de asistencia general.',
        actionLabel: 'Ver reporte de asistencia',
        action: fetchReportAttendance,
        accent: 'check',
    },
    {
        key: 'report-enrolled',
        title: 'Estudiantes inscritos',
        desc: 'Revisa el reporte de alumnos inscritos.',
        actionLabel: 'Ver inscritos',
        action: fetchEnrolledStudents,
        accent: 'users',
    },
]

const sportsConfig = [
    {
        key: 'archery',
        title: 'Tiro con arco',
        icon: 'archery',
        summary: 'Enfoque principal del sistema',
        description: 'Gestiona clases, asistencias e inscripciones con una experiencia centrada en entrenamiento, competencia y seguimiento del rendimiento.',
        highlights: ['Entrenamientos', 'Asistencia', 'Inscripciones'],
        modules: [
            { title: 'Clases y entrenamientos', desc: 'Organiza sesiones, niveles y objetivos por alumno.', accent: 'target' },
            { title: 'Seguimiento de asistencia', desc: 'Monitorea presentismo, atrasos y evaluaciones.', accent: 'calendar' },
            { title: 'Inscripción y progreso', desc: 'Registra nuevos participantes y su evolución.', accent: 'quiver' },
        ],
    },
    {
        key: 'football',
        title: 'Fútbol',
        icon: 'football',
        summary: 'Gestión deportiva para cancha',
        description: 'Abrir este módulo permite trabajar con planes de entrenamiento, partidos y seguimiento de equipos desde una visión más enfocada al fútbol.',
        highlights: ['Plan de sesiones', 'Partidos', 'Equipos'],
        modules: [
            { title: 'Plan de entrenamientos', desc: 'Diseña bloques de trabajo para defensa, ataque y resistencia.', accent: 'brain' },
            { title: 'Partidos y calendario', desc: 'Organiza encuentros y define la preparación previa.', accent: 'calendar' },
            { title: 'Seguimiento del equipo', desc: 'Mantén el foco en roles, posiciones y rendimiento.', accent: 'users' },
        ],
    },
    {
        key: 'basketball',
        title: 'Básquetbol',
        icon: 'basketball',
        summary: 'Control del rendimiento en cancha',
        description: 'Este apartado está pensado para administrar entrenamientos, rotaciones y seguimiento de jugadores con un enfoque de básquet.',
        highlights: ['Rotaciones', 'Técnica', 'Rendimiento'],
        modules: [
            { title: 'Rutinas de entrenamiento', desc: 'Coordina ejercicios, tiros libres y trabajo defensivo.', accent: 'basketball' },
            { title: 'Control de partidos', desc: 'Registra estadísticas, faltas y momentos clave.', accent: 'chart' },
            { title: 'Seguimiento de jugadores', desc: 'Monitorea progreso por posición y nivel.', accent: 'star' },
        ],
    },
]

const sportServiceMap = {
    archery: archeryServices,
    football: [
        {
            key: 'football-training',
            title: 'Plan de entrenamientos',
            desc: 'Vista preparada para sesiones, ejercicios y preparación del equipo.',
            actionLabel: 'Abrir plan de fútbol',
            action: async () => ({ success: true, message: 'Módulo de fútbol listo para trabajar.', source: 'demo', data: [{ name: 'Sesión táctica', focus: 'Ataque y transición', level: 'Avanzado' }] }),
            accent: 'football',
        },
        {
            key: 'football-matches',
            title: 'Partidos',
            desc: 'Organiza calendario, rivales y resultados del equipo.',
            actionLabel: 'Ver calendario',
            action: async () => ({ success: true, message: 'Calendario de fútbol disponible.', source: 'demo', data: [{ name: 'Partido de exhibición', date: '2026-07-20', status: 'Pendiente' }] }),
            accent: 'calendar',
        },
    ],
    basketball: [
        {
            key: 'basketball-training',
            title: 'Rutinas de entrenamiento',
            desc: 'Módulo para trabajar ejercicios, defensa y tiros.',
            actionLabel: 'Abrir entrenamiento',
            action: async () => ({ success: true, message: 'Módulo de básquet listo para trabajar.', source: 'demo', data: [{ name: 'Sesión de tiros', focus: 'Precisión', level: 'Intermedio' }] }),
            accent: 'basketball',
        },
        {
            key: 'basketball-stats',
            title: 'Estadísticas',
            desc: 'Registra rendimiento, faltas y puntos del equipo.',
            actionLabel: 'Ver estadísticas',
            action: async () => ({ success: true, message: 'Estadísticas de básquet disponibles.', source: 'demo', data: [{ name: 'Rendimiento semanal', points: 84, fouls: 12 }] }),
            accent: 'chart',
        },
    ],
}

const App = () => {
    const [token, setToken] = useState('')
    const [user, setUser] = useState(null)
    const [credentials, setCredentials] = useState({ emailOrUsername: '', password: '' })
    const [loginError, setLoginError] = useState('')
    const [loadingService, setLoadingService] = useState('')
    const [serviceResult, setServiceResult] = useState(null)
    const [serviceMessage, setServiceMessage] = useState('')
    const [showAdmin, setShowAdmin] = useState(false)
    const [viewMode, setViewMode] = useState('formatted') // 'formatted' | 'json' | 'cards'
    const [selectedSport, setSelectedSport] = useState('archery')
    const [mainTab, setMainTab] = useState('dashboard')
    const [aiOpen, setAiOpen] = useState(false)
    const [userRole, setUserRole] = useState('admin')
    const [aiLoading, setAiLoading] = useState(false)
    const [aiMessages, setAiMessages] = useState([
        { role: 'assistant', text: 'Soy SportsBot, tu asistente deportivo. Pregunta algo sobre deportes.' },
    ])
    const [aiQuery, setAiQuery] = useState('')
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
    const [contactStatus, setContactStatus] = useState('')
    const [contactLoading, setContactLoading] = useState(false)
    const [pendingSection, setPendingSection] = useState(null)
    const aiInputRef = useRef(null)
    const aiEndRef = useRef(null)

    const activeSport = sportsConfig.find((sport) => sport.key === selectedSport) || sportsConfig[0]
    const visibleServices = sportServiceMap[selectedSport] || archeryServices

    const normalizeUserValue = (value) => String(value || '').trim().toLowerCase()
    const userMatch = (value) => {
        const normalized = normalizeUserValue(value)
        if (!normalized || !user) return false
        return [user.email, user.username, user.name, user.id]
            .filter(Boolean)
            .some((field) => normalizeUserValue(field).includes(normalized) || normalized.includes(normalizeUserValue(field)))
    }

    const filterToCurrentUser = (items) => {
        if (!Array.isArray(items) || !user) return []
        return items.filter((item) => {
            if (!item || typeof item !== 'object') return false
            return [
                item.studentEmail,
                item.email,
                item.studentName,
                item.student,
                item.name,
                item.username,
                item.studentId,
                item.userId,
                item.userID,
                item.student_id,
            ].some((value) => userMatch(value))
        })
    }

    useEffect(() => {
        if (!pendingSection) return

        const scrollToSection = () => {
            const element = document.getElementById(pendingSection)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setPendingSection(null)
            }
        }

        const timeoutId = window.setTimeout(scrollToSection, 120)
        return () => window.clearTimeout(timeoutId)
    }, [pendingSection, mainTab])

    const handleQuickLinkClick = (event, targetId) => {
        event.preventDefault()
        setPendingSection(targetId)

        if (targetId === 'modulos' || targetId === 'reservas') {
            setMainTab('modulos')
        }
    }

    const handleContactSubmit = async (event) => {
        event.preventDefault()

        const name = contactForm.name.trim()
        const email = contactForm.email.trim()
        const message = contactForm.message.trim()

        if (!name || !email || !message) {
            setContactStatus('Completa tu nombre, correo y mensaje para enviarnos un correo.')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setContactStatus('Ingresa un correo electrónico válido antes de enviar.')
            return
        }

        setContactLoading(true)
        setContactStatus('')

        try {
            const result = await sendContactMessage({ name, email, message })
            setContactStatus(result?.message || 'Tu mensaje fue enviado correctamente.')
            setContactForm({ name: '', email: '', message: '' })
        } catch (error) {
            setContactStatus(error?.message || 'No pudimos enviar tu mensaje en este momento. Intenta nuevamente en unos minutos.')
        } finally {
            setContactLoading(false)
        }
    }

    const regularUserServices = [
        {
            key: 'attendance',
            title: 'Mis asistencias',
            desc: 'Consulta tus asistencias registradas.',
            actionLabel: 'Ver mi asistencia',
            action: async (token) => {
                const result = await fetchAttendanceList(token)
                return Array.isArray(result) ? filterToCurrentUser(result) : result
            },
            accent: 'calendar',
        },
        {
            key: 'inscription',
            title: 'Mis inscripciones',
            desc: 'Revisa tus inscripciones activas.',
            actionLabel: 'Ver mis inscripciones',
            action: async (token) => {
                const result = await fetchInscriptionList(token)
                return Array.isArray(result) ? filterToCurrentUser(result) : result
            },
            accent: 'quiver',
        },
        {
            key: 'classes',
            title: 'Clases disponibles',
            desc: 'Explora clases disponibles para ti.',
            actionLabel: 'Ver clases',
            action: fetchClassList,
            accent: 'archery',
        },
    ]

    const effectiveServices = userRole === 'user' ? regularUserServices : visibleServices
    const mainTabs = [
        { key: 'dashboard', label: 'Resumen' },
        { key: 'servicios', label: 'Servicios' },
        { key: 'modulos', label: 'Módulos' },
    ]

    // Helpers to render service data in nicer formats
    const getColumns = (arr) => {
        const cols = new Set()
        arr.forEach((r) => {
            if (r && typeof r === 'object') Object.keys(r).forEach((k) => cols.add(k))
        })
        return cols
    }

    const formatCell = (v) => {
        if (v === null || v === undefined) return '-'
        if (typeof v === 'string' && /202\d-\d{2}-\d{2}T/.test(v)) {
            try { return new Date(v).toLocaleString() } catch (e) { return v }
        }
        if (typeof v === 'object') return JSON.stringify(v)
        return String(v)
    }

    const renderCellValue = (v) => {
        if (v === null || v === undefined) return '-'
        if (typeof v === 'string' && /present|late|absent|pend/i.test(v)) {
            const lower = String(v).toLowerCase()
            const cls = lower.includes('present') ? 'badge-present' : lower.includes('late') ? 'badge-late' : lower.includes('absent') ? 'badge-absent' : 'badge-neutral'
            return <span className={cls}>{v}</span>
        }
        return formatCell(v)
    }

    const labelMap = {
        id: 'ID',
        name: 'Nombre',
        level: 'Nivel',
        totalEnrolled: 'Total inscritos',
        newThisMonth: 'Nuevos este mes',
        averageAge: 'Edad promedio',
        topProgram: 'Programa principal',
        totalClasses: 'Clases totales',
        activeClasses: 'Clases activas',
        occupancyRate: 'Tasa de ocupación',
        bestRatedCoach: 'Mejor entrenador',
        present: 'Presentes',
        late: 'Tarde',
        absent: 'Ausentes',
        weeklyTrend: 'Tendencia semanal',
        capacity: 'Capacidad',
        status: 'Estado',
        studentName: 'Alumno',
        className: 'Clase',
        date: 'Fecha',
        sport: 'Deporte',
        coach: 'Entrenador',
        schedule: 'Horario',
        instructorName: 'Instructor',
        studentEmail: 'Correo',
        email: 'Correo',
    }

    const labelFor = (k) => labelMap[k] || k

    const renderObjectFields = (obj) => {
        if (!obj || typeof obj !== 'object') return null
        return (
            <div className="cards-grid">
                {Object.entries(obj).map(([k, v]) => (
                    <div key={k} className="data-card">
                        <div className="data-card-header">
                            <h5>{labelFor(k)}</h5>
                        </div>
                        <div className="data-card-body">
                            <div className="data-field">
                                <div className="data-label">Valor</div>
                                <div className="data-value">{renderCellValue(v)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    useEffect(() => {
        const savedToken = sessionStorage.getItem('authToken')
        const savedUser = sessionStorage.getItem('authUser')
        const savedRole = sessionStorage.getItem('authRole')
        if (savedToken) {
            setToken(savedToken)
        }
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        if (savedRole) {
            setUserRole(savedRole)
        }
    }, [])

    const [loadingLogin, setLoadingLogin] = useState(false)

    const validateLogin = () => {
        const emailOrUsername = credentials.emailOrUsername.trim()
        const password = credentials.password

        if (!emailOrUsername) {
            setLoginError('Ingresa tu correo o usuario.')
            return false
        }
        if (!password) {
            setLoginError('Ingresa tu contraseña.')
            return false
        }
        if (password.length < 4) {
            setLoginError('La contraseña debe tener al menos 4 caracteres.')
            return false
        }

        return true
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoginError('')
        if (!validateLogin()) {
            return
        }
        setLoadingLogin(true)
        try {
            const result = await login(credentials)
            if (!result.success) {
                throw new Error(result.message || 'Credenciales incorrectas')
            }

            const authToken = result.token || ''
            setToken(authToken)
            setUser(result.userDetails)
            setUserRole(result.userDetails?.role || 'admin')
            // Store only non-sensitive user info; tokens are handled by HttpOnly cookies
            if (authToken) sessionStorage.setItem('authToken', authToken)
            sessionStorage.setItem('authUser', JSON.stringify(result.userDetails))
            sessionStorage.setItem('authRole', result.userDetails?.role || 'admin')
            setServiceMessage('Sesión iniciada correctamente. Ya puedes usar los servicios.')
            setServiceResult(null)
        } catch (error) {
            setLoginError(error.message || 'No se pudo iniciar sesión')
            setToken('')
            setUser(null)
            sessionStorage.removeItem('authToken')
            sessionStorage.removeItem('authUser')
        } finally {
            setLoadingLogin(false)
        }
    }

    const handleLogout = () => {
        // If auth service configured, call logout to revoke refresh token and clear cookies
        if (import.meta.env.VITE_AUTH_SERVICE_URL) {
            fetch(buildAuthServiceUrl('/api/v1/auth/logout'), { method: 'POST', credentials: 'include' }).catch(() => {})
        }

        setToken('')
        setUser(null)
        setUserRole('admin')
        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('authUser')
        sessionStorage.removeItem('authRole')
        setServiceResult(null)
        setServiceMessage('Sesión cerrada.')
    }

    const executeService = async (service) => {
        if (!token) {
            setServiceMessage('Debes iniciar sesión primero.')
            setServiceResult(null)
            return
        }

        setLoadingService(service.key)
        setServiceMessage(`Consultando ${service.title}...`)
        setServiceResult(null)

        try {
            const result = await service.action(token)
            setServiceResult(result)
            setServiceMessage(`${service.title} cargado correctamente.`)
        } catch (error) {
            setServiceMessage(error.message || 'Error al consultar el servicio')
            setServiceResult(null)
        } finally {
            setLoadingService('')
        }
    }

    const handleAiSend = async () => {
        if (!aiQuery.trim()) return
        const messageText = aiQuery.trim()
        setAiMessages((prev) => [...prev, { role: 'user', text: messageText }])
        setAiQuery('')
        setAiLoading(true)

        try {
            const result = await querySportsAI(messageText, token)
            const responseText = result?.answer || result?.message || result?.data || 'No se recibió una respuesta válida.'
            setAiMessages((prev) => [...prev, { role: 'assistant', text: String(responseText) }])
        } catch (error) {
            setAiMessages((prev) => [...prev, { role: 'assistant', text: `Error al obtener respuesta: ${error.message || 'No disponible'}` }])
        } finally {
            setAiLoading(false)
            window.requestAnimationFrame(() => aiEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
        }
    }

    const handleAiToggle = () => {
        setAiOpen((open) => {
            const nextOpen = !open
            if (nextOpen) {
                setTimeout(() => aiInputRef.current?.focus({ preventScroll: true }), 120)
            }
            return nextOpen
        })
    }

    const userName = user?.name || user?.username || 'Usuario'
    const roleLabel = userRole === 'admin' ? 'Profesor / Administrador' : 'Alumno'

    const renderRecordCard = (row, idx, limit) => {
        const title = row.name || row.className || row.studentName || row.id || `Registro ${idx + 1}`
        const subtitle = row.level || row.status || ''
        return (
            <div key={idx} className="data-card">
                <div className="data-card-header">
                    <h5>{title}</h5>
                    {subtitle && <div className="data-card-sub">{subtitle}</div>}
                </div>
                <div className="data-card-body">
                    {Object.entries(row).slice(0, limit).map(([k, v]) => (
                        <div key={k} className="data-field">
                            <div className="data-label">{labelFor(k)}</div>
                            <div className="data-value">{renderCellValue(v)}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="login-split">
                <aside className="login-showcase">
                    <div className="login-pattern" aria-hidden="true" />
                    <div className="login-showcase-top">
                        <span className="login-brand" aria-hidden="true">
                            <Target size={18} strokeWidth={1.8} />
                        </span>
                        <span className="login-showcase-name">Arc Prestige</span>
                    </div>
                    <div className="login-showcase-copy">
                        <h1>Precisión en cada clase.</h1>
                        <p>Clases, asistencias, inscripciones y reportes de tu academia en un solo panel.</p>
                    </div>
                    <HeroTarget />
                    <ul className="login-showcase-features">
                        <li><Calendar size={16} strokeWidth={1.8} /> Asistencia en tiempo real</li>
                        <li><Users2 size={16} strokeWidth={1.8} /> Inscripciones y alumnos</li>
                        <li><BarChart3 size={16} strokeWidth={1.8} /> Reportes y estadísticas</li>
                    </ul>
                </aside>

                <main className="login-only-page">
                    <div className="login-only-card">
                        <div className="login-only-header">
                            <span className="login-only-badge">Bienvenido de nuevo</span>
                            <h2>Inicia sesión</h2>
                            <p>Ingresa tu correo o usuario y tu contraseña para continuar.</p>
                        </div>
                        <form onSubmit={handleLogin} className="login-only-form" noValidate>
                            <div className="field">
                                <label htmlFor="login-user">Correo o usuario</label>
                                <input
                                    id="login-user"
                                    className="form-control"
                                    value={credentials.emailOrUsername}
                                    onChange={(e) => setCredentials((prev) => ({ ...prev, emailOrUsername: e.target.value }))}
                                    placeholder="tu@correo.com"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="login-pass">Contraseña</label>
                                <input
                                    id="login-pass"
                                    type="password"
                                    className="form-control"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            {loginError && <p className="form-error" role="alert">{loginError}</p>}
                            <button className="btn-modulo btn-block login-only-button" type="submit" disabled={loadingLogin}>
                                {loadingLogin ? <><span className="spinner" aria-hidden="true" />Iniciando sesión</> : <>Ingresar <ArrowRight size={16} strokeWidth={2} className="btn-arrow" /></>}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="app-shell">
            <Navbar userName={userName} onLogout={handleLogout} />
            <Hero userName={userName} roleLabel={roleLabel} compact={userRole !== 'admin'} />

            <section id="dashboard" className={`container login-panel ${userRole === 'admin' ? 'has-admin' : 'no-admin'}`}>
                <div className="toolbar">
                    <Tabs tabs={mainTabs} value={mainTab} onChange={setMainTab} ariaLabel="Secciones" />
                    {userRole === 'admin' && (
                        <button className={`btn-secondary-soft ${showAdmin ? 'is-active' : ''}`} onClick={() => setShowAdmin((s) => !s)}>
                            {showAdmin ? 'Ocultar administración' : 'Administrar datos'}
                        </button>
                    )}
                </div>

                {mainTab === 'dashboard' && (
                    <div className="dashboard-summary tab-panel" key="dashboard">
                        <div className="section-head">
                            <span className="section-eyebrow">Panel</span>
                            <h2>Resumen general</h2>
                        </div>
                        <Dashboard token={token} role={userRole} filterMine={filterToCurrentUser} />
                        <div className="caja quick-card">
                            <div>
                                <h5>Acceso rápido</h5>
                                <p>Salta directo a lo que necesitas.</p>
                            </div>
                            <div className="dashboard-quick-buttons">
                                <button className="btn-modulo" onClick={() => setMainTab('servicios')}>Ver servicios</button>
                                <button className="btn-secondary-soft" onClick={() => setMainTab('modulos')}>Ver módulos</button>
                            </div>
                        </div>
                    </div>
                )}

                {mainTab === 'modulos' && (
                    <div className="tab-panel" key="modulos">
                        <div id="modulos" className="titulo-principal section-head">
                            <span className="section-eyebrow">Deportes</span>
                            <h2>Módulos deportivos</h2>
                            <p>El foco principal es el tiro con arco, pero puedes abrir otros deportes con sus propios módulos y flujos.</p>
                        </div>

                        <div id="reservas" className="sport-nav-grid">
                            {sportsConfig.map((sport) => (
                                <button
                                    key={sport.key}
                                    type="button"
                                    aria-pressed={selectedSport === sport.key}
                                    className={`sport-selector-card spot ${selectedSport === sport.key ? 'active' : ''}`}
                                    onPointerMove={trackSpot}
                                    onClick={() => {
                                        setSelectedSport(sport.key)
                                        setServiceResult(null)
                                        setServiceMessage(`${sport.title} seleccionado.`)
                                    }}
                                >
                                    <div className="sport-selector-icon"><Icon name={sport.icon} size={20} /></div>
                                    <div className="sport-selector-copy">
                                        <h4>{sport.title}</h4>
                                        <p>{sport.summary}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="sport-focus-card caja">
                            <div className="sport-focus-main">
                                <p className="sport-pill">{activeSport.title}</p>
                                <h3>Enfoque {activeSport.title.toLowerCase()}</h3>
                                <p>{activeSport.description}</p>
                                <div className="sport-highlights">
                                    {activeSport.highlights.map((item) => (
                                        <span key={item}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="sport-focus-side">
                                <h5>Módulos disponibles</h5>
                                {activeSport.modules.map((module) => (
                                    <div key={module.title} className="sport-module-item">
                                        <div className="sport-module-icon"><Icon name={module.accent} size={16} /></div>
                                        <div>
                                            <strong>{module.title}</strong>
                                            <p>{module.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {mainTab === 'servicios' && (
                    <div className="servicios tab-panel" id="servicios" key="servicios">
                        <div className="section-head">
                            <span className="section-eyebrow">Servicios</span>
                            <h2>{userRole === 'user' ? 'Tus servicios' : `Servicios de ${activeSport.title.toLowerCase()}`}</h2>
                            <p>Consulta la información y revisa el resultado más abajo.</p>
                        </div>
                        <div className="service-grid">
                            {effectiveServices.map((service, idx) => {
                                const isLoading = loadingService === service.key
                                return (
                                    <div key={service.key} className="card-modulo service-card spot" onPointerMove={trackSpot} style={{ animationDelay: `${Math.min(idx, 6) * 40}ms` }}>
                                        <div className="contenido">
                                            <div className="service-badge"><Icon name={service.accent} size={18} /></div>
                                            <h4>{service.title}</h4>
                                            <p>{service.desc}</p>
                                            <button
                                                className="btn-secondary-soft service-action"
                                                onClick={() => executeService(service)}
                                                disabled={isLoading}
                                                aria-busy={isLoading}
                                            >
                                                {isLoading ? <><span className="spinner" aria-hidden="true" />Cargando</> : <>{service.actionLabel} <ArrowRight size={15} strokeWidth={2} className="btn-arrow" /></>}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </section>

            <button
                className="ai-launcher"
                onClick={handleAiToggle}
                aria-label={aiOpen ? 'Cerrar Sports AI' : 'Abrir Sports AI'}
                aria-expanded={aiOpen}
            >
                <MessageCircle size={18} strokeWidth={2} />
                <span className="ai-launcher-label">Sports AI</span>
            </button>

            <aside className={`ai-panel ${aiOpen ? 'ai-panel-open' : ''}`} aria-hidden={!aiOpen} inert={aiOpen ? undefined : ''}>
                <div className="ai-panel-header">
                    <div>
                        <h5>Sports AI</h5>
                        <p>Tu asistente deportivo en tiempo real.</p>
                    </div>
                    <button className="ai-close-btn" onClick={handleAiToggle} aria-label="Cerrar asistente">
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>
                <div className="ai-messages">
                    {aiMessages.map((message, index) => (
                        <div key={index} className={`ai-message ${message.role}`}>
                            <span className="ai-message-role">{message.role === 'user' ? 'Tú' : 'SportsBot'}</span>
                            <p>{message.text || 'Cargando...'}</p>
                        </div>
                    ))}
                    {aiLoading && (
                        <div className="ai-message assistant ai-typing" aria-label="Escribiendo">
                            <span /><span /><span />
                        </div>
                    )}
                    <div ref={aiEndRef} />
                </div>
                <div className="ai-input-row">
                    <input
                        className="form-control"
                        placeholder="Escribe una pregunta deportiva..."
                        value={aiQuery}
                        ref={aiInputRef}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiSend())}
                    />
                    <button className="btn-modulo ai-send-btn" onClick={handleAiSend} disabled={aiLoading || !aiQuery.trim()} aria-label="Enviar">
                        <ArrowUp size={16} strokeWidth={2.2} />
                    </button>
                </div>
            </aside>

            {showAdmin && userRole === 'admin' && (
                <section className="container section-gap" id="admin-panel">
                    <DataAdmin token={token} />
                </section>
            )}

            <section className="container section-gap">
                <div className="caja result-card">
                    <div className="result-header">
                        <div>
                            <h4>Resultado del módulo</h4>
                            <p className="text-muted">{serviceMessage || 'Selecciona un servicio para ver sus datos aquí.'}</p>
                        </div>
                        <div className="result-meta">
                            {Array.isArray(serviceResult) && <span className="result-badge tabular">{serviceResult.length} registros</span>}
                            {serviceResult && (
                                <Tabs
                                    size="sm"
                                    ariaLabel="Modo de vista"
                                    tabs={[{ key: 'formatted', label: 'Tabla' }, { key: 'cards', label: 'Tarjetas' }]}
                                    value={viewMode === 'cards' ? 'cards' : 'formatted'}
                                    onChange={setViewMode}
                                />
                            )}
                        </div>
                    </div>
                    {serviceResult ? (
                        <div className="output-card" key={serviceMessage}>
                            {Array.isArray(serviceResult) ? (
                                serviceResult.length === 0 ? (
                                    <div className="empty-state">No hay registros para mostrar.</div>
                                ) : viewMode === 'cards' ? (
                                    <div className="cards-grid">
                                        {serviceResult.map((row, idx) => renderRecordCard(row, idx, 10))}
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table nicer-table">
                                            <thead>
                                                <tr>
                                                    {Array.from(getColumns(serviceResult)).slice(0, 8).map((k) => (
                                                        <th key={k}>{labelFor(k)}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {serviceResult.map((row, i) => (
                                                    <tr key={i}>
                                                        {Array.from(getColumns(serviceResult)).slice(0, 8).map((k) => (
                                                            <td key={k}>{renderCellValue(row[k])}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ) : typeof serviceResult === 'object' && serviceResult !== null ? (
                                <div className="result-object">
                                    <dl className="result-summary">
                                        {serviceResult.success !== undefined && (
                                            <div><dt>Estado</dt><dd><span className={serviceResult.success ? 'badge-present' : 'badge-absent'}>{serviceResult.success ? 'OK' : 'Error'}</span></dd></div>
                                        )}
                                        {serviceResult.message && <div><dt>Mensaje</dt><dd>{serviceResult.message}</dd></div>}
                                        {serviceResult.source && <div><dt>Fuente</dt><dd>{serviceResult.source === 'demo' ? 'Modo demostración' : serviceResult.source}</dd></div>}
                                    </dl>
                                    {serviceResult.data && (
                                        Array.isArray(serviceResult.data) ? (
                                            viewMode === 'json' ? (
                                                <pre className="result-pre">{JSON.stringify(serviceResult.data, null, 2)}</pre>
                                            ) : (
                                                <div className="cards-grid">
                                                    {serviceResult.data.map((row, idx) => renderRecordCard(row, idx, 8))}
                                                </div>
                                            )
                                        ) : typeof serviceResult.data === 'object' && serviceResult.data !== null ? (
                                            renderObjectFields(serviceResult.data)
                                        ) : (
                                            <pre className="result-pre">{JSON.stringify(serviceResult.data, null, 2)}</pre>
                                        )
                                    )}
                                    {!serviceResult.success && !serviceResult.message && !serviceResult.data && renderObjectFields(serviceResult)}
                                </div>
                            ) : (
                                <pre className="result-pre">{String(serviceResult)}</pre>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <BarChart3 size={18} strokeWidth={1.8} />
                            Aún no has consultado ningún servicio.
                        </div>
                    )}
                </div>
            </section>

            <footer className="site-footer">
                <div className="container footer-grid">
                    <div>
                        <span className="footer-brand">Arc Prestige</span>
                        <p className="footer-copy">Gestión deportiva para academias de tiro con arco y más.</p>
                        <div className="quick-links">
                            <a href="#inicio" onClick={(event) => handleQuickLinkClick(event, 'inicio')}>Inicio</a>
                            <a href="#modulos" onClick={(event) => handleQuickLinkClick(event, 'modulos')}>Módulos</a>
                            <a href="#reservas" onClick={(event) => handleQuickLinkClick(event, 'reservas')}>Reservas</a>
                            <a href="#contacto" onClick={(event) => handleQuickLinkClick(event, 'contacto')}>Contacto</a>
                        </div>
                    </div>
                    <div id="contacto" className="formulario">
                        <h4>Contacto</h4>
                        <p className="footer-copy">¿Dudas o sugerencias? Escríbenos.</p>
                        <form onSubmit={handleContactSubmit} noValidate>
                            <div className="form-row-2">
                                <input
                                    className="form-control"
                                    placeholder="Nombre"
                                    aria-label="Nombre"
                                    value={contactForm.name}
                                    onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                                    required
                                />
                                <input
                                    className="form-control"
                                    placeholder="Correo"
                                    aria-label="Correo"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                                    required
                                />
                            </div>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Mensaje"
                                aria-label="Mensaje"
                                value={contactForm.message}
                                onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                                required
                            />
                            <div className="form-actions">
                                {contactStatus && <p className="form-status" role="status">{contactStatus}</p>}
                                <button className="btn-modulo" type="submit" disabled={contactLoading}>
                                    {contactLoading ? <><span className="spinner" aria-hidden="true" />Enviando</> : 'Enviar mensaje'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="container copyright">© {new Date().getFullYear()} Arc Prestige</div>
            </footer>
        </div>
    )
}

export default App
