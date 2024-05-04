const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust path as necessary

async function createUser(username, password) {
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = new User({ username, password: hashedPassword });
    await user.save();

    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating the user:', error.message);
  }
}

async function authenticateUser(username, submittedPassword) {
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (user) {
        // Compare submitted password with stored hashed password
        const isMatch = await bcrypt.compare(submittedPassword, user.password);
        if (isMatch) {
          console.log('User authenticated successfully');
        } else {
          console.log('Authentication failed. Passwords do not match.');
        }
      } else {
        console.log('Authentication failed. User not found.');
      }
    } catch (error) {
      console.error('Error authenticating the user:', error.message);
    }
  }
  
