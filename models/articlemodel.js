const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { create } = require("./productmodel");
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    title: String,
    article_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleCategory",
      required: true,
    },
    description: String,
    content: String,
    status: String,
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
    },
    thumbnail: String,
    deleteAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timeseries: true,
  },
);

const Article = mongoose.model("Article", articleSchema, "articles");

module.exports = Article;

