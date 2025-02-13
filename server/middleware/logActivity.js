const ActivityLog = require('../models/ActivityLog');

const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user ? req.user.username : 'Unknown';
      const role = req.user ? req.user.role : 'Unknown'; // Capture the role from the user object
      const log = new ActivityLog({
        user: user,
        role: role,
        action: action,
      });
      await log.save();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
    next();
  };
};


module.exports = logActivity;
