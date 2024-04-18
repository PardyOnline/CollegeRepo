const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB - Replace with your URI
mongoose.connect('mongodb://localhost:27017/FYPDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const createUser = async (email, plainPassword, role) => {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create the user
    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Example usage: replace with the actual details
createUser('manager@pse.com', 'Manager2024', 'manager');