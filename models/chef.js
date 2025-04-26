const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
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
    default: "chef",
  },
  speciality: {
    type: String,
    enum: ["veg-pizza", "non-veg-pizza", "burger"],
    required: true,
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

const Chef = mongoose.models.Chef || mongoose.model("Chef", chefSchema);

module.exports = Chef;
