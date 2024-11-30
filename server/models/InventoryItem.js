const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  expiration: { type: String },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  username: { type: String, required: true }, 
  status: { type: String, enum: ['consumed', 'unconsumed'], default: 'unconsumed' },
  consumptionReasons: [{ type: String }],
}, { timestamps: true });

const InventoryItem = mongoose.model('Inventory', InventoryItemSchema);

module.exports = InventoryItem;
