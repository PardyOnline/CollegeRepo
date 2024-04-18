const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  StockCode: String,
  Description: String,
  Quantity: Number,
  UnitPrice: Number,
  Country: String,
}, { collection: 'Inventory'});

const Item = mongoose.model('Inventory', itemSchema);

module.exports = Item;

