const Order = require("../model/order");
const Cart = require("../model/cart"); // Assuming you have a Cart model
const User = require("../model/Creads"); // Import User model

const nodemailer = require("nodemailer")

const findAll = async (req, res) => {
    try {
        const items = await Order.find().populate({
            path: "cartId",
            populate: { path: "items.itemId" }, // Optionally populate item details if itemId refs another model
        });
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(items);
    } catch (e) {
        res.status(500).json({
            message: "Error fetching orders",
            error: e.message,
        });
    }
};
const saveOrder = async (req, res) => {
    try {
        const { userId, address, phone_no, cartId } = req.body;

        if (!userId || !address || !phone_no) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const order = new Order({
            userId,
            address,
            phone_no,
            cartId
        });

        await order.save();
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
            to: user.email,
            subject: "YOUR ORDER IS Created Successfully",
            html: `
                        <h1>WE HAVE GOT YOUR ORDER </h1>
                        <p>WE WILL CALL YOU WHEN AND DELIVER TO YOU LOCATION.</p>
                        
                    `
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(201).json(order);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
};
const deleteById = async (req, res) => {
    try {
        const cart = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("data deleted");
    }
    catch (e) {
        res.json(e)
    }
}

module.exports = { saveOrder, findAll, deleteById };