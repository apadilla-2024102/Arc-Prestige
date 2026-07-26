require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/arc_prestige?authSource=admin';
const USER = 'admin';
const ADMIN_DB = 'admin';
const TARGET_DB = 'arc_prestige';

async function run() {
  try {
    console.log('Using URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongoose connected');

    const db = mongoose.connection.db;
    const adminDb = mongoose.connection.client.db(ADMIN_DB);

    // Get user info from admin
    const info = await adminDb.command({ usersInfo: { user: USER, db: ADMIN_DB } });
    console.log('usersInfo result:', JSON.stringify(info, null, 2));

    const user = info.users && info.users[0];
    if (!user) {
      console.error(`User ${USER} not found in ${ADMIN_DB}`);
      process.exit(2);
    }

    const hasRole = (user.roles || []).some(r => r.role === 'readWrite' && r.db === TARGET_DB);
    if (hasRole) {
      console.log(`User ${USER} already has readWrite on ${TARGET_DB}`);
    } else {
      console.log(`Granting readWrite on ${TARGET_DB} to user ${USER}...`);
      const grant = await adminDb.command({ grantRolesToUser: USER, roles: [{ role: 'readWrite', db: TARGET_DB }] });
      console.log('grantRolesToUser result:', JSON.stringify(grant, null, 2));
      console.log('Role granted.');
    }

    // Print connection status
    const connStatus = await db.command({ connectionStatus: 1 });
    console.log('connectionStatus:', JSON.stringify(connStatus, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error in mongo_admin:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
}

run();
