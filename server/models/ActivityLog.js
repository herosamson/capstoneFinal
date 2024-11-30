const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  role: { type: String, required: true }, // user, staff, admin, etc.
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
