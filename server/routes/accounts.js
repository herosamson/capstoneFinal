const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const bcrypt = require('bcryptjs');
const Donation = require('../models/donations');
const Register = require('../models/registerUser');
const Event = require('../models/events');
const FinancialAssistance = require('../models/FinancialAssistance');
const FoodAssistance = require('../models/FoodAssistance');
const MedicalAssistance = require('../models/MedicalAssistance');
const LegalAssistance = require('../models/LegalAssistance');
const DisasterRelief = require('../models/DisasterRelief');
const Admin = require('../models/admin');
const crypto = require('crypto');
const multer = require('multer');
const ProofOfPayment = require('../models/proofofpayment'); 
const path = require('path');
const LogActivity = require('../middleware/logActivity');
const ActivityLog = require('../models/ActivityLog');
const rateLimit = require('express-rate-limit');
const OTPVerification = require('../models/otp');
const SuperAdmin = require('../models/SuperAdmin');
const nodemailer = require('nodemailer');
const cors = require('cors');
const Cabinet = require('../models/Cabinet');

// Rate Limiter Middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts, please try again later'
});
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Generate a unique 7-digit hex code
const generateDonationId = () => {
  return crypto.randomBytes(4).toString('hex').slice(0, 7);
};

// Update user password (for all roles)
router.post('/user/change-password/:id', async (req, res) => {
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find user across roles
    const updatedUser = await Promise.allSettled([
      SuperAdmin.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true, fields: { password: 0 } }),
      Admin.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true, fields: { password: 0 } }),
      Staff.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true, fields: { password: 0 } }),
      Register.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true, fields: { password: 0 } })
    ]);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send-reset-otp', async (req, res) => {
  try {
    const { email } = req.body;

    let user = null; // Declare user variable

    // Sequentially check each role for the email
    user = await SuperAdmin.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }
    if (!user) {
      user = await Staff.findOne({ email });
    }
    if (!user) {
      user = await Register.findOne({ email });
    }

    // If no user was found after all queries
    if (!user) {
      return res.status(401).json({ error: "No account found with this email." });
    }


    // Generate OTP
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const saltrounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltrounds);

    // Save OTP verification data
    const newOTPVerification = new OTPVerification({
      userId: user._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    await newOTPVerification.save();

    // Send OTP via email
    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: email,
      subject: "Reset your password - OTP Verification",
      html: `<p>Good Day!</p>
      <p>You have requested to reset your password. To proceed, 
      please use the following One-Time Password (OTP) for verification:</p>
      <p>Your OTP is:</p><h3>${otp}</h3>
      <p>This OTP is valid for 1 hour. For your security, please do not share this OTP with anyone,
      and avoid entering it on any suspicious links or websites.</p>
      <p>If you did not request a password reset, please ignore this message, 
      and your account will remain secure.</p>
      <p>Thank you for using our services.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ userId: user._id, message: "OTP sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while sending OTP." });
  }
});

// register email verification
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ error: "Empty OTP details are not allowed" });
    }
    const UserOTPVerificationRecords = await OTPVerification.find({ userId }).sort({ createdAt: -1 }).limit(1);
    if (UserOTPVerificationRecords.length === 0) {
      return res.json({
        error: "Account record doesn't exist or has been verified already. Please sign up or log in.",
      });
    }

    const { expiresAt, otp: hashedOTP } = UserOTPVerificationRecords[0];

    if (expiresAt < Date.now()) {
      await OTPVerification.deleteMany({ userId });
      return res.json({ error: "Code is expired. Please request again." });
    }

    if (!hashedOTP) {
      return res.json({ error: "Invalid OTP data." });
    }

    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      return res.json({ error: "Invalid code. Please check your email." });
    }

    await Register.updateOne({ _id: userId }, { verified: true });
    await OTPVerification.deleteMany({ userId });

    res.json({
      status: "VERIFIED",
      message: "User email verified successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

const sendVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `<p>Good Day!</p> 
      <p>For your security, please never share your OTP with anyone or enter 
      it into any suspicious links. Your OTP is confidential and expires in 1 hour.</p>
       <p>If you DID NOT make this request, please ignore this message.</p>
      <p>Your OTP is:</p><h3>${otp}</h3>
      <p>Thank you for helping us keep your account secure.</p>`
    };
    const saltrounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltrounds);
    const newOTPVerification = new OTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

  } catch (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "idonate2024@gmail.com",
    pass: "vsrhiawtcpvddkgu", 
  },
});

//admin add user
router.post('/register-verified', async (req, res) => {
  try {
    const { firstname, lastname, contact,  email, username, password } = req.body;

    // Check if the username already exists across all user collections
    const userExists = await Register.findOne({ username }) || 
                       await Staff.findOne({ username }) || 
                       await Admin.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Check if the email already exists across all user collections
    const emailExists = await Register.findOne({ email }) || 
                       await Staff.findOne({ email }) || 
                       await Admin.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Check if the contact number already exists across all user collections
    const contactExists = await Register.findOne({ contact }) || 
                         await Staff.findOne({ contact }) || 
                         await Admin.findOne({ contact });
    if (contactExists) {
      return res.status(400).json({ message: 'Contact number already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with verified set to true
    const newUser = new Register({
      firstname,
      lastname,
      contact,
      email,
      username,
      password: hashedPassword,
      verified: true, // Automatically set verified to true
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering verified user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration
router.post('/register', async (req, res) => {
  const { firstname, lastname, contact, email, username, password } = req.body;

  try {
    // Check for unique username, email, and contact across all models using Promise.all
    const [userExists, emailExists, contactExists] = await Promise.all([
      Register.findOne({ username }) || Staff.findOne({ username }) || Admin.findOne({ username }),
      Register.findOne({ email }) || Staff.findOne({ email }) || Admin.findOne({ email }),
      Register.findOne({ contact }) || Staff.findOne({ contact }) || Admin.findOne({ contact }),
    ]);

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    if (contactExists) {
      return res.status(400).json({ message: 'Contact number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({ firstname, lastname, contact, email, username, password: hashedPassword, verified: false });

    await newUser.save();

    const role = 'user';
    req.user = { username: newUser.username, role: role };
    await LogActivity('New User Registered')(req, res, () => {});
    await sendVerificationEmail(newUser);

    return res.status(201).json({
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      message: 'Registration successful, verification email sent.'
    });

  } catch (error) {
    console.error('Registration error:', error.message);
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = null;
    let role = '';

    // Check if the user is an admin
    const admin = await Admin.findOne({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      user = admin;
      role = 'admin';
    }

    // Check if the user is a staff
    const staff = await Staff.findOne({ username });
    if (staff && await bcrypt.compare(password, staff.password)) {
      user = staff;
      role = 'staff';
    }

    // Check if the user is a regular registered user
    const registeredUser = await Register.findOne({ username });
    if (registeredUser && await bcrypt.compare(password, registeredUser.password)) {
      user = registeredUser;
      role = 'user';
    }

    // Check if the user is a superadmin
    const superadmin = await SuperAdmin.findOne({ username });
    if (superadmin && await bcrypt.compare(password, superadmin.password)) {
      user = superadmin;
      role = 'superadmin';
    }

    // If no user is found, send a 401 response
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // If the user is a regular registered user but not verified, send a 403 response
    if (role === 'user' && !user.verified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your email before logging in.' });
    }

    // Log the login activity before sending the response
    await LogActivity('Logged in', user.username, role);

    // Successfully authenticated, send the response
    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      userId: user._id,
      username: user.username,
      role: role,
      firstname: user.firstname,
      lastname: user.lastname,
      contact: user.contact
    });

  } catch (error) {
    // Handle any server-side errors
    return res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await Register.find({ staff: { $ne: true } }, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const deletedUser = await Register.findById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const superAdmin = await SuperAdmin.findOne({ username });
    if (!superAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Only Super Admins can delete users.' });
    }

    await Register.findByIdAndDelete(id);

    // ✅ Fix LogActivity call
    req.user = { username, role: 'superadmin' }; 
    await LogActivity(`Deleted donor: ${deletedUser.username}`)(req, res, () => {});

    return res.status(200).json({ message: 'Donor deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



router.post('/verify-superadmin', async (req, res) => {
  const { password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ role: 'superadmin' }); 

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Authorization successful' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Staff Route
router.post('/stafff', async (req, res) => {
  const { firstname, lastname, contact, email, username, password } = req.body;

  try {
    // Check for unique username, email, and contact across all models
    const userExists = await Register.findOne({ username }) || await Staff.findOne({ username }) || await Admin.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const emailExists = await Register.findOne({ email }) || await Staff.findOne({ email }) || await Admin.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const contactExists = await Register.findOne({ contact }) || await Staff.findOne({ contact }) || await Admin.findOne({ contact });
    if (contactExists) {
      return res.status(400).json({ message: 'Contact number already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new staff member
    const staff = new Staff({
      firstname,
      lastname,
      contact,
      email,
      username,
      password: hashedPassword,
    });

    // Save the staff member
    const savedStaff = await staff.save();

    const role = 'staff'; 
    req.user = { username: savedStaff.username, role: role }; 
    await LogActivity('Added New Staff')(req, res, () => {}); 


    // Return the staff member
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Get all staff members
router.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find({}, { password: 0 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const superAdmin = await SuperAdmin.findOne({ username });
    if (!superAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Only Super Admins can delete staff members.' });
    }

    await Staff.findByIdAndDelete(id);

    // ✅ Fix LogActivity call
    req.user = { username, role: 'superadmin' }; 
    await LogActivity(`Deleted staff member: ${staff.username}`)(req, res, () => {});

    return res.status(200).json({ message: 'Staff member deleted successfully.' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});









// Update staff member details
router.put('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if username, contact, and email are unique
    const { username, contact, email } = updateData;
    const duplicateStaff = await Staff.findOne({
      _id: { $ne: id },
      $or: [{ username }, { contact }, { email }],
    });

    const duplicateUser = await Register.findOne({
      $or: [{ username }, { contact }, { email }],
    });

    const duplicateAdmin = await Admin.findOne({
      $or: [{ username }],
    });

    if (duplicateStaff || duplicateUser || duplicateAdmin) {
      return res.status(400).json({
        message: 'Username, contact, or email already exists in the system',
      });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({
      message: 'Staff member updated successfully',
      staff: updatedStaff,
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    res
      .status(500)
      .json({ message: 'Failed to update staff member', error: error.message });
  }
});

router.put('/staff/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the staff member's password
    const updatedStaff = await Staff.findByIdAndUpdate(id, { password: hashedPassword }, {
      new: true,
    });

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
});

// Get user details by username
router.get('/user/:username', async (req, res) => {
  try {
    const user = await Register.findOne({ username: req.params.username }, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const donations = await Donation.find({ user: user._id });
    res.status(200).json({ user, donations  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user details by username
router.put('/user/:username', async (req, res) => {
  try {
    const { username, email, contact } = req.body;

    // Check if the new username already exists
    const existingUser = await Register.findOne({ username });
    if (existingUser && existingUser.username !== req.params.username) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check if the email or contact already exists across all collections
    const emailExists = await Register.findOne({ email }) || await Staff.findOne({ email }) || await Admin.findOne({ email });
    const contactExists = await Register.findOne({ contact }) || await Staff.findOne({ contact }) || await Admin.findOne({ contact });

    if ((emailExists && emailExists.username !== req.params.username) || (contactExists && contactExists.username !== req.params.username)) {
      return res.status(400).json({ message: 'Email or contact number already in use' });
    }

    // Proceed to update the user details
    const updatedUser = await Register.findOneAndUpdate(
      { username: req.params.username },
      { ...req.body, username },
      { new: true, fields: { password: 0 } } // Exclude password from the response
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log activity
    const role = 'user'; 
    req.user = { username: updatedUser.username, role: role }; 
    await LogActivity('User details updated')(req, res, () => {});

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get user details by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await Register.findById(req.params.id, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user details
router.put('/user/:id',  async (req, res) => {
  const { firstname, lastname, contact, email, username } = req.body;

  try {
    const updatedData = { firstname, lastname, contact, email, username };

    const updatedUser = await Register.findByIdAndUpdate(req.params.id, updatedData, { new: true, fields: { password: 0 } });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept a donation and send an email confirmation
router.put("/donations/accept/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id).populate("user"); // Populate user details

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.received) {
      return res.status(400).json({ message: "This donation has already been received." });
    }

    donation.received = true;
    await donation.save();

    // Get donor's email from the user data
    const donorEmail = donation.user?.email || null;

    if (!donorEmail) {
      return res.status(200).json({
        message: "Donation accepted successfully, but donor email not found.",
        donation,
      });
    }

    // Send confirmation email to the donor
    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: donorEmail,
      subject: "Item Donation Received",
      html: `
        <p>Dear ${donation.user?.firstname || "Donor"},</p>
        <p>We are pleased to inform you that we have received your item donation.</p>
        <ul>
          <li><strong>Item:</strong> ${donation.item}</li>
          <li><strong>Quantity:</strong> ${donation.quantity} ${donation.unit || ""}</li>
          <li><strong>Donation ID:</strong> ${donation.donationId}</li>
        </ul>
        <p>Thank you for your generosity and support! Your donation will go a long way in helping those in need.</p>
        <p>Best regards,</p>
        <p>iDonate Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Donation received and email sent.", donation });
  } catch (error) {
    console.error("Failed to accept donation:", error);
    res.status(500).json({ message: "Failed to accept donation", error: error.message });
  }
});

