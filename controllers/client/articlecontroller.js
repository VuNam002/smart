const Article = require("../../models/articlemodel");
const Comment = require("../../models/comment.model");

// [GET] /articles/
const index = async (req, res) => {
  try {
    // Thực hiện các truy vấn song song để tăng hiệu suất
    const [articlesFeatured, articlesNew, articles] = await Promise.all([
      Article.find({
        featured: "1",
        deleted: false,
        status: "active",
      }).sort({ position: "desc" }).limit(3),
      Article.find({
        deleted: false,
        status: "active",
      }).sort({ createdAt: "desc" }).limit(3),
      Article.find({
        status: "active",
        deleted: false,
      }).sort({ position: "desc" })
    ]);

    res.render("client/pages/articles/index", {
      pageTitle: "Danh sách bài viết",
      articlesFeatured: articlesFeatured,
      articlesNew: articlesNew,
      articles: articles,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

// [GET] /articles/:slug
const detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const article = await Article.findOne({
      slug: slug,
      status: "active",
      deleted: false,
    }).populate("article_category_id");

    if (article) {
      // Lấy ra các bài viết liên quan cùng danh mục
      const relatedArticles = await Article.find({
        _id: { $ne: article.id },
        article_category_id: article.article_category_id,
        status: "active",
        deleted: false,
      })
        .sort({ position: "desc" })
        .limit(4);

      // Lấy ra danh sách bình luận
      const comments = await Comment.find({
        article_id: article.id,
        deleted: false,
      }).sort({ createdAt: "desc" });

      // Lấy ra bài viết nổi bật (for sidebar)
      const articlesFeatured = await Article.find({
        featured: "1",
        deleted: false,
        status: "active",
      }).sort({ position: "desc" }).limit(5);

      // Lấy ra bài viết mới nhất (for sidebar)
      const articlesNew = await Article.find({
        deleted: false,
        status: "active",
      }).sort({ createdAt: "desc" }).limit(5);

      res.render("client/pages/articles/detail", {
        pageTitle: article.title,
        article: article,
        relatedArticles: relatedArticles,
        comments: comments,
        articlesFeatured: articlesFeatured,
        articlesNew: articlesNew,
      });
    } else {
      res.redirect("/articles");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/articles");
  }
};

// [POST] /articles/:slug/comments
const createComment = async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await Article.findOne({ slug: slug });

    if (!article) {
      return res.redirect("/");
    }

    const comment = new Comment({
      article_id: article.id,
      fullName: req.body.fullName,
      email: req.body.email,
      content: req.body.content,
    });
    await comment.save();

    res.redirect(`/articles/${slug}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/articles/${req.params.slug}`);
  }
};

module.exports = {
  index,
  detail,
  createComment,
};