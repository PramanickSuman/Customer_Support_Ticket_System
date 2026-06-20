const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?', 
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine if approved (admins are auto-approved)
        const isApproved = role === 'admin' ? 1 : 0;

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'customer', isApproved]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if support_agent is approved
        if (user.role === 'support_agent' && !user.is_approved) {
            return res.status(403).json({ message: 'Your account is pending admin approval. Please contact admin.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { register, login };