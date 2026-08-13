require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Question = require('./models/Question');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const { round1Questions } = require('./utils/seedData');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // 1) Questions (replace Round 1 questions each run; idempotent)
    await Question.deleteMany({ round: 1 });
    await Question.insertMany(round1Questions);
    console.log(`✓ Seeded ${round1Questions.length} Round 1 questions`);

    // 2) Admin user (from env, defaults provided for demo)
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    await Admin.deleteMany({});
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log(`✓ Seeded admin  ->  ${username} / ${password}`);

    await mongoose.disconnect();
    console.log('✓ Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding failed:', err);
    process.exit(1);
  }
})();
