const mongoose = require('mongoose');

const proofOfPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
  name: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  imagePath: { type: String },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('ProofOfPayment', proofOfPaymentSchema);
