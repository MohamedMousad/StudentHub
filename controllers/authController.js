const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');


const GetSignUp = (req, res) => {
    res.render('signup', { title: 'Sign Up', errors: [] });
}

const SignUp = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('signup', {
            title: 'Sign Up',
            errors: errors.array(),
            ...req.body
        });
    }

    try {
        const { name, email, password, studentId, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
        if (existingUser) {
            return res.render('signup', {
                title: 'Sign Up',
                errors: [{ msg: 'Email or Student ID already registered' }],
                ...req.body
            });
        }

        // Check if document was uploaded
        if (!req.file) {
            return res.render('signup', {
                title: 'Sign Up',
                errors: [{ msg: 'Student ID document is required' }],
                ...req.body
            });
        }

        // Generate filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `student-id-${uniqueSuffix}${path.extname(req.file.originalname)}`;

        // Save file manually
        const uploadPath = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            'documents',
            filename
        );

        fs.writeFileSync(uploadPath, req.file.buffer);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            studentId,
            studentIdDocument: '/uploads/documents/' + filename,
            status: 'pending'
        });

        req.session.success_msg = 'Registration successful! Please wait for admin approval.';
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.render('signup', {
            title: 'Sign Up',
            errors: [{ msg: 'Registration failed. Please try again.' }],
            ...req.body
        });
    }
}

const GetLogin = (req, res) => {
    res.render('login', { title: 'Login', errors: [] });
}

const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Login',
            errors: errors.array(),
            email: req.body.email
        });
    }

    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                title: 'Login',
                errors: [{ msg: 'Invalid email or password' }],
                email
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {
                title: 'Login',
                errors: [{ msg: 'Invalid email or password' }],
                email
            });
        }

        // Check if account is approved (unless admin)
        if (user.role !== 'admin' && user.status !== 'approved') {
            return res.render('login', {
                title: 'Login',
                errors: [{ msg: `Your account is ${user.status}. Please wait for admin approval.` }],
                email
            });
        }

        // Set session
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        };

        req.session.success_msg = 'Login successful!';

        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/profile/me');
        }
    } catch (error) {
        console.error(error);
        res.render('login', {
            title: 'Login',
            errors: [{ msg: 'Login failed. Please try again.' }],
            email: req.body.email
        });
    }
}
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.clearCookie('connect.sid');
        console.log("session destroyed successfully")
        res.redirect('/');
    });
}

module.exports = {
    GetSignUp,
    SignUp,
    GetLogin,
    login,
    logout
}