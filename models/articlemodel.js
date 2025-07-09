const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    title: String,
    article_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleCategory",
    },
    description: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    featured: {
      type: String,
      enum: ["0", "1"],
      default: "0",
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
    },
    deletedAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model(
  "Article",
  articleSchema,
  "articles"
);

module.exports = Article;