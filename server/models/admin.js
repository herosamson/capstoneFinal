const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
