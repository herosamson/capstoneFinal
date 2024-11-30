const mongoose = require('mongoose');

const CabinetSchema = new mongoose.Schema({
  cabinetNumber: { type: Number, required: true, unique: true },
  columns: { type: Number, required: true, default: 10 },
  rows: { type: Number, required: true, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('Cabinet', CabinetSchema);