router.post("/donations/add", async (req, res) => {
  const { items, date, username } = req.body;

  try {
    // Find the user by username
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const donationId = generateDonationId(); // Ensure this function exists

    const donations = items.map((item) => ({
      ...item,
      date,
      user: user._id,
      contact: user.contact,
      donationId,
      category: item.category,
    }));

    // Save donations to the database
    await Donation.insertMany(donations);

    // Send confirmation email to the donor
    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: user.email, // Get donor's email from user data
      subject: "Item Donation Request Received",
      html: `
        <p>Dear ${user.username},</p>
        <p>We have received your request for an item donation. Here are the details:</p>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.quantity} ${item.unit} of ${item.item} (Category: ${item.category})</li>`
            )
            .join("")}
        </ul>
        <p><strong>Delivery Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p>Please deliver the items to Quiapo Church on the scheduled date.</p>
        <p>Thank you for your generosity and support!</p>
        <p>Best regards,</p>
        <p>iDonate Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Donations added and email sent successfully", donations });
  } catch (error) {
    console.error("Failed to submit donations:", error);
    res.status(500).json({ message: "Failed to submit donations", error: error.message });
  }
});


// Get all donations (including user information)
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find().populate('user', 'username firstname lastname contact'); 
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
  }
});

// Delete a donation
router.delete('/donations/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDonation = await Donation.findByIdAndDelete(id);
    if (!deletedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete donation:', error); // Log the error
    res.status(500).json({ message: 'Failed to delete donation', error: error.message });
  }
});

