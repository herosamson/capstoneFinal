
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  volunteers: { type: String, required: true },
  materialsNeeded: { type: [String], required: true },
  numberOfPax: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
