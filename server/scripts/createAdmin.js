import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = (process.argv[2] || 'admin@campus.edu').toLowerCase();
    const password = process.argv[3] || 'Admin@123456';
    const name = process.argv[4] || 'Campus System Administrator';
    const studentId = process.argv[5] || 'ADMIN001';

    console.log(`Checking if admin account exists for: ${email}`);

    let admin = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (admin) {
      admin.role = 'admin';
      admin.isActive = true;
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log(`[Success] Existing user "${email}" updated to Administrator with new password.`);
    } else {
      admin = await User.create({
        name,
        email,
        studentId,
        department: 'Campus Security & Administration',
        academicYear: 'Faculty / Staff',
        phone: '1234567890',
        passwordHash,
        role: 'admin',
        isActive: true,
      });
      console.log(`[Success] New Administrator created successfully:`);
      console.log(`- Email: ${email}`);
      console.log(`- Password: ${password}`);
      console.log(`- Role: admin`);
    }

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Error] Failed to create administrator:', error.message);
    process.exit(1);
  }
};

createAdmin();

