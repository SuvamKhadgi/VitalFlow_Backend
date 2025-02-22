// // const { Router } = require('express ');
const Cart = require('../model/cart')
const Item = require('../model/items')
const findAll = async (req, res) => {
    try {
        const item = await Cart.find();
        res.status(200).json(item);
    }
    catch (e) {
        res.json(e)
    }
}


const save = async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Ensure required fields are present
        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "userId and items array are required" });
        }

        // Validate itemIds in the items array
        const itemIds = items.map((item) => item.itemId);
        const itemsInDb = await Item.find({ _id: { $in: itemIds } });
        if (itemsInDb.length !== itemIds.length) {
            return res.status(400).json({ error: "Some items do not exist in the database" });
        }

        // Check if a cart already exists for the user
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Cart exists, update it
            items.forEach((newItem) => {
                const existingItemIndex = cart.items.findIndex(
                    (item) => item.itemId.toString() === newItem.itemId.toString()
                );

                if (existingItemIndex > -1) {
                    // Item already in cart, update quantity
                    cart.items[existingItemIndex].quantity += newItem.quantity || 1;
                } else {
                    // New item, add it to the items array
                    cart.items.push({
                        itemId: newItem.itemId,
                        quantity: newItem.quantity || 1,
                    });
                }
            });
        } else {
            // No cart exists, create a new one
            cart = new Cart({
                userId,
                items: items.map((item) => ({
                    itemId: item.itemId,
                    quantity: item.quantity || 1,
                })),
            });
        }

        // Save the updated or new cart
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate("items.itemId");
        res.status(201).json(populatedCart); // Respond with the populated cart
    } catch (e) {
        console.error("Error saving cart:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
};



const findById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        res.status(200).json(cart);
    }
    catch (e) {
        res.json(e)
    }

}

const findByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id }).populate("items.itemId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }
        res.status(200).json([cart]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
const deleteById = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("data deleted");
    }
    catch (e) {
        res.json(e)
    }
}

const updateById = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(cart);
    }
    catch (e) {
        res.json(e)
    }
}

const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId).populate("items.itemId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};
module.exports = {
    findAll,
    save,
    findById,
    findByUserId,
    deleteById,
    updateById,
    getCartById

}