require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const accountsRoutes = require('./routes/accounts');
const path = require('path');
const app = express();
const helmet = require('helmet');
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5001;

// CORS Configuration
app.use(cors({
  origin: ['https://idonate-3zc8.onrender.com', 'http://localhost:50841'], // Replace with your frontend's actual URL
  credentials: true,                          // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(helmet({
  hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply HSTS to subdomains
      preload: true,
  },
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"], // Allow resources from the same origin
          scriptSrc: ["'self'", "'sha256-JgpphxtupW+atTkR3NtSLqsE7EdOykRMk5Dv+tMhcpY='", "https://cdnjs.cloudflare.com"], // Allow scripts from the same origin and trusted CDN
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow styles from the same origin and inline styles
          imgSrc: ["'self'", "blob:", "data:"], // Allow images from the same origin, data URIs, and a trusted source
          connectSrc: ["'self'"], // Allow connections to your own server and a trusted API
          scriptSrcAttr: ["'self'", "'unsafe-inline'"]
      }
  },
  frameguard: {
      action: 'Deny'
  },
}))

app.use((req, res, next) => {
  res.set('X-XSS-Protection', '1; mode=block');
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer'); // Change this based on your needs
  next();
});

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()'); // Adjust as needed
  next();
});


// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes from /routes/accounts
app.use('/routes/accounts', accountsRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all route to serve the React app (if no API route matches)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});


// 404 Handler for Non-Route and Non-Static Routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Connect to MongoDB and Start Server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('MongoDB is connected');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
