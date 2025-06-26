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

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = ProductCategory;
