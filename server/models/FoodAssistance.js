const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodAssistanceSchema = new Schema({
  name: { type: String, required: true },
  typesOfFood: { type: String, required: true },
  contactNumber: { type: String, required: true },
  location: { type: String, required: true },
  targetDate: { type: Date, required: true },
  numberOfPax: { type: Number, required: true },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false } // New field
}, { timestamps: true });

module.exports = mongoose.model('FoodAssistance', FoodAssistanceSchema);

