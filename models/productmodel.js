const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      required: false,
    },
    ratings: [
      { star: Number },
    ],
    stock: Number,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    featured: {
      type: String, 
      enum: ["0", "1"],
      default: "0",
    },
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    thumbnail: String,
    deleteAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true, 
  },
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
