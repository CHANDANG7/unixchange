const Request = require('../models/Request');
const User = require('../models/User');

// Fetch requests with populated receiver information
const fetchRequests = async (req, res) => {
  try {
    const { senderId } = req.query;

    // Fetch requests with the populated receiver's name
    const requests = await Request.find({ senderId })
      .populate('receiverId', 'name') // This will populate only the 'name' field of the receiver
      .exec();

    // Return the populated requests
    res.status(200).json({ requests });
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

module.exports = { fetchRequests };
