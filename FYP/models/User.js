const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'staff'], required: true }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;