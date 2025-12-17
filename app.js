require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

const app = express();

// Database Connection
require('./config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({   // session in mongo instead of memory
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_hub'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Make user available in all views ,routes
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.session.success_msg || null; // flash message
  res.locals.error_msg = req.session.error_msg || null;
  delete req.session.success_msg;
  delete req.session.error_msg;
  next();
}); 

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});