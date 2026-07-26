import React, { useState, useEffect } from 'react'
import { createClass, createInscription, createAttendance, fetchClassList, fetchInscriptionList, fetchAttendanceList, registerUser } from '../api'

const classNameSuggestions = {
  archery: ['Técnica básica', 'Técnica avanzada', 'Tiro de precisión'],
  soccer: ['Fútbol juvenil', 'Entrenamiento táctico', 'Técnica de pases'],
  basketball: ['Básquet iniciación', 'Tiros libres', 'Trabajo defensivo'],
}

const normalizeText = (value) => String(value || '').trim().toLowerCase()
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())

const DataAdmin = ({ token }) => {
  const [msg, setMsg] = useState('')
  const [classesList, setClassesList] = useState([])
  const [insList, setInsList] = useState([])
  const [attList, setAttList] = useState([])

  const [classForm, setClassForm] = useState({ sport: 'archery', name: '', description: '', instructorName: '', instructorId: 'demo-instructor', schedule: { day: 'Lun', startTime: '', endTime: '' }, level: 'beginner', maxCapacity: 10 })
  const [insForm, setInsForm] = useState({ studentName: '', studentEmail: '', studentPhone: '', dateOfBirth: '', guardianName: '', guardianPhone: '', experience: 'none', classId: '', className: '' })
  const [attForm, setAttForm] = useState({ classId: '', studentId: '', studentName: '', status: 'present' })

  const currentNameSuggestions = classNameSuggestions[classForm.sport] || []
  const classOptions = classesList.map((c) => ({
    id: c._id || c.id || '',
    name: c.name || c.title || c.className || 'Clase',
    sport: c.sport || c.type || 'Tiro con arco',
  }))
  const selectedClass = classOptions.find((c) => String(c.id) === String(attForm.classId))
  const enrolledStudents = attForm.classId
    ? insList.filter((item) => {
        const classMatch = normalizeText(item.classId || item.classID || item.class_id) === normalizeText(attForm.classId)
        const classNameMatch = selectedClass
          ? normalizeText(item.className || item.class || item.class_name) === normalizeText(selectedClass.name)
          : false
        return classMatch || classNameMatch
      })
    : []

  useEffect(() => {
    if (!classForm.name || currentNameSuggestions.includes(classForm.name)) {
      setClassForm((prev) => ({ ...prev, name: currentNameSuggestions[0] || prev.name }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classForm.sport])

  const validateClassForm = () => {
    if (!classForm.name || !classForm.name.trim()) {
      setMsg('El nombre de la clase es requerido.')
      return false
    }
    if ((classForm.schedule.startTime && !classForm.schedule.endTime) || (!classForm.schedule.startTime && classForm.schedule.endTime)) {
      setMsg('Selecciona hora de inicio y fin para la clase.')
      return false
    }
    if (classForm.schedule.startTime && classForm.schedule.endTime && classForm.schedule.startTime > classForm.schedule.endTime) {
      setMsg('La hora de fin debe ser igual o posterior a la hora de inicio.')
      return false
    }
    return true
  }

  const submitClass = async (e) => {
    e.preventDefault()
    if (!validateClassForm()) return
    try {
      const res = await createClass(token, classForm)
      if (res && (res._id || res.id)) setMsg(`Clase creada: ${res._id || res.id}`)
      else setMsg(`Clase creada: ${JSON.stringify(res)}`)
      await refreshAll()
    } catch (err) {
      const msg = err?.message || (err?.response && err.response.data && JSON.stringify(err.response.data)) || String(err)
      setMsg(msg)
    }
  }

  const validateInsForm = () => {
    if (!insForm.studentName || !insForm.studentName.trim()) {
      setMsg('El nombre del alumno es requerido.')
      return false
    }
    if (!insForm.studentEmail || !insForm.studentEmail.trim()) {
      setMsg('El correo del alumno es requerido.')
      return false
    }
    if (!isValidEmail(insForm.studentEmail)) {
      setMsg('Ingresa un correo electrónico válido.')
      return false
    }
    if (!insForm.classId) {
      setMsg('Selecciona una clase para la inscripción.')
      return false
    }
    return true
  }

  const submitIns = async (e) => {
    e.preventDefault()
    if (!validateInsForm()) return
    try {
      // First, try to create a user account in AuthService
      const fullName = (insForm.studentName || '').trim()
      const parts = fullName.split(' ')
      const name = parts[0] || fullName || 'Nombre'
      const surname = parts.slice(1).join(' ') || 'Apellido'
      const email = insForm.studentEmail || `no-reply+${Date.now()}@local`
      let usernameBase = (email.split('@')[0] || name.toLowerCase()).replace(/[^a-z0-9]/gi, '').toLowerCase()
      if (usernameBase.length < 4) usernameBase = `${usernameBase}user`
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const username = `${usernameBase}${randomSuffix}`
      const password = Math.random().toString(36).slice(2, 12) + 'A1'
      const phone = insForm.studentPhone && String(insForm.studentPhone).replace(/\D/g, '').padStart(8, '0') || '00000000'

      const reg = await registerUser({ name, surname, username, email, password, phone })

      let studentId = undefined
      let regMsg = ''
      if (reg && reg.user && reg.user.id) {
        studentId = reg.user.id || reg.user.Id || reg.user.Id
        regMsg = `Cuenta creada: ${reg.user.username || reg.user.Username || username}`
      } else if (reg && reg.User && reg.User.Id) {
        studentId = reg.User.Id
        regMsg = `Cuenta creada: ${reg.User.Username || username}`
      } else if (reg && reg.success && reg.user) {
        studentId = reg.user.Id || reg.user.id
      } else if (reg && reg.success === false && reg.message) {
        const fallbackMsg = reg.message.includes('Failed to fetch')
          ? 'Servicio Auth no disponible; se utiliza modo demo.'
          : reg.message
        regMsg = `Registro no creado: ${fallbackMsg}`
      }

      // attach studentId to inscription payload when available
      // Ensure required fields for inscription service validator
      const payload = {
        ...insForm,
        studentPhone: insForm.studentPhone && String(insForm.studentPhone).trim() !== '' ? insForm.studentPhone : '00000000',
        dateOfBirth: insForm.dateOfBirth && insForm.dateOfBirth !== '' ? insForm.dateOfBirth : new Date().toISOString().slice(0, 10),
      }
      if (studentId) payload.studentId = studentId
      if (insForm.classId) payload.classId = insForm.classId
      if (insForm.className) payload.className = insForm.className

      const res = await createInscription(token, payload)
      // show detailed response
      if (res && res._id) {
        setMsg(`Inscripción creada: ${res._id}. ${regMsg} ${studentId ? `Usuario: ${username} / Contraseña: ${password}` : ''}`)
      } else if (res && res.success === false) {
        setMsg(`No se pudo crear la inscripción: ${res.message || JSON.stringify(res)}`)
      } else {
        setMsg(`Inscripción creada: ${JSON.stringify(res)}. ${regMsg}`)
      }
      await refreshAll()
    } catch (err) {
      // If server returned JSON error, show it
      const msg = err?.message || (err?.response && err.response.data && JSON.stringify(err.response.data)) || String(err)
      setMsg(msg)
    }
  }

  const validateAttForm = () => {
    if (!attForm.classId) {
      setMsg('Selecciona una clase antes de crear la asistencia.')
      return false
    }
    if (!attForm.studentId) {
      setMsg('Selecciona un alumno inscrito para registrar la asistencia.')
      return false
    }
    return true
  }

  const submitAtt = async (e) => {
    e.preventDefault()
    if (!validateAttForm()) return
    try {
      const res = await createAttendance(token, attForm)
      if (res && (res._id || res.id)) setMsg(`Asistencia creada: ${res._id || res.id}`)
      else setMsg(`Asistencia creada: ${JSON.stringify(res)}`)
      await refreshAll()
    } catch (err) {
      const msg = err?.message || (err?.response && err.response.data && JSON.stringify(err.response.data)) || String(err)
      setMsg(msg)
    }
  }

  useEffect(() => {
    if (!token) return
    refreshAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function refreshAll() {
    try {
      const [c, i, a] = await Promise.all([fetchClassList(token), fetchInscriptionList(token), fetchAttendanceList(token)])
      setClassesList(Array.isArray(c) ? c : [])
      setInsList(Array.isArray(i) ? i : [])
      setAttList(Array.isArray(a) ? a : [])
    } catch (err) {
      // ignore; message shown elsewhere
    }
  }

  return (
    <div className="caja mt-4">
      <h4>Administrar datos (demo)</h4>
      <p>Usa estos formularios para crear objetos de prueba rápidamente.</p>
      <div className="admin-forms">
        <form onSubmit={submitClass} className="form-card">
          <div className="form-accent" />
          <h5>Crear clase</h5>
          <select className="form-control mb-2" value={classForm.sport} onChange={(e) => setClassForm({ ...classForm, sport: e.target.value })}>
            <option value="archery">Tiro con arco</option>
            <option value="soccer">Fútbol</option>
            <option value="basketball">Básquet</option>
          </select>
          <select
            className="form-control mb-2"
            value={classForm.name}
            onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
            required
          >
            <option value="">Selecciona un nombre de clase</option>
            {currentNameSuggestions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input className="form-control mb-2" placeholder="Instructor" value={classForm.instructorName} onChange={(e) => setClassForm({ ...classForm, instructorName: e.target.value })} />
          <div className="row gx-2">
            <div className="col-6">
              <input className="form-control mb-2" placeholder="Día (Lun)" value={classForm.schedule.day} onChange={(e) => setClassForm({ ...classForm, schedule: { ...classForm.schedule, day: e.target.value } })} />
            </div>
            <div className="col-6">
              <div className="time-buttons d-flex gap-2">
                {['15:00','15:30','16:00','16:30','17:00'].map(t => (
                  <button type="button" key={t} className={`time-btn btn ${classForm.schedule.startTime === t ? 'active' : ''}`} onClick={() => setClassForm({ ...classForm, schedule: { ...classForm.schedule, startTime: t, endTime: classForm.schedule.endTime || t } })}>{t}</button>
                ))}
              </div>
              <div style={{ height: 6 }} />
              <div className="time-buttons d-flex gap-2">
                {['16:00','16:30','17:00','17:30','18:00'].map(t => (
                  <button type="button" key={t} className={`time-btn btn ${classForm.schedule.endTime === t ? 'active' : ''}`} onClick={() => setClassForm({ ...classForm, schedule: { ...classForm.schedule, endTime: t } })}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <button className="btn-modulo btn-accent" type="submit">Crear clase</button>
        </form>

        <form onSubmit={submitIns} className="form-card">
          <div className="form-accent form-accent-blue" />
          <h5>Crear inscripción</h5>
          <input className="form-control mb-2" placeholder="Nombre alumno" value={insForm.studentName} onChange={(e) => setInsForm({ ...insForm, studentName: e.target.value })} required />
          <input className="form-control mb-2" placeholder="Email" value={insForm.studentEmail} onChange={(e) => setInsForm({ ...insForm, studentEmail: e.target.value })} required />
          <select
            className="form-control mb-2"
            value={insForm.classId}
            onChange={(e) => {
              const cls = classOptions.find((option) => String(option.id) === String(e.target.value))
              setInsForm({
                ...insForm,
                classId: e.target.value,
                className: cls?.name || '',
              })
            }}
            required
          >
            <option value="">Selecciona la clase</option>
            {classOptions.map((option) => (
              <option key={option.id} value={option.id}>{`${option.name} (${option.sport})`}</option>
            ))}
          </select>
          <div className="row gx-2">
            <div className="col-6"><input className="form-control mb-2" placeholder="Teléfono" value={insForm.studentPhone} onChange={(e) => setInsForm({ ...insForm, studentPhone: e.target.value })} /></div>
            <div className="col-6"><input type="date" className="form-control mb-2" value={insForm.dateOfBirth} onChange={(e) => setInsForm({ ...insForm, dateOfBirth: e.target.value })} /></div>
          </div>
          <small className="text-muted">Se intentará crear también una cuenta de usuario en AuthService.</small>
          <div style={{ height: 8 }} />
          <button className="btn-modulo btn-accent-blue" type="submit">Crear inscripción</button>
        </form>

        <form onSubmit={submitAtt} className="form-card">
          <div className="form-accent form-accent-amber" />
          <h5>Crear asistencia</h5>
          <select
            className="form-control mb-2"
            value={attForm.classId}
            onChange={(e) => setAttForm({ ...attForm, classId: e.target.value, studentId: '', studentName: '' })}
            required
          >
            <option value="">Selecciona una clase</option>
            {classOptions.map((option) => (
              <option key={option.id} value={option.id}>{`${option.name} (${option.sport})`}</option>
            ))}
          </select>
          <select
            className="form-control mb-2"
            value={attForm.studentId}
            onChange={(e) => {
              const selectedStudent = enrolledStudents.find((item) => String(item.studentId || item._id || item.id) === String(e.target.value))
              setAttForm({
                ...attForm,
                studentId: e.target.value,
                studentName: selectedStudent ? selectedStudent.studentName || selectedStudent.student || selectedStudent.name || '' : '',
              })
            }}
            required
            disabled={!attForm.classId || enrolledStudents.length === 0}
          >
            <option value="">Selecciona un alumno inscrito</option>
            {enrolledStudents.map((student) => (
              <option key={student.studentId || student._id || student.id || student.studentEmail} value={student.studentId || student._id || student.id}>
                {student.studentName || student.student || student.name || student.studentEmail || 'Alumno sin nombre'}
              </option>
            ))}
          </select>
          {attForm.classId && (
            <small className="text-muted d-block mb-2">
              {enrolledStudents.length > 0
                ? `${enrolledStudents.length} inscritos para esta clase.`
                : 'No se encontraron inscritos para esta clase. Asegúrate de que la inscripción esté en la misma clase seleccionada.'}
            </small>
          )}
          <select className="form-control mb-2" value={attForm.status} onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}>
            <option value="present">Presente</option>
            <option value="absent">Ausente</option>
            <option value="late">Tarde</option>
            <option value="excused">Justificado</option>
          </select>
          <button className="btn-modulo btn-accent-amber" type="submit">Crear asistencia</button>
        </form>
      </div>

      {msg && <p className="mt-3">{msg}</p>}

      <div className="mt-4">
        <div className="table-card">
          <h5>Clases ({classesList.length})</h5>
          <div className="table-responsive">
            <table className="table nicer-table">
              <thead>
                <tr><th>_id</th><th>Deporte</th><th>Nombre</th><th>Instructor</th><th>Inscritos</th></tr>
              </thead>
              <tbody>
                {classesList.slice(0, 20).map((c) => (
                  <tr key={c._id}>
                    <td style={{ maxWidth: 200, overflow: 'hidden' }}>{c._id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{c.sport || c.type || 'Tiro con arco'}</td>
                    <td>{c.name || c.title || ''}</td>
                    <td>{c.instructorName || c.instructorId}</td>
                    <td>{c.currentEnrollment ?? c.participants?.length ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <h5>Inscripciones ({insList.length})</h5>
          <div className="table-responsive">
            <table className="table nicer-table">
              <thead>
                <tr><th>_id</th><th>Alumno</th><th>Email</th><th>Clase</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {insList.slice(0, 20).map((r) => (
                  <tr key={r._id || r.id}>
                    <td style={{ maxWidth: 200 }}>{r._id || r.id}</td>
                    <td>{r.studentName || r.student || r.name}</td>
                    <td>{r.studentEmail}</td>
                    <td>{r.className || r.class || r.className || ''}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <h5>Asistencias ({attList.length})</h5>
          <div className="table-responsive">
            <table className="table nicer-table">
              <thead>
                <tr><th>_id</th><th>Alumno</th><th>Clase</th><th>Fecha</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {attList.slice(0, 20).map((r) => (
                  <tr key={r._id}>
                    <td style={{ maxWidth: 200 }}>{r._id}</td>
                    <td>{r.studentName}</td>
                    <td>{r.classId}</td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataAdmin
