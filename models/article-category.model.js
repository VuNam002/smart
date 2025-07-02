const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const articleCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
    },
    description: String,
    status: String, // quan tâm
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    }, // quan tâm đã xóa hay chưa
    thumbnail: String,
    deleteAt: Date, // thời gian xóa
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timeseries: true, // ✅ đặt đúng vị trí
  },
);

const ArticleCategory = mongoose.model(
  "ArticleCategory",
  articleCategorySchema,
  "article-category",
);

module.exports = ArticleCategory;
