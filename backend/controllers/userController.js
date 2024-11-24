const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch user by uniqueId
router.get('/uniqueid/:uniqueId', async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.params.uniqueId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
