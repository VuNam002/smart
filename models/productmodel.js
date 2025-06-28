const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory", // tên model danh mục của bạn
      required: true,
    },

    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    status: String, //quan tâm
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: String,
        default: Date.now, //lấy ra thời gian hiện t
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    }, //quan tâm đã xóa hay chưa
    thumbnail: String,
    deleteAt: Date, //thời gian xóa
    deletedBy: {
      account_id: String,
      deletedAt: Date
    }
  },
  {
    timeseries: true,
  },
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
