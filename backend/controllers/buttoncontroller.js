const Button = require('../models/buttonmodel');

// Create Button
exports.createButton = async (req, res) => {
  try {
    const newButton = new Button(req.body);
    await newButton.save();
    res.status(201).json(newButton);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Buttons
exports.getAllButtons = async (req, res) => {
  try {
    const buttons = await Button.find();
    res.status(200).json(buttons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Button by ID
exports.getButtonById = async (req, res) => {
  try {
    const button = await Button.findById(req.params.id);
    if (!button) return res.status(404).json({ message: 'Button not found' });
    res.status(200).json(button);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Button
exports.updateButton = async (req, res) => {
  try {
    const button = await Button.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!button) return res.status(404).json({ message: 'Button not found' });
    res.status(200).json(button);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Button
exports.deleteButton = async (req, res) => {
  try {
    await Button.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Button deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
