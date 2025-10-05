const User = require("../models/User");
const jwt = require("jsonwebtoken");

// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Construct user object for frontend
      const userObj = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      // Optionally add fullName if you have firstName/lastName fields
      if (user.fullName) userObj.fullName = user.fullName;
      if (user.firstName && user.lastName && !user.fullName) userObj.fullName = `${user.firstName} ${user.lastName}`;

      res.json({
        success: true,
        data: {
          token: generateToken(user._id),
          user: userObj,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, login };