// Add a single donation (walk-in donor)
router.post('/donations/addSingle', async (req, res) => {
  const { name, contact, item, quantity, expirationDate, dateOfDelivery } = req.body;

  // Basic validation
  if (!name || !contact || !item || !quantity || !dateOfDelivery) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  // Additional validations can be performed here if needed

  try {
    const donationId = await generateDonationId();

    const [firstname, ...lastnameArr] = name.trim().split(' ');
    const lastname = lastnameArr.join(' ') || '';

    const newDonation = new Donation({
      item,
      quantity,
      date: dateOfDelivery,
      contact,
      expirationDate: expirationDate || null,
      firstname,
      lastname,
      donationId,
      received: true, // Mark as received since it's a walk-in
      // user is not set for walk-in donations
    });

    await newDonation.save();

    res.status(201).json({ message: 'Donation added successfully', donation: newDonation });
  } catch (error) {
    console.error('Failed to add donation:', error);
    res.status(500).json({ message: 'Failed to add donation', error: error.message });
  }
});


// Get all requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await ReceivedDonation.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Failed to fetch requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

// Delete a request
router.delete('/requests/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await ReceivedDonation.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Failed to delete request:', error);
    res.status(500).json({ message: 'Failed to delete request', error: error.message });
  }
});

// Accept a request (mark as received)
router.put('/requests/receive/:id', async (req, res) => {
  try {
    const request = await ReceivedDonation.findByIdAndUpdate(req.params.id, { received: true }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request marked as received', request });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
});

// Create a new event
router.post('/events/add', async (req, res) => {
  const { eventName, eventDate, volunteers, materialsNeeded = [], numberOfPax } = req.body;
  try {
    if (!eventName || !eventDate || !volunteers || materialsNeeded.length === 0 ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newEvent = new Event({ eventName, eventDate, volunteers, materialsNeeded, numberOfPax });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { eventName, eventDate, volunteers, materialsNeeded, numberOfPax } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { eventName, eventDate, volunteers, materialsNeeded, numberOfPax }, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Failed to update event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Failed to delete event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// Get past events (events with a date earlier than today)
router.get('/events/history', async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    
    // Find events with a date less than today
    const pastEvents = await Event.find({ eventDate: { $lt: today } });
    
    res.status(200).json(pastEvents);
  } catch (error) {
    console.error('Failed to fetch past events:', error);
    res.status(500).json({ message: 'Failed to fetch past events', error: error.message });
  }
});

// Approve a medical assistance request
router.put('/medical-assistance/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await MedicalAssistance.findByIdAndUpdate(id, { approved: true }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Medical assistance request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error('Failed to approve medical assistance request:', error);
    res.status(500).json({ message: 'Failed to approve medical assistance request', error: error.message });
  }
});

// Add a medical request
router.post('/medical-assistance/add', async (req, res) => {
  const { name, typeOfMedicine, quantity, contactNumber, location, reason, targetDate, username } = req.body;
  try {
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRequest = new MedicalAssistance({
      name,
      typeOfMedicine,
      quantity,
      contactNumber,
      location,
      reason,
      targetDate,
      username
    });

    const savedUser = await newRequest.save();
    const role = 'user'; 
    req.user = { username: savedUser.username, role: role }; 
    await LogActivity('Medical Assistance Request Added')(req, res, () => {});

    res.status(201).json({ message: 'Medical request added successfully', request: newRequest });
  } catch (error) {
    console.error('Failed to submit medical request:', error);
    res.status(500).json({ message: 'Failed to submit medical request', error: error.message });
  }
});

// Fetch medical requests
router.get('/medical-assistance', async (req, res) => {
  const { username } = req.headers;
  try {
    const requests = await MedicalAssistance.find({ username });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Failed to fetch medical assistance:', error);
    res.status(500).json({ message: 'Failed to fetch medical assistance', error: error.message });
  }
});

// Fetch all medical requests (Admin)
router.get('/medical-assistance/all', async (req, res) => {
  try {
    const requests = await MedicalAssistance.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Failed to fetch all medical assistance requests:', error);
    res.status(500).json({ message: 'Failed to fetch all medical assistance requests', error: error.message });
  }
});

// Approve a food request
router.post('/food-assistance/approve/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const foodRequest = await FoodAssistance.findById(requestId);

    if (!foodRequest) {
      return res.status(404).json({ message: 'Food request not found' });
    }

    foodRequest.approved = true;
    await foodRequest.save();

    res.status(200).json({ message: 'Food request approved successfully', request: foodRequest });
  } catch (error) {
    console.error('Error approving food request:', error);
    res.status(500).json({ message: 'Failed to approve food request', error: error.message });
  }
});

