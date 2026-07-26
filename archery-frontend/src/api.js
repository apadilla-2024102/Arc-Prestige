const API_BASE = '/data'
const AUTH_SERVICE_BASE_URL = (import.meta.env.VITE_AUTH_SERVICE_URL || '').trim()

const buildAuthServiceUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!AUTH_SERVICE_BASE_URL) {
    return normalizedPath
  }

  const normalizedBase = AUTH_SERVICE_BASE_URL.endsWith('/') ? AUTH_SERVICE_BASE_URL.slice(0, -1) : AUTH_SERVICE_BASE_URL
  return `${normalizedBase}${normalizedPath}`
}

const STORAGE_KEYS = {
  attendance: 'arc-prestige-attendance',
  inscription: 'arc-prestige-inscriptions',
  class: 'arc-prestige-classes',
  authUsers: 'arc-prestige-auth-users',
}

const FIXED_USERS = [
  {
    id: 'demo-admin',
    name: 'Alex Rivera',
    username: 'alex',
    email: 'alex@arcprestige.com',
    password: 'demo123',
    role: 'admin',
  },
  {
    id: 'demo-user',
    name: 'María López',
    username: 'usuario',
    email: 'usuario@arcprestige.com',
    password: 'user123',
    role: 'user',
  },
]

const FIXED_RESPONSES = {
  attendance: {
    success: true,
    source: 'static',
    message: 'Datos de asistencia cargados como datos fijos.',
    data: [
      { id: 1, student: 'Lucía M.', className: 'Técnica básica', date: '2026-07-14', status: 'Presente' },
      { id: 2, student: 'Mateo P.', className: 'Técnica avanzada', date: '2026-07-14', status: 'Tarde' },
      { id: 3, student: 'Sofía R.', className: 'Técnica infantil', date: '2026-07-14', status: 'Presente' },
    ],
  },
  inscription: {
    success: true,
    source: 'static',
    message: 'Inscripciones cargadas como datos fijos.',
    data: [
      { id: 1, student: 'Daniel V.', studentEmail: 'daniel@arcprestige.com', className: 'Técnica básica', status: 'Confirmada' },
      { id: 2, student: 'Paula G.', studentEmail: 'paula@arcprestige.com', className: 'Técnica avanzada', status: 'Pendiente' },
    ],
  },
  class: {
    success: true,
    source: 'static',
    message: 'Clases cargadas como datos fijos.',
    data: [
      { id: 1, sport: 'archery', name: 'Técnica básica', coach: 'Mauro', schedule: 'Lun. 18:00', capacity: 12 },
      { id: 2, sport: 'archery', name: 'Técnica avanzada', coach: 'Cecilia', schedule: 'Mié. 20:00', capacity: 8 },
      { id: 3, sport: 'soccer', name: 'Fútbol juvenil', coach: 'Jorge', schedule: 'Mar. 17:00', capacity: 16 },
      { id: 4, sport: 'basketball', name: 'Básquet iniciación', coach: 'Carla', schedule: 'Jue. 19:00', capacity: 10 },
    ],
  },
  reportClass: {
    success: true,
    source: 'static',
    message: 'Reporte de clases cargado como datos fijos.',
    data: {
      totalClasses: 5,
      activeClasses: 3,
      occupancyRate: '74%',
      bestRatedCoach: 'Cecilia',
    },
  },
  reportAttendance: {
    success: true,
    source: 'static',
    message: 'Reporte de asistencia cargado como datos fijos.',
    data: {
      present: 18,
      late: 4,
      absent: 2,
      weeklyTrend: '+12%',
    },
  },
  enrolled: {
    success: true,
    source: 'static',
    message: 'Reporte de estudiantes inscritos cargado como datos fijos.',
    data: {
      totalEnrolled: 24,
      newThisMonth: 6,
      averageAge: 19,
      topProgram: 'Técnica básica',
    },
  },
}

function readStoredItems(key, fallback = []) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (error) {
    return fallback
  }
}

function writeStoredItems(key, items) {
  if (typeof window === 'undefined' || !window.localStorage) return
  window.localStorage.setItem(key, JSON.stringify(items))
}

function addStoredItem(key, item) {
  const current = readStoredItems(key, [])
  const next = [
    item,
    ...current.filter(
      (entry) =>
        !(
          entry._id && item._id && entry._id === item._id
        ) &&
        !(
          entry.id && item.id && entry.id === item.id
        ),
    ),
  ]
  writeStoredItems(key, next)
  return next
}

