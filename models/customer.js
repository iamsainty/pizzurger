const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    default: "customer",
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

module.exports = Customer;