// Add a new food request
router.post('/food-assistance/add', async (req, res) => {
  const { name, typesOfFood, contactNumber, location, targetDate, numberOfPax, username } = req.body;

  try {
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRequest = new FoodAssistance({
      name,
      typesOfFood,
      contactNumber,
      location,
      targetDate,
      numberOfPax,
      username
    });

    const savedUser = await newRequest.save();
    const role = 'user'; 
    req.user = { username: savedUser.username, role: role }; 
    await LogActivity('Food Assistance Request Added')(req, res, () => {});

    res.status(201).json({ message: 'Food request added successfully', request: newRequest });
  } catch (error) {
    console.error('Error adding food request:', error);
    res.status(500).json({ message: 'Failed to add food request', error: error.message });
  }
});

// Get all food subsidy requests for the logged-in user
router.get('/food-assistance', async (req, res) => {
  const { username } = req.headers;
  try {
    const foodAssistance = await FoodAssistance.find({ username });
    res.status(200).json(foodAssistance);
  } catch (error) {
    console.error('Error fetching food subsidies:', error);
    res.status(500).json({ message: 'Failed to fetch food subsidies', error: error.message });
  }
});

// Get all food subsidy requests (Admin)
router.get('/food-assistance/all', async (req, res) => {
  try {
    const foodAssistance = await FoodAssistance.find();
    res.status(200).json(foodAssistance);
  } catch (error) {
    console.error('Error fetching food subsidies:', error);
    res.status(500).json({ message: 'Failed to fetch food subsidies', error: error.message });
  }
});

