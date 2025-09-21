import { User } from "../models/User.js";
import bcrypt, { hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existUser) {
            if (existUser.username === username) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            if (existUser.email === email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const hashedpass = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedpass
        });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id:user.id,
            username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );
        return res.status(200).json({
            token,
            id: user._id,
            username: user.username, 
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = async(req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('user has been logged out');
  } catch (error) {
    next(error);
  }
}