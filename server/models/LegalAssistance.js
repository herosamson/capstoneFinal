const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LegalAssistanceSchema = new Schema({
  name: { type: String, required: true },
  legalType: { type: String, required: true },
  contactNumber: { type: String, required: true },
  targetDate: { type: Date, required: true },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('LegalAssistance', LegalAssistanceSchema);