// Add a new financial assistance
router.post('/financial-assistance/add', async (req, res) => {
  const { name, amount, contactNumber, reason, targetDate, username } = req.body;

  try {
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRequest = new FinancialAssistance({
      name,
      amount,
      contactNumber,
      reason,
      targetDate,
      username
    });

    const savedUser = await newRequest.save();
    const role = 'user'; 
    req.user = { username: savedUser.username, role: role }; 
    await LogActivity('Financial Assistance Request Added')(req, res, () => {});
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error adding financial assistance:', error);
    res.status(500).json({ message: 'Failed to add financial assistance', error: error.message });
  }
});

// Get all financial assistance for the logged-in user
router.get('/financial-assistance', async (req, res) => {
  const { username } = req.headers;
  try {
    const financialAssistance = await FinancialAssistance.find({ username });
    res.status(200).json(financialAssistance);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch financial requests', error: error.message });
  }
});

// GET all financial requests (Admin)
router.get('/financial-assistance/all', async (req, res) => {
  try {
    const financialAssistance = await FinancialAssistance.find();
    res.status(200).json(financialAssistance);
  } catch (error) {
    console.error('Failed to fetch financial requests:', error);
    res.status(500).json({ error: 'Failed to fetch financial requests' });
  }
});

// Approve a financial assistance request
router.patch('/financial-assistance/approve/:id', async (req, res) => {
  try {
    const request = await FinancialAssistance.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve financial assistance request', error: error.message });
  }
});

// Add a new disaster relief request
router.post('/disaster-relief/add', async (req, res) => {
  const { name, disasterType, numberOfPax, contactNumber, location, targetDate, username } = req.body;

  try {
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRequest = new DisasterRelief({
      name,
      disasterType,
      numberOfPax,
      contactNumber,
      location,
      targetDate,
      username
    });

    const savedUser = await newRequest.save();
    const role = 'user'; 
    req.user = { username: savedUser.username, role: role }; 
    await LogActivity('Disaster Relief Assistance Request Added')(req, res, () => {});

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add disaster relief request', error: error.message });
  }
});

