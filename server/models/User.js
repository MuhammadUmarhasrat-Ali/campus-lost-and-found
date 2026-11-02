import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide college email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    studentId: {
      type: String,
      required: [true, 'Please provide student ID / Roll No'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify your department'],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Please specify your year/semester'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Remove passwordHash from JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;