function buildRecord(payload, kind) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${kind}-${Date.now()}`
  return {
    _id: id,
    id,
    createdAt: new Date().toISOString(),
    ...payload,
  }
}

function getApiUrl(path) {
  if (!path) return API_BASE
  if (path.startsWith('/')) return path
  return `${API_BASE}/${path}`
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('Content-Type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = body?.message || body?.error || `${response.status} ${response.statusText}`
    throw new Error(message)
  }

  return body
}

function getSavedAuthUsers() {
  if (typeof window === 'undefined' || !window.localStorage) return FIXED_USERS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.authUsers)
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return FIXED_USERS
    return [...parsed, ...FIXED_USERS].filter((user, index, self) => self.findIndex((u) => u.id === user.id) === index)
  } catch (error) {
    return FIXED_USERS
  }
}

function findUserByIdentifier(identifier) {
  const normalized = String(identifier || '').trim().toLowerCase()
  const users = getSavedAuthUsers()
  return users.find((user) => {
    return (
      String(user.username || '').toLowerCase() === normalized ||
      String(user.email || '').toLowerCase() === normalized
    )
  })
}

export const login = async ({ emailOrUsername, password }) => {
  const normalized = String(emailOrUsername || '').trim()
  const normalizedPassword = String(password || '')

  if (!normalized || !normalizedPassword) {
    return { success: false, message: 'Usuario y contraseña son obligatorios.' }
  }

  const user = findUserByIdentifier(normalized)
  if (!user || user.password !== normalizedPassword) {
    return { success: false, message: 'Usuario o contraseña incorrectos.' }
  }

  return {
    success: true,
    token: `token-${user.id}`,
    userDetails: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    message: 'Inicio de sesión correcto.',
  }
}

export const fetchAttendanceList = async () => {
  try {
    const result = await requestJson(getApiUrl('attendance.json'))
    const data = Array.isArray(result) ? result : result?.data
    return Array.isArray(data) ? [...readStoredItems(STORAGE_KEYS.attendance, data)] : readStoredItems(STORAGE_KEYS.attendance, FIXED_RESPONSES.attendance.data)
  } catch (error) {
    return [...readStoredItems(STORAGE_KEYS.attendance, FIXED_RESPONSES.attendance.data)]
  }
}

export const fetchInscriptionList = async () => {
  try {
    const result = await requestJson(getApiUrl('inscriptions.json'))
    const data = Array.isArray(result) ? result : result?.data
    return Array.isArray(data) ? [...readStoredItems(STORAGE_KEYS.inscription, data)] : readStoredItems(STORAGE_KEYS.inscription, FIXED_RESPONSES.inscription.data)
  } catch (error) {
    return [...readStoredItems(STORAGE_KEYS.inscription, FIXED_RESPONSES.inscription.data)]
  }
}

export const fetchClassList = async () => {
  try {
    const result = await requestJson(getApiUrl('classes.json'))
    const data = Array.isArray(result) ? result : result?.data
    return Array.isArray(data) ? [...readStoredItems(STORAGE_KEYS.class, data)] : readStoredItems(STORAGE_KEYS.class, FIXED_RESPONSES.class.data)
  } catch (error) {
    return [...readStoredItems(STORAGE_KEYS.class, FIXED_RESPONSES.class.data)]
  }
}

export const fetchReportClassStats = async () => {
  try {
    const result = await requestJson(getApiUrl('report-class.json'))
    return result?.data ? result : FIXED_RESPONSES.reportClass
  } catch (error) {
    return FIXED_RESPONSES.reportClass
  }
}

export const fetchReportAttendance = async () => {
  try {
    const result = await requestJson(getApiUrl('report-attendance.json'))
    return result?.data ? result : FIXED_RESPONSES.reportAttendance
  } catch (error) {
    return FIXED_RESPONSES.reportAttendance
  }
}

export const fetchEnrolledStudents = async () => {
  try {
    const result = await requestJson(getApiUrl('enrolled.json'))
    return result?.data ? result : FIXED_RESPONSES.enrolled
  } catch (error) {
    return FIXED_RESPONSES.enrolled
  }
}

export const sendContactMessage = async ({ name, email, message }) => {
  const payload = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    message: String(message || '').trim(),
  }

  const response = await fetch(buildAuthServiceUrl('/api/v1/contact/send'), {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const contentType = response.headers.get('Content-Type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const messageText = body?.message || body?.error || `${response.status} ${response.statusText}`
    throw new Error(messageText)
  }

  return body || { success: true, message: 'Tu mensaje fue enviado correctamente.' }
}

const getSportsAiFixedAnswer = (question) => {
  const text = String(question || '').toLowerCase()

  if (text.includes('arqu') || text.includes('arquer')) {
    return 'Para mejorar en arquería, enfócate en la postura estable, el control de la respiración y mantener el codo alineado. Practica la misma rutina de montaje en cada disparo y revisa tu apuntado con calma antes de soltar la flecha.'
  }
  if (text.includes('futbol') || text.includes('fútbol')) {
    return 'En fútbol, trabaja la técnica con ambos pies, la recepción del balón y la visión de juego. También es clave hacer ejercicios de resistencia y coordinación para mantener tu intensidad durante todo el partido.'
  }
  if (text.includes('basquet') || text.includes('baloncesto') || text.includes('básquet')) {
    return 'Para mejorar en básquet, practica tiros libres con rutina, control de balón y cambios de ritmo. Trabaja también la defensa de pies y la lectura de los cortes del rival.'
  }
  if (text.includes('entrenamiento') || text.includes('rutina')) {
    return 'Una buena rutina deportiva combina técnica, fuerza y recuperación. Calienta bien, entrenamientos con intención y termina con estiramientos suaves para evitar lesiones.'
  }

  return 'Excelente pregunta. Si quieres mejorar, enfócate en la técnica, la consistencia y el control mental. Pregunta con más detalle y te doy un plan más específico.'
}

export const querySportsAI = async (question) => {
  try {
    const result = await requestJson(getApiUrl('sports-ai.json'))
    const answer = result?.answer || result?.message
    if (typeof answer === 'string' && answer.trim()) {
      return { answer: answer.trim() }
    }
  } catch (error) {
    // ignore
  }
  return { answer: getSportsAiFixedAnswer(question) }
}

export const createClass = async (token, payload) => {
  const createdClass = buildRecord({
    ...payload,
    sport: payload.sport || 'archery',
    coach: payload.instructorName || payload.instructorId || 'Instructor demo',
    schedule: payload.schedule?.day ? `${payload.schedule.day} ${payload.schedule.startTime || ''}`.trim() : payload.schedule || 'Lun. 18:00',
    capacity: payload.maxCapacity || 10,
  }, 'class')

  addStoredItem(STORAGE_KEYS.class, createdClass)
  return createdClass
}

export const createInscription = async (token, payload) => {
  const createdInscription = buildRecord({
    ...payload,
    status: payload.status || 'Confirmada',
    student: payload.studentName || payload.name || 'Estudiante',
    studentEmail: payload.studentEmail || payload.email || 'cliente@arcprestige.com',
    className: payload.className || payload.class || 'Técnica básica',
  }, 'inscription')

  addStoredItem(STORAGE_KEYS.inscription, createdInscription)
  return createdInscription
}

export const createAttendance = async (token, payload) => {
  const createdAttendance = buildRecord({
    ...payload,
    date: payload.date || new Date().toISOString().slice(0, 10),
    student: payload.studentName || payload.student || 'Alumno',
    className: payload.className || payload.class || 'Técnica básica',
    status: payload.status || 'Presente',
  }, 'attendance')

  addStoredItem(STORAGE_KEYS.attendance, createdAttendance)
  return createdAttendance
}

export const registerUser = async (payload) => {
  try {
    const normalizedEmail = String(payload.email || '').trim().toLowerCase()
    const normalizedUsername = String(payload.username || '').trim().toLowerCase()
    if (!normalizedEmail || !normalizedUsername || !payload.password) {
      return { success: false, message: 'Usuario, correo y contraseña son obligatorios.' }
    }

    const users = getSavedAuthUsers()
    if (users.some((user) => (user.email || '').toLowerCase() === normalizedEmail || (user.username || '').toLowerCase() === normalizedUsername)) {
      return { success: false, message: 'El usuario o correo ya existe.' }
    }

    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`
    const newUser = {
      id,
      name: payload.name || 'Usuario',
      username: normalizedUsername,
      email: normalizedEmail,
      password: String(payload.password),
      role: 'user',
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = readStoredItems(STORAGE_KEYS.authUsers, [])
      writeStoredItems(STORAGE_KEYS.authUsers, [newUser, ...saved])
    }

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, message: error.message || 'No se pudo registrar el usuario.' }
  }
}
