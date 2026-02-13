const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, "Please provide te ID for your product"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide the price for your product"],
      trim: true,

    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ProductId must belong to a product"]
    },
    category: {
      type: String,
    },
    
  });

productSchema.index({ userId: 1});

const product = mongoose.model("productDetails", productSchema);

module.exports = product;
export {};

