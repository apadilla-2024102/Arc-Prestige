const fs = require('fs');
const fetch = globalThis.fetch || require('node-fetch');

async function main() {
  const loginBody = JSON.parse(fs.readFileSync('login.json', 'utf8'));

  // 1) Login
  const loginRes = await fetch('http://localhost:5296/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginBody)
  });
  const loginJson = await loginRes.json();
  if (!loginJson.token) {
    console.error('Login failed', loginJson);
    process.exit(1);
  }
  const token = loginJson.token;
  console.log('Obtained token');

  // 2) Create class (requires auth)
  const classPayload = {
    name: 'Tiro con arco - Demo',
    description: 'Clase demo creada por script',
    instructorId: 'instr_demo_1',
    instructorName: 'Instructor Demo',
    schedule: { day: 'Monday', startTime: '18:00', endTime: '20:00' },
    level: 'beginner',
    maxCapacity: 15
  };

  const classRes = await fetch('http://localhost:3002/api/v1/classes', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(classPayload)
  });
  const classJson = await classRes.json();
  console.log('Create class status', classRes.status, classJson);
  const createdClassId = classJson._id || classJson.id || classJson._doc?._id;

  // 3) Create inscription (will attach studentId from token via auth middleware)
  const inscriptionPayload = {
    studentName: 'Alumno Demo',
    studentEmail: 'alumno.demo@example.com',
    studentPhone: '+34123456789',
    dateOfBirth: '2000-01-01',
    guardianName: 'Tutor Demo',
    guardianPhone: '+34987654321',
    experience: 'none'
  };

  const insRes = await fetch('http://localhost:3001/api/inscriptions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(inscriptionPayload)
  });
  const insJson = await insRes.json();
  console.log('Create inscription status', insRes.status, insJson);

  // 4) Create attendance for the created class and the logged-in user
  const attendancePayload = {
    classId: createdClassId || insJson.classId || insJson.classId,
    studentId: loginJson.userDetails?.id || loginJson.userId || undefined,
    studentName: inscriptionPayload.studentName,
    date: new Date().toISOString(),
    status: 'present'
  };

  const attRes = await fetch('http://localhost:3003/api/attendance', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(attendancePayload)
  });
  const attJson = await attRes.json();
  console.log('Create attendance status', attRes.status, attJson);

  console.log('Done. Now you can view classes at http://localhost:3002/api/v1/classes, inscriptions at http://localhost:3001/api/inscriptions, attendances at http://localhost:3003/api/attendance');
}

main().catch(err => { console.error(err); process.exit(1); });
