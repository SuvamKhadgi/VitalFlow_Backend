// // const { Router } = require('express ');
const Item = require('../model/items')

const findAll = async (req, res) => {
    try {
        const item = await Item.find();
        res.status(200).json(item);
    }
    catch (e) {
        res.json(e)
    }
}

const save = async (req, res) => {
    try {
        const { item_name, description, item_price, item_quantity, item_type,sub_item_type } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        const item = new Item({
            item_name,
            item_price,
            item_quantity,
            item_type,
            description,
            sub_item_type,
            image: req.file.originalname
        });

        // const item = new item(req.body);
        await item.save();
        res.status(201).json(item)// created
    }
    catch (e) {
        console.error("Error saving item:", e);
        res.status(500).json({ error: "Internal Server Error", details: e.message });
    }
}

const findById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.status(200).json(item);
    }
    catch (e) {
        res.json(e)
    }

}
const deleteById = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        res.status(200).json("data deleted");
    }
    catch (e) {
        res.json(e)
    }
}

const updateById = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(item);
    }
    catch (e) {
        res.json(e)
    }
}

const searchItems = async (req, res) => {
    try {
      const { query } = req.query;
      const items = await Item.find({
        $or: [
          { item_name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
          { description: { $regex: query, $options: 'i' } }, // Case-insensitive search by description
          { item_type: { $regex: query, $options: 'i' } }, // Case-insensitive search by type
          { sub_item_type: { $regex: query, $options: 'i' } }, // Case-insensitive search by sub-type
        ],
      });
      res.status(200).json(items);
    } catch (e) {
      res.status(500).json({ error: "Error searching items", details: e.message });
    }
  };
module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    updateById,
    searchItems
}