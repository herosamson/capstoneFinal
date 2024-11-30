const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;
