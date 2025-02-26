const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require('path');
const SECRET_KEY = "e48c461823ec94fd9b9f49996e0edb7bfa85ee66a8e86a3de9ce12cf0e657ac1";
const Creadential = require('../model/Creads');
const nodemailer = require("nodemailer")

const signUp = async (req, res) => {
    try {
        const { full_name, email, password, profile_picture, role } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const cred = new Creadential({ full_name, email, password: hashedPassword, profile_picture, role });
        await cred.save();

        // Setup Nodemailer Transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vitalflow33@gmail.com",
                pass: "zogh jnnd cmux ohjt" // Replace with App Password
            }
        });

        // Email Content
        const mailOptions = {
            from: '"VitalFlow MedLink" <vitalflow33@gmail.com>',
            to: cred.email,
            subject: "Account Created Successfully",
            html: `
                <h1>Welcome to VitalFlow</h1>
                <p>Your account has been created successfully.</p>
                <p><strong>User ID:</strong> ${cred._id}</p>
            `
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(201).json({ message: "User created successfully", cred, emailInfo: info });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error signing up", error });
    }
};

const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Creadential.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found. Please sign up." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, name: user.full_name },
            SECRET_KEY,
            { expiresIn: "10h" }
        );

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
// @desc Upload Single Image
// @route POST /api/creds/profile
// @access Private

const uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
        success: true,
        data: req.file.filename,
    });
};

const getuser = async (req, res) => {
    try {
        const user = await Creadential.find();
        res.status(200).json(user);
    }
    catch (e) {
        res.json(e)
    }
}

module.exports = {
    signUp,
    login,
    uploadImage,
    getuser
    // Export multer for use in routes
};
