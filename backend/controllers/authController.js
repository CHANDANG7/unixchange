const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login Route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user details
    const { uniqueId, name, country, balance } = user;
    res.status(200).json({ uniqueId, name, email, country, balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Register Route
const register = async (req, res) => {
  const { name, email, password, country, currency } = req.body;

  // Log the incoming request to check if all fields are sent correctly
  console.log("Registration Request Data:", req.body);

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists with this email:", email); // Debugging existing user
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID based on the user's country
    const uniqueId = generateUniqueId(country);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      uniqueId,
      country,
      currency // Ensure currency is included
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message and the unique ID
    console.log("User successfully registered:", newUser);
    res.status(201).json({ message: 'User registered successfully', uniqueId });
  } catch (err) {
    // Log the error for debugging
    console.error("Error during registration:", err);

    // Send detailed error response to frontend
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Generate Unique ID for the user (country abbreviation + random string)
const generateUniqueId = (country) => {
  return country.slice(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = { login, register };
