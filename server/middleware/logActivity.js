const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, role, action) => {
  try {
    const log = new ActivityLog({
      user: user || 'Unknown',
      role: role || 'Unknown',
      action: action,
      timestamp: new Date(),
    });
    await log.save();
    console.log('Activity Logged:', { user, role, action }); // Debugging
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
