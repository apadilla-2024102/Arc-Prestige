const fs = require('fs');
const fetch = globalThis.fetch || require('node-fetch');
(async () => {
    try {
        const body = JSON.parse(fs.readFileSync('login.json', 'utf8'));
        const loginRes = await fetch('http://localhost:5296/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const loginBody = await loginRes.text();
        console.log('LOGIN STATUS', loginRes.status);
        console.log('LOGIN BODY', loginBody);
        let token = null;
        try { token = JSON.parse(loginBody).token || JSON.parse(loginBody).Token || JSON.parse(loginBody).data?.token } catch (e) { }
        if (!token) {
            console.error('No token obtained');
            process.exit(1);
        }

        const attendanceRes = await fetch('http://localhost:3003/api/attendance', {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('ATTENDANCE STATUS', attendanceRes.status);
        const attText = await attendanceRes.text();
        console.log('ATTENDANCE BODY', attText);
    } catch (err) {
        console.error(err);
        process.exit(2);
    }
})();