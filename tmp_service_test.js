const headers = { Authorization: 'Bearer demo-token-arc-prestige', 'Content-Type': 'application/json' };
async function test() {
  try {
    console.log('POST /api/inscriptions');
    const res = await fetch('http://localhost:3001/api/inscriptions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ studentName: 'Test User', studentEmail: 'test.user@example.com', studentPhone: '12345678', dateOfBirth: '2002-01-01' })
    });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('inscription post error', err.message);
  }
  try {
    console.log('GET /api/inscriptions');
    const res = await fetch('http://localhost:3001/api/inscriptions', { headers });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('inscription get error', err.message);
  }
  try {
    console.log('POST /api/attendance');
    const res = await fetch('http://localhost:3003/api/attendance', {
      method: 'POST',
      headers,
      body: JSON.stringify({ classId: '813633d8-1187-4e6d-b8b7-617907322e85', studentId: 'demo-user', studentName: 'Test User', status: 'present' })
    });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('attendance post error', err.message);
  }
  try {
    console.log('GET /api/attendance');
    const res = await fetch('http://localhost:3003/api/attendance', { headers });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('attendance get error', err.message);
  }
}

test();
