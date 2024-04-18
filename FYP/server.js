const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const app = express();
const session = require('express-session');
const brain = require('brain.js');
const fs = require('fs');
const csv = require('csv-parser');

app.use(session({
  secret: 'T2Bs49Fs0K7uDRkUOSG9s4+XWpxm3NHKM46v0a22CHU=',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? false : true } 
}));


mongoose.connect('mongodb://localhost:27017/FYPDatabase')

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import models, machine learning and middleware
const { requireAuth, requireRole } = require('./middleware/auth');
const Item = require('./models/Item');
const User = require('./models/User');
const Order = require('./models/Order');
const predict = require('./Machine Learning').predict;

// Home route with dashboard data -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/', requireAuth, async (req, res) => {
  try {
    // Fetch the first 1000 items from the database
    const items = await Item.find({}).limit(1000).exec();

    // Fetch orders
    const orders = await Order.find({}).exec();
    
    // Filter for low stock items from the fetched result set
    const lowStockItems = items.filter(item => item.Quantity < 3);

    // Render the index page with the totalItems, lowStockItems, and orders
    res.render('index', { totalItems: 1000, lowStockItems, orders, userRole: req.session.role });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).send('Error fetching dashboard data');
  }
});


// Items route to display inventory items -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/items', requireAuth, async (req, res) => {
  try {
      // Fetch only the fields necessary
      // Inside the /items route in server.js
      const items = await Item.find({}, {
        StockCode: 1,
        Description: 1,
        Quantity: 1,
        UnitPrice: 1,
        Country: 1
      }).limit(1000).exec();

      // Pass the fetched items to the EJS template
      //console.log(items[0]); View first item to check its populated and view structure for debugging
    res.render('items', { items, userRole: req.session.role });
  } catch (error) {
    console.error('Failed to fetch items:', error);
    res.status(500).send('Error fetching items');
  }
});


// Sign in route                          -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/signin', (req, res) => {
  res.render('signin');
});

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // If the user is not found, redirect back to the sign-in page or show an error
      return res.status(401).send('Invalid login credentials.');
    }

    // Compare the hashed password stored in the database with the one provided by the user
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If the password does not match, redirect back to the sign-in page or show an error
      return res.status(401).send('Invalid login credentials.');
    }

    // If the user is found and the password matches, proceed with creating a session
    req.session.userId = user._id;
    req.session.role = user.role;

    // Redirect the user to the homepage
    res.redirect('/');
  } catch (error) {
    console.error('SignIn Error:', error);
    res.status(500).send('An error occurred during the sign-in process.');
  }
});

// Orders route ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({}); // Fetch all orders
    res.render('orders', { orders: orders, userRole: req.session.role });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send('Error fetching orders');
  }
});

app.post('/orders', (req, res) => {
  const { item, quantity, location, status } = req.body;
  // Add logic to insert the order into the database
  const newOrder = new Order({ item, quantity, location, status });
  newOrder.save()
    .then(() => {
      // Send a response after successfully saving the order
      res.json({ message: 'Order added successfully!', data: req.body });
    })
    .catch(error => {
      // Handle any errors that occur during save
      console.error('Error saving the new order:', error);
      res.status(500).json({ message: 'Error adding order' });
    });
});

app.delete('/orders/:orderId', requireAuth, async (req, res) => {
  try {
      const { orderId } = req.params;
      await Order.findByIdAndDelete(orderId);
      res.json({ message: 'Order successfully deleted' });
  } catch (error) {
      console.error('Failed to delete order:', error);
      res.status(500).send('Error deleting order');
  }
});

// Add orders from homepage on low stock card 
app.post('/orders', (req, res) => {
  const { item, quantity, location, status } = req.body;
  const newOrder = new Order({ item, quantity, location, status });
  newOrder.save()
      .then(() => res.json({ message: 'Order added successfully!', data: newOrder }))
      .catch(error => {
          console.error('Error saving the new order:', error);
          res.status(500).json({ message: 'Error adding order' });
      });
});

// Confirm orders on the orders page using the confirm button
app.post('/orders/confirm-delivery/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { itemName, orderQuantity } = req.body;

  try {
    // Find the item in the database
    const item = await Item.findOne({ Description: itemName });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Update the item's quantity
    item.Quantity += parseInt(orderQuantity, 10);
    await item.save();

    // Remove the order
    await Order.findByIdAndDelete(orderId);

    // Send a success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error confirming delivery:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Suppliers Route --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/suppliers', (req, res) => {
  // Sample list of suppliers (can be replaced with data from the database)
  const suppliers = [
      { name: 'Sheehan Suppliers', location: 'France' },
      { name: 'Desmond Delivery', location: 'Australia' },
      { name: 'OConnell Transporters', location: 'United Kingdom' },
      // Add more suppliers as needed
  ];

  // Render the suppliers page and pass the suppliers data to the template
  res.render('suppliers', { suppliers });
});

// Predictions Route --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Load the trained neural network
const rawData = fs.readFileSync('trainedModel.json', 'utf8');
const trainedNet = new brain.NeuralNetwork().fromJSON(JSON.parse(rawData));

// Normalize function
const maxSales = 1.0;

const historical_data = 'Online Retail Historical Cleaned.csv'; 

function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    let items = [];
    let count = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (count < 1000) {
          items.push(data);
          count++;
        }
      })
      .on('end', () => {
        resolve(items);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Ensure this endpoint initializes predictionResult
app.get('/predictions', requireAuth, async (req, res) => {
  try {
    const items = await parseCsvFile(historical_data);
    res.render('predictions', {
      items: items,
      predictionResult: null, // Ensure a default value is passed
      selectedDescription: ''
    });
  } catch (error) {
    console.error('Error loading prediction page:', error);
    res.status(500).send('Failed to load prediction data.');
  }
});

app.post('/predictions', requireAuth, async (req, res) => {
  const { itemDescription, week1, week2, week3 } = req.body;
  const input = [parseFloat(week1), parseFloat(week2), parseFloat(week3)];
  let predictionResult = ''; // Default as empty string

  try {
    const raw_pred = predict([parseFloat(week1), parseFloat(week2), parseFloat(week3)]);
    const pred = raw_pred * 100;
    predictionResult = pred.toFixed(2); // Use the predict function from machine learning.js
  } catch (error) {
    console.error('Error during prediction:', error);
    predictionResult = "Prediction failed: " + error.message;
  }

  try {
    const items = await parseCsvFile(historical_data);
    res.render('predictions', {
      items: items,
      predictionResult: predictionResult,
      selectedDescription: itemDescription || ''
    });
  } catch (error) {
    console.error('Error fetching items for predictions:', error);
    res.status(500).send('Error displaying predictions page');
  }
});


// Start the server --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.connection.once('open', () => {
    console.log("Connected to database:", mongoose.connection.name);
  });
});

