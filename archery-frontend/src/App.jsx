import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DataAdmin from './components/DataAdmin'
import {
    login,
    fetchAttendanceList,
    fetchClassList,
    fetchInscriptionList,
    fetchReportAttendance,
    fetchReportClassStats,
    fetchEnrolledStudents,
    querySportsAI,
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
} from 'lucide-react'

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
    const aiInputRef = useRef(null)

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
            return <span className={cls} style={{ padding: '6px 10px', borderRadius: 999, fontWeight: 700 }}>{v}</span>
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
        const savedToken = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('authUser')
        const savedRole = localStorage.getItem('authRole')
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
            if (!result.success || !result.token) {
                throw new Error(result.message || 'Credenciales incorrectas')
            }

            const authToken = result.token
            setToken(authToken)
            setUser(result.userDetails)
            setUserRole(result.userDetails?.role || 'admin')
            localStorage.setItem('authToken', authToken)
            localStorage.setItem('authUser', JSON.stringify(result.userDetails))
            localStorage.setItem('authRole', result.userDetails?.role || 'admin')
            setServiceMessage('Sesión iniciada correctamente. Ya puedes usar los servicios.')
            setServiceResult(null)
        } catch (error) {
            setLoginError(error.message || 'No se pudo iniciar sesión')
            setToken('')
            setUser(null)
            localStorage.removeItem('authToken')
            localStorage.removeItem('authUser')
        } finally {
            setLoadingLogin(false)
        }
    }

    const handleLogout = () => {
        setToken('')
        setUser(null)
        setUserRole('admin')
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        localStorage.removeItem('authRole')
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
            window.requestAnimationFrame(() => aiInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
        }
    }

    const handleAiToggle = () => {
        setAiOpen((open) => {
            const nextOpen = !open
            if (nextOpen) {
                setTimeout(() => aiInputRef.current?.focus(), 250)
            }
            return nextOpen
        })
    }

    if (!token) {
        return (
            <div className="login-only-page">
                <div className="login-only-card">
                    <div className="login-only-header">
                        <div>
                            <span className="login-only-badge">Arc Prestige</span>
                            <h2>Iniciar sesión</h2>
                            <p>Ingresa tu correo electrónico o usuario y contraseña para continuar.</p>
                            <div className="login-only-features">
                                <span>Clases</span>
                                <span>Asistencias</span>
                                <span>Reportes</span>
                            </div>
                        </div>
                        <div className="login-only-visual" aria-hidden="true">
                            <div className="login-only-blob login-only-blob-1" />
                            <div className="login-only-blob login-only-blob-2" />
                        </div>
                    </div>
                    <form onSubmit={handleLogin} className="login-only-form">
                        <div className="mb-3">
                            <label>Correo electrónico o usuario</label>
                            <input
                                className="form-control"
                                value={credentials.emailOrUsername}
                                onChange={(e) => setCredentials((prev) => ({ ...prev, emailOrUsername: e.target.value }))}
                                placeholder="Usuario o correo"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={credentials.password}
                                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="Contraseña"
                                required
                            />
                        </div>
                        <button className="btn-modulo w-100 login-only-button" type="submit" disabled={loadingLogin}>
                            {loadingLogin ? 'Iniciando sesión...' : 'Ingresar'}
                        </button>
                        {loginError && <p className="text-danger mt-3">{loginError}</p>}
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <Hero />

            <section id="dashboard" className="container login-panel">
                <div className="row gx-4 gy-4 justify-content-center">
                    <div className="col-lg-8">
                        <div className="caja premium-card">
                            <div className="row align-items-center">
                                <div className="col-lg-8">
                                    <h4>Bienvenido de nuevo</h4>
                                    <p>Hola <strong>{user?.name || user?.username || 'Usuario'}</strong>, tu centro de operaciones está listo para trabajar.</p>
                                    <p className="text-success">{userRole === 'user' ? 'Has iniciado sesión como usuario normal.' : 'Has iniciado sesión como profesor/administrador.'}</p>
                                </div>
                                <div className="col-lg-4 text-lg-end">
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        <button className="btn-modulo" onClick={handleLogout}>Cerrar sesión</button>
                                        {userRole === 'admin' && (
                                            <button className="btn-modulo" onClick={() => setShowAdmin((s) => !s)}>{showAdmin ? 'Ocultar Admin' : 'Administrar datos'}</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-tabs">
                    {mainTabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={mainTab === tab.key ? 'active' : ''}
                            onClick={() => setMainTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {mainTab === 'dashboard' && (
                    <div className="dashboard-summary">
                        <div className="row gx-4 gy-4 justify-content-center">
                            <div className="col-md-6 col-lg-4">
                                <div className="caja premium-card text-center">
                                    <h5>Tu rol</h5>
                                    <p>{userRole === 'admin' ? 'Profesor / Administrador' : 'Usuario regular'}</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="caja premium-card text-center">
                                    <h5>Acceso rápido</h5>
                                    <div className="dashboard-quick-buttons">
                                        <button className="btn-modulo btn-sm" onClick={() => setMainTab('servicios')}>Ver servicios</button>
                                        <button className="btn-modulo btn-sm" onClick={() => setMainTab('modulos')}>Ver módulos</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className={`ai-panel ${aiOpen ? 'ai-panel-open' : ''}`}>
                <div className="ai-panel-header">
                    <div>
                        <h5>Sports AI</h5>
                        <p>Tu asistente deportivo en tiempo real.</p>
                    </div>
                    <button className="ai-close-btn" onClick={handleAiToggle}>Cerrar</button>
                </div>
                <div className="ai-messages">
                    {aiMessages.map((message, index) => (
                        <div key={index} className={`ai-message ${message.role}`}>
                            <span className="ai-message-role">{message.role === 'user' ? 'Tú' : 'SportsBot'}</span>
                            <p>{message.text || 'Cargando...'}</p>
                        </div>
                    ))}
                    <div ref={aiInputRef} />
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
                    <button className="btn-modulo ai-send-btn" onClick={handleAiSend} disabled={aiLoading}>
                        {aiLoading ? 'Pensando...' : 'Enviar'}
                    </button>
                </div>
            </div>

            <button className="ai-launcher" onClick={handleAiToggle} aria-label="Abrir Sports AI">
                <span className="ai-launcher-icon"><MessageCircle size={24} /></span>
                <span className="ai-launcher-label">AI</span>
            </button>

            {showAdmin && userRole === 'admin' && mainTab === 'dashboard' && (
                <section className="container mt-4" id="admin-panel">
                    <div className="caja premium-card">
                        <h4 className="mb-3">Administración de datos</h4>
                        <DataAdmin token={token} />
                    </div>
                </section>
            )}

            {mainTab === 'modulos' && (
                <>
                    <section id="modulos" className="titulo-principal container text-center">
                        <h2>Modulos deportivos Arc Prestige</h2>
                        <p>El sistema está pensado para que el foco principal sea el tiro con arco, pero puedas abrir otros deportes con sus propios módulos y flujos.</p>
                    </section>

                    <section id="reservas" className="container sport-nav-grid">
                        {sportsConfig.map((sport) => (
                            <button
                                key={sport.key}
                                type="button"
                                className={`sport-selector-card ${selectedSport === sport.key ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedSport(sport.key)
                                    setServiceResult(null)
                                    setServiceMessage(`${sport.title} seleccionado.`)
                                }}
                            >
                                <div className="sport-selector-icon"><Icon name={sport.icon} size={24} /></div>
                                <div className="sport-selector-copy">
                                    <h4>{sport.title}</h4>
                                    <p>{sport.summary}</p>
                                </div>
                            </button>
                        ))}
                    </section>

                    <section className="container sport-focus-card">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <p className="sport-pill">{activeSport.title}</p>
                                <h3>Enfoque {activeSport.title.toLowerCase()}</h3>
                                <p>{activeSport.description}</p>
                                <div className="sport-highlights">
                                    {activeSport.highlights.map((item) => (
                                        <span key={item}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="caja premium-card">
                                    <h5>Modulos disponibles</h5>
                                    {activeSport.modules.map((module) => (
                                        <div key={module.title} className="sport-module-item">
                                            <div className="sport-module-icon"><Icon name={module.accent} size={18} /></div>
                                            <div>
                                                <strong>{module.title}</strong>
                                                <p>{module.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {mainTab === 'servicios' && (
                <section className="servicios container" id="servicios">
                    <div className="row gx-4 gy-4">
                        {effectiveServices.map((service) => (
                            <div key={service.key} className="col-lg-4 col-md-6">
                                <div className="card-modulo service-card">
                                    <div className="contenido">
                                        <div className="service-badge"><Icon name={service.accent} size={20} /></div>
                                        <h4>{service.title}</h4>
                                        <p>{service.desc}</p>
                                        <button
                                            className="btn-modulo"
                                            onClick={() => executeService(service)}
                                            disabled={loadingService === service.key}
                                        >
                                            {loadingService === service.key ? 'Cargando...' : service.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="container mt-5">
                <div className="caja">
                    <div className="result-header">
                        <div>
                            <h4>Resultado del módulo</h4>
                            <p className="text-muted">{serviceMessage || 'Selecciona un servicio después de iniciar sesión.'}</p>
                        </div>
                        <div className="result-meta">
                            {Array.isArray(serviceResult) && <span className="result-badge">{serviceResult.length} registros</span>}
                        </div>
                    </div>
                    {serviceResult ? (
                        <div className="output-card">
                            <div className="view-toggle">
                                <button className="btn-modulo btn-toggle" onClick={() => setViewMode('formatted')}>Vista formateada</button>
                                <button className="btn-modulo btn-toggle" onClick={() => setViewMode('cards')}>Tarjetas</button>
                            </div>

                            {Array.isArray(serviceResult) ? (
                                <div>
                                    {viewMode === 'cards' ? (
                                        <div className="cards-grid">
                                            {serviceResult.map((row, idx) => {
                                                const title = row.name || row.className || row.studentName || row.id || `Registro ${idx + 1}`
                                                const subtitle = row.level || row.status || ''
                                                return (
                                                    <div key={idx} className="data-card">
                                                        <div className="data-card-header">
                                                            <h5>{title}</h5>
                                                            {subtitle && <div className="data-card-sub">{subtitle}</div>}
                                                        </div>
                                                        <div className="data-card-body">
                                                            {Object.entries(row).slice(0, 10).map(([k, v]) => (
                                                                <div key={k} className="data-field">
                                                                    <div className="data-label">{labelFor(k)}</div>
                                                                    <div className="data-value">{renderCellValue(v)}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div>
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
                                        </div>
                                    )}
                                </div>
                            ) : typeof serviceResult === 'object' && serviceResult !== null ? (
                                <div>
                                    {serviceResult.success !== undefined && (
                                        <p><strong>Estado:</strong> {serviceResult.success ? 'OK' : 'Error'}</p>
                                    )}
                                    {serviceResult.message && <p><strong>Mensaje:</strong> {serviceResult.message}</p>}
                                    {serviceResult.source && <p><strong>Fuente:</strong> {serviceResult.source === 'demo' ? 'Modo demostración' : serviceResult.source}</p>}
                                    {serviceResult.data && (
                                        <div>
                                            <p><strong>Datos:</strong></p>
                                            {Array.isArray(serviceResult.data) ? (
                                                viewMode === 'json' ? (
                                                    <pre className="result-pre">{JSON.stringify(serviceResult.data, null, 2)}</pre>
                                                ) : (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                                                        {serviceResult.data.map((row, idx) => {
                                                            const title = row.name || row.className || row.studentName || row.id || `Registro ${idx + 1}`
                                                            const subtitle = row.level || row.status || ''
                                                            return (
                                                                <div key={idx} className="data-card">
                                                                    <div className="data-card-header">
                                                                        <h5>{title}</h5>
                                                                        {subtitle && <div className="data-card-sub">{subtitle}</div>}
                                                                    </div>
                                                                    <div className="data-card-body">
                                                                        {Object.entries(row).slice(0, 8).map(([k, v]) => (
                                                                            <div key={k} className="data-field">
                                                                                <div className="data-label">{labelFor(k)}</div>
                                                                                <div className="data-value">{renderCellValue(v)}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            ) : typeof serviceResult.data === 'object' && serviceResult.data !== null ? (
                                                renderObjectFields(serviceResult.data)
                                            ) : (
                                                <pre className="result-pre">{JSON.stringify(serviceResult.data, null, 2)}</pre>
                                            )}
                                        </div>
                                    )}
                                    {!serviceResult.success && !serviceResult.message && !serviceResult.data && (
                                        <div>
                                            <p><strong>Datos:</strong></p>
                                            {renderObjectFields(serviceResult)}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <pre className="result-pre">{String(serviceResult)}</pre>
                            )}
                        </div>
                    ) : null}
                </div>
            </section>

            <footer className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h4>Quick Links</h4>
                            <div className="quick-links">
                                <a href="#inicio">Inicio</a>
                                <a href="#modulos">Módulos</a>
                                <a href="#reservas">Reservas</a>
                                <a href="#contacto">Contacto</a>
                            </div>
                        </div>
                        <div id="contacto" className="col-md-6 formulario">
                            <h4>Contacto</h4>
                            <input className="form-control" placeholder="Nombre" />
                            <input className="form-control" placeholder="Correo" />
                            <textarea className="form-control" rows="4" placeholder="Mensaje" />
                            <button className="btn-enviar mt-3">Enviar</button>
                        </div>
                    </div>

                    <div className="copyright mt-4">© Arch Prestige</div>
                </div>
            </footer>
        </div>
    )
}

export default App

