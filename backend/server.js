const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // استخدمي مفتاحًا سريًا أقوى في الإنتاج

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',  // اسمحي للـ React frontend بالوصول
    credentials: true
}));

// تخزين المستخدمين في الذاكرة (مؤقتًا)
const users = {};

// **تسجيل المستخدم**
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.status(201).json({ message: "User registered successfully" });
});

// **تسجيل الدخول**
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // ضعيه true إذا كنتِ تعملين على HTTPS
        sameSite: 'strict'
    });

    res.json({ message: "Login successful" });
});

// **صفحة البروفايل (محمية بالتوكن)**
app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: `Welcome ${decoded.username}` });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// **تسجيل الخروج**
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
