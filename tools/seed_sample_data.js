const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// Use env value if present, otherwise fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/?authSource=admin';
const DB_NAME = 'arc_prestige';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    const db = mongoose.connection.db;

    // Collections
    const classes = db.collection('classes');
    const inscriptions = db.collection('inscriptions');
    const attendances = db.collection('attendances');

    // Sample IDs
    const class1Id = new ObjectId();
    const class2Id = new ObjectId();
    const student1Id = 'stu_juan_1';
    const student2Id = 'stu_maria_2';

    // Insert sample classes
    await classes.insertMany([
      {
        _id: class1Id,
        title: 'Tiro con arco - Nivel 1',
        description: 'Clase para principiantes',
        instructorId: 'usr_instructor_1',
        maxCapacity: 12,
        currentEnrollment: 1,
        participants: [{ studentId: student1Id, studentName: 'Juan Perez', status: 'active' }],
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: class2Id,
        title: 'Tiro con arco - Nivel 2',
        description: 'Clase intermedia',
        instructorId: 'usr_instructor_2',
        maxCapacity: 10,
        currentEnrollment: 0,
        participants: [],
        status: 'active',
        createdAt: new Date(),
      },
    ]);

    // Insert sample inscriptions (students signed up)
    await inscriptions.insertMany([
      {
        _id: new ObjectId(),
        studentId: student1Id,
        studentName: 'Juan Perez',
        classId: class1Id,
        status: 'confirmed',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        studentId: student2Id,
        studentName: 'Maria Lopez',
        classId: class2Id,
        status: 'pending',
        createdAt: new Date(),
      },
    ]);

    // Insert sample attendances
    await attendances.insertMany([
      {
        _id: new ObjectId(),
        studentId: student1Id,
        studentName: 'Juan Perez',
        classId: class1Id,
        date: new Date(),
        status: 'present',
      },
    ]);

    const counts = {
      classes: await classes.countDocuments(),
      inscriptions: await inscriptions.countDocuments(),
      attendances: await attendances.countDocuments(),
    };

    console.log('Seeding complete. Document counts:', counts);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
}

seed();
