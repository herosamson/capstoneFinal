const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinancialAssistanceSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  reason: { type: String, required: true },
  targetDate: { type: Date, required: true },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true }, // New field for approval status
}, { timestamps: true });

module.exports = mongoose.model('FinancialAssistance', FinancialAssistanceSchema);
