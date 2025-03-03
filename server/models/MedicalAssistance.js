const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicalAssistanceSchema = new Schema({
  name: { type: String, required: true },
  typeOfMedicine: { type: String, required: true },
  quantity: { type: Number, required: true },
  contactNumber: { type: Number, required: true },
  location: { type: String, required: true },
  reason: { type: String, required: true },
  targetDate: { type: Date, required: true },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
}, { timestamps: true });

module.exports = mongoose.model('MedicalAssistance', MedicalAssistanceSchema);
