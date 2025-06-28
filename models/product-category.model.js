const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { create } = require("./productmodel");
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
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now //lấy ra thời gian hiện t
    }
  },
  deleted: {
    type: Boolean,
    default: false
  },//quan tâm đã xóa hay chưa
  thumbnail:String,
  deleteAt: Date, //thời gian xóa
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
},{
  timeseries: true
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = ProductCategory;
