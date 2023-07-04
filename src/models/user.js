const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Name is required.'],
  },
  email: {
    type: 'string',
    required: [true, 'Email is required.'],
    unique: true,
  },
  password: {
    type: 'string',
    required: [true, 'Password is required.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: 'string',
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (passwordC) {
        return passwordC === this.password;
      },
      message: 'Password confirmation failed.',
    },
  },
  role: {
    type: 'string',
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer',
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: [true, 'Created at is required.'],
  },
  deleted: {
    type: 'boolean',
    default: false,
  },
  passwordChangedAt: Date,
});

// Validate password is not modified and confirmation is correct
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  console.log(this);
  next();
});

// Check if the password is valid
userSchema.methods.passwordCheck = async function (
  incomingPassword,
  storedPassword
) {
  return await bcrypt.compare(incomingPassword, storedPassword);
};

userSchema.methods.tokenTimestampValidate = function (tokenTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model('users', userSchema);

exports.User = User;
