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
    description: String,
    status: String, // quan tâm
    position: Number,
    featured: String,
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
    timestamps: true,
  },
);

const ArticleCategory = mongoose.model(
  "ArticleCategory",
  articleCategorySchema,
  "article-category",
);

module.exports = ArticleCategory;
