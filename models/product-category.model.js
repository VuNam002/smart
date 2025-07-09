const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: "",
  },
  description: String,
  status: String, // quan tâm
  featured:String,
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deleted: {
    type: Boolean,
    default: false
  }, 
  thumbnail: String,
  deleteAt: Date, 
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
}, {
  timestamps: true 
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = ProductCategory;