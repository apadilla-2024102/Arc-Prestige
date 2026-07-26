const mongoose = require('mongoose');
const uri = process.argv[2] || process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/arc_prestige?authSource=admin';
console.log('Using URI:', uri);
(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Mongoose connected');
    const Attendance = mongoose.model('Attendance', new mongoose.Schema({}, { strict: false }), 'attendances');
    const docs = await Attendance.find().limit(1);
    console.log('Find succeeded:', docs.length);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
})();