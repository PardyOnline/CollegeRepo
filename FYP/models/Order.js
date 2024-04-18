const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  location: String,
  status: String,
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
