const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: [true, 'Staff ID is required.'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required.'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required.'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Select a valid gender.',
      },
    },
    position: {
      type: String,
      required: [true, 'Position is required.'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required.'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters.'],
      select: false,
    },
    accountStatus: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Select a valid account status.',
      },
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Hash the password only when it has been changed (create or password reset).
staffSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

staffSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

staffSchema.set('toJSON', {
  transform: (document, returned) => {
    delete returned.password;
    delete returned.__v;
    return returned;
  },
});

module.exports = mongoose.model('Staff', staffSchema);
