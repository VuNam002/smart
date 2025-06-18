const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  status: String,//quan tâm
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },//quan tâm đã xóa hay chưa
  thumbnail:String,
  deleteAt: Date //thời gian xóa
},{
  timeseries: true
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
