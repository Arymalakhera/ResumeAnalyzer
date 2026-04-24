const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read users
const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify([]));
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users:", err);
        return [];
    }
};

// Helper to save users
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key_for_testing';

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const users = readUsers();
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
        
        res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const users = readUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};
