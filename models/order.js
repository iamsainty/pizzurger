const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  orderDescription: {
    type: String,
  },
  item: {
    type: String,
    enum: ["veg-pizza", "non-veg-pizza", "burger"],
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  toppings: {
    type: [String],
    default: [],
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "delivered", "canceled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