// Get all disaster relief requests for the logged-in user
router.get('/disaster-relief', async (req, res) => {
  const { username } = req.headers;
  try {
    const disasterRequests = await DisasterRelief.find({ username });
    res.status(200).json(disasterRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch disaster relief requests', error: error.message });
  }
});

// Get all disaster relief requests (Admin)
router.get('/disaster-relief/all', async (req, res) => {
  try {
    const disasterRequests = await DisasterRelief.find();
    res.status(200).json(disasterRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disaster relief requests' });
  }
});

// Approve a disaster relief request
router.patch('/disaster-relief/approve/:id', async (req, res) => {
  try {
    const request = await DisasterRelief.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve disaster relief request', error: error.message });
  }
});

// Add a new legal assistance request
router.post('/legal-assistance/add', async (req, res) => {
  const { name, legalType, contactNumber, targetDate, username } = req.body;

  try {
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRequest = new LegalAssistance({
      name,
      legalType,
      contactNumber,
      targetDate,
      username
    });

    const savedUser = await newRequest.save();
    const role = 'user'; 
    req.user = { username: savedUser.username, role: role }; 
    await LogActivity('Legal Assistance Request Added')(req, res, () => {});

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add legal assistance', error: error.message });
  }
});

// Get all legal assistance requests for the logged-in user
router.get('/legal-assistance', async (req, res) => {
  const { username } = req.headers;
  try {
    const legalRequests = await LegalAssistance.find({ username });
    res.status(200).json(legalRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch legal requests', error: error.message });
  }
});

// Fetch all legal requests
router.get('/legal-assistance/all', async (req, res) => {
  try {
    const requests = await LegalAssistance.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all legal assistance requests', error: error.message });
  }
});

// Approve a legal assistance request
router.put('/legal-assistance/:id/approve',async (req, res) => {
  const { id } = req.params;
  try {
    const request = await LegalAssistance.findByIdAndUpdate(id, { approved: true }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Legal assistance request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve legal assistance request', error: error.message });
  }
});

// Admin registration
router.post('/admin', async (req, res) => {
  const { firstname, lastname, contact, email, username, password } = req.body;

  try {
    // Check for unique email, contact, and username across all models
    const userExists = await Register.findOne({ username }) || await Staff.findOne({ username }) || await Admin.findOne({ username });
    const emailExists = await Admin.findOne({ email }) || await Staff.findOne({ email }) || await Register.findOne({ email });
    const contactExists = await Admin.findOne({ contact }) || await Staff.findOne({ contact }) || await Register.findOne({ contact });

    if (userExists || emailExists || contactExists) {
      return res.status(400).json({ message: 'Username, email, or contact already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ firstname, lastname, contact, email, username, password: hashedPassword });
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


// Fetch all admins
router.get('/admin', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
});

router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const superAdmin = await SuperAdmin.findOne({ username });
    if (!superAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Only Super Admins can delete admins.' });
    }

    await Admin.findByIdAndDelete(id);

    // ✅ Fix LogActivity call
    req.user = { username, role: 'superadmin' }; 
    await LogActivity(`Deleted admin: ${admin.username}`)(req, res, () => {});

    return res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



// Update an admin
router.put('/admin/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, contact, email, username, password } = req.body; 

  try {
    // Check for unique email, contact, and username across all models, excluding the current admin
    const userExists = await Register.findOne({ username }) || await Staff.findOne({ username }) || await Admin.findOne({ username, _id: { $ne: id } });
    const emailExists = await Admin.findOne({ email, _id: { $ne: id } }) || await Staff.findOne({ email }) || await Register.findOne({ email });
    const contactExists = await Admin.findOne({ contact, _id: { $ne: id } }) || await Staff.findOne({ contact }) || await Register.findOne({ contact });

    if (userExists || emailExists || contactExists) {
      return res.status(400).json({ message: 'Username, email, or contact already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { firstname, lastname, contact, email, username, password: hashedPassword },  
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
});


// Route to handle proof of payment submission
router.post("/addProof", upload.single("image"), async (req, res) => {
  const { name, amount, date, username } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!username || !amount || !date) { // Name is optional
    return res.status(400).json({ message: "Username, amount, and date are required." });
  }

  try {
    // Find the user by username
    const user = await Register.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Create a new ProofOfPayment document
    const newProof = new ProofOfPayment({
      user: user._id, // Associate with user
      name,
      amount,
      date,
      imagePath,
      username,
    });

    const savedProof = await newProof.save();

    // Log activity (ensure LogActivity middleware is correctly implemented)
    req.user = { username: savedProof.username, role: "user" };
    await LogActivity("Cash Donation Submitted")(req, res, () => {});

    // Send confirmation email to the donor
    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: user.email, // Get donor's email from user data
      subject: "Proof of Cash Donation Submission Received",
      html: `
        <p>Dear ${user.username},</p>
        <p>We have received your proof of cash donation of <strong>₱${amount}</strong>. Please wait while we verify your submission.</p>
        <p>You will receive another email once your donation is approved.</p>
        <p>Thank you for your generosity!</p>
        <p>Best regards,</p>
        <p>iDonate Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Proof submitted and email notification sent successfully.", proof: savedProof });
  } catch (error) {
    console.error("Error adding proof of payment:", error);
    res.status(500).json({ message: "Failed to add proof of payment.", error: error.message });
  }
});


// Fetch proofs with optional filtering by username and approval status
router.get('/proofs', async (req, res) => {
  const { username, approved } = req.query;
  const filter = {};

  if (username) {
    filter.username = username;
  }

  if (approved !== undefined) {
    filter.approved = approved === 'true';
  }

  try {
    const proofs = await ProofOfPayment.find(filter);
    res.status(200).json(proofs);
  } catch (error) {
    console.error('Error fetching proofs of payment:', error);
    res.status(500).json({ message: 'Failed to fetch proofs of payment.', error: error.message });
  }
});

// Route to approve a proof of payment and send an email confirmation
router.patch('/proofs/:id/approve', async (req, res) => {
  try {
    const proof = await ProofOfPayment.findById(req.params.id);

    if (!proof) {
      return res.status(404).json({ message: "Proof of payment not found." });
    }

    if (proof.approved) {
      return res.status(400).json({ message: "This donation is already verified." });
    }

    proof.approved = true;
    await proof.save();

    // Send verification email to donor
    const mailOptions = {
      from: "idonate2024@gmail.com",
      to: proof.email, // Get email from proof document
      subject: "Cash Donation Verified and Received",
      html: `
        <p>Dear ${proof.name || "Donor"},</p>
        <p>Your proof of cash donation of <strong>₱${proof.amount}</strong> has been received and verified.</p>
        <p>Thank you for your generosity and support!</p>
        <p>Best regards,</p>
        <p>iDonate Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Donation verified and email sent.", proof });
  } catch (error) {
    console.error("Error approving proof of payment:", error);
    res.status(500).json({ message: "Failed to approve proof of payment.", error: error.message });
  }
});



// Fetch all proofs of payment
router.get('/proofs/all', async (req, res) => {
  try {
    const proofs = await ProofOfPayment.find();
    res.status(200).json(proofs);
  } catch (error) {
    console.error('Error fetching proofs of payment:', error);
    res.status(500).json({ message: 'Failed to fetch proofs of payment', error: error.message });
  }
});


// Fetch all activity logs
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  const { username, role } = req.body; 

  try {
    req.user = { username, role }; // Set req.user for logging

    // Log the activity **before** sending a response
    await LogActivity('Logged out')(req, res, () => {});

    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Assign location to a donation
router.put('/donations/locate/:id', async (req, res) => {
  const donationId = req.params.id;
  const { cabinet, column, row } = req.body;

  if (!cabinet || !column || !row) {
    return res.status(400).json({ message: 'Cabinet, column, and row are required.' });
  }

  try {
    // Check if the cabinet exists
    const cabinetExists = await Cabinet.findOne({ cabinetNumber: cabinet });
    if (!cabinetExists) {
      return res.status(400).json({ message: 'Cabinet does not exist.' });
    }

    // Check if the column and row are within the cabinet's defined limits
    if (column < 1 || column > cabinetExists.columns || row < 1 || row > cabinetExists.rows) {
      return res.status(400).json({ message: `Column must be between 1 and ${cabinetExists.columns}, Row must be between 1 and ${cabinetExists.rows}.` });
    }

    // Check if the location is already assigned
    const existingDonation = await Donation.findOne({
      'location.cabinet': cabinet,
      'location.column': column,
      'location.row': row,
    });

    if (existingDonation) {
      return res.status(400).json({ message: 'The chosen cabinet, column, and row number are already occupied.' });
    }

    // Assign the location
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { location: { cabinet, column, row } },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.status(200).json({ message: 'Location assigned successfully.', donation });
  } catch (error) {
    console.error('Error assigning location:', error);
    res.status(500).json({ message: 'Failed to assign location.', error: error.message });
  }
});

// Consume a donation item
router.put('/donations/consume/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, location, donatedTo } = req.body;

  try {
    // Find the donation by ID
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    // Check if there's enough quantity to consume
    if (donation.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough quantity to consume.' });
    }

    // Subtract the consumed quantity
    donation.quantity -= quantity;

    // Log the consumption
    donation.consumptions.push({
      quantity,
      location,
      date: new Date(),
    });

   // Ensure donatedTo is always an array
if (!Array.isArray(donation.donatedTo)) {
  donation.donatedTo = typeof donation.donatedTo === 'string' ? [donation.donatedTo] : []; 
}

// Append the new donatedTo location
if (Array.isArray(donatedTo)) {
  donatedTo.forEach(location => {
    if (location && location.trim()) {
      donation.donatedTo.push(location.trim());
    }
  });
}
    // Update status based on remaining quantity
    // Status is 'Consumed' whenever any consumption occurs
    donation.status = 'Consumed';

    // Save the updated donation
    await donation.save();

    // Respond with the updated donation
    res.status(200).json({
      message: 'Consumption recorded successfully.',
      donation,
    });
  } catch (error) {
    console.error('Failed to consume donation:', error);
    res.status(500).json({
      message: 'Failed to consume donation.',
      error: error.message,
    });
  }
});

// Get all donations with assigned locations (including user information)
router.get('/donations/located', async (req, res) => {
  try {
    const donations = await Donation.find({
      'location.column': { $ne: null },
      'location.row': { $ne: null },
    }).populate('user', 'username firstname lastname contact');

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch located donations', error: error.message });
  }
});

// Create a new SuperAdmin
router.post('/superadmin/add', async (req, res) => {
  const { firstname, lastname, contact, email, username, password } = req.body;

  if (!firstname || !lastname || !contact || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check for unique fields across all roles (SuperAdmin, Admin, Staff)
    const existingUser = await Promise.any([
      SuperAdmin.findOne({ $or: [{ username }, { email }, { contact }] }),
      Admin.findOne({ $or: [{ username }, { email }, { contact }] }),
      Staff.findOne({ $or: [{ username }, { email }, { contact }] })
    ]);

    if (existingUser) {
      return res.status(400).json({ message: 'Username, email, or contact already exists in the system.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = new SuperAdmin({
      firstname,
      lastname,
      contact,
      email,
      username,
      password: hashedPassword
    });

    const savedSuperAdmin = await newSuperAdmin.save();
    res.status(201).json(savedSuperAdmin);
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// Get all SuperAdmins
router.get('/superadmin/all', async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.find();
    res.status(200).json(superAdmins);
  } catch (error) {
    console.error('Error fetching SuperAdmins:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update a SuperAdmin
router.put('/superadmin/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, contact, email, username, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findById(id);
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found.' });
    }

    // Update fields if provided
    if (firstname) superAdmin.firstname = firstname;
    if (lastname) superAdmin.lastname = lastname;
    if (contact) superAdmin.contact = contact;
    if (email) superAdmin.email = email;
    if (username) superAdmin.username = username;
    if (password) {
      // Hash the new password
      superAdmin.password = await bcrypt.hash(password, 10);
    }

    const updatedSuperAdmin = await superAdmin.save();
    res.status(200).json(updatedSuperAdmin);
  } catch (error) {
    console.error('Error updating SuperAdmin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/superadmin/delete/:id', async (req, res, next) => {
  try {
    const { id, username } = req.params;

    // Check if Super Admin exists
    const superAdmin = await SuperAdmin.findById(id);
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found.' });
    }

    // Ensure requester is a Super Admin
    const superAdminRequester = await SuperAdmin.findOne({ username });

    req.user = { 
      username: superAdminRequester.username, 
      role: 'superadmin' 
    };

    // Call log middleware here
    await LogActivity('Deleted a Super Admin')(req, res, () => {});

    await SuperAdmin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'SuperAdmin deleted successfully.' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});






// Route to add a new cabinet
router.post('/addCabinet', async (req, res) => {
  const { cabinetNumber, columns, rows } = req.body;

  // Basic validation
  if (!cabinetNumber || !columns || !rows) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (columns < 1 || columns > 10 || rows < 1 || rows > 10) {
    return res.status(400).json({ message: 'Columns and Rows must be between 1 and 10.' });
  }

  try {
    // Check if cabinet number already exists
    const existingCabinet = await Cabinet.findOne({ cabinetNumber });
    if (existingCabinet) {
      return res.status(400).json({ message: 'Cabinet number already exists.' });
    }

    const newCabinet = new Cabinet({
      cabinetNumber,
      columns,
      rows,
    });

    await newCabinet.save();
    res.status(201).json({ message: 'Cabinet added successfully.', cabinet: newCabinet });
  } catch (error) {
    console.error('Error adding cabinet:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});


// Get all cabinets
router.get('/cabinets', async (req, res) => {
  try {
    const cabinets = await Cabinet.find().sort({ cabinetNumber: 1 });
    res.status(200).json(cabinets);
  } catch (error) {
    console.error('Error fetching cabinets:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Email when a donor submits proof of donation
router.post('/send-submission-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const mailOptions = {
    from: "idonate2024@gmail.com",
    to: email,
    subject: "Proof of Cash Donation Submission Received",
    html: `
      <p>Dear Donor,</p>
      <p>We have received your proof of cash donation. Please wait while we verify your submission.</p>
      <p>You will receive another email once your donation is approved.</p>
      <p>Thank you for your generosity!</p>
      <p>Best regards,</p>
      <p>iDonate Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Submission email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Email when staff verifies the donation
router.post('/send-verification-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const mailOptions = {
    from: "idonate2024@gmail.com",
    to: email,
    subject: "Cash Donation Verified and Recieved",
    html: `
      <p>Dear Donor,</p>
      <p>Your proof of cash donation has been received and verified.</p>
      <p>Thank you for your generosity and support!</p>
      <p>Best regards,</p>
      <p>iDonate Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

module.exports = router;

