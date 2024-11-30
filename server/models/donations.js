const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String },
  date: { type: Date, required: true },
  contact: { type: String, required: true },
  expirationDate: { type: Date },
  received: { type: Boolean, default: false },
  firstname: { type: String },
  lastname: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register'},
  donationId: { type: String, required: true },
  location: {
    cabinet: { type: Number },
    column: { type: Number },
    row: { type: Number },
  },
  consumptions: [
    {
      quantity: { type: Number },
      location: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  status: { type: String, enum: ['Unconsumed', 'Consumed'], default: 'Unconsumed' },
  donatedTo: { type: [String], default: [] },
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
