const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    match: /^09\d{9}$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, required: true, default: 'supereadmin' }
}, { timestamps: true });

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports = SuperAdmin;
