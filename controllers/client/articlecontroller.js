const Article = require("../../models/articlemodel");
const Comment = require("../../models/comment.model");
const ArticleCategory = require("../../models/article-category.model");
const articleHelper = require("../../helpers/article.helper");
const articleCategoryHelper = require("../../helpers/article-category.helper");
const paginationHelper = require("../../helpers/pagination");

// [GET] /articles/
const index = async (req, res) => {
  try {
    const find = {
      status: "active",
      deleted: false,
    };

    // Pagination
    const countArticles = await Article.countDocuments(find);
    let objectPagination = {
      currentPage: 1,
      limitItems: 10,
    };
    paginationHelper(objectPagination, req.query, countArticles);
    // End Pagination

    // Thực hiện các truy vấn song song để tăng hiệu suất
    const [articlesFeatured, articlesNew, articles] = await Promise.all([
      articleHelper.getFeaturedArticles(3),
      articleHelper.getNewArticles(3),
      Article.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip),
    ]);

    res.render("client/pages/articles/index", {
      pageTitle: "Danh sách bài viết",
      articlesFeatured: articlesFeatured,
      articlesNew: articlesNew,
      articles: articles,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/articles");
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
      const [
        relatedArticles,
        comments,
        articlesFeatured,
        articlesNew
      ] = await Promise.all([
        // Lấy ra các bài viết liên quan cùng danh mục
        Article.find({
          _id: { $ne: article.id },
          article_category_id: article.article_category_id,
          status: "active",
          deleted: false,
        }).sort({ position: "desc" }).limit(4),
        // Lấy ra danh sách bình luận
        Comment.find({
          article_id: article.id,
          deleted: false,
        }).sort({ createdAt: "desc" }),
        // Lấy ra bài viết nổi bật và mới nhất cho sidebar
        articleHelper.getFeaturedArticles(5),
        articleHelper.getNewArticles(5)
      ]);

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
    const article = await Article.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });

    if (!article) {
      // Không tìm thấy bài viết hoặc bài viết không hoạt động
      return res.redirect("/articles");
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
//[GET]/article/:slugCategory
const category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;
    const category = await ArticleCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active",
    });
    if (category) {
      const listSubCategory = await articleCategoryHelper.getSubCategory(category.id);
      const listSubCategoryId = listSubCategory.map(item => item.id);
      const allCategoryIds = [category.id, ...listSubCategoryId];

      const find = {
        article_category_id: { $in: allCategoryIds },
        deleted: false,
        status: "active",
      };

      // Pagination
      const countArticles = await Article.countDocuments(find);
      let objectPagination = {
        currentPage: 1,
        limitItems: 10,
      };
      paginationHelper(objectPagination, req.query, countArticles);
      // End Pagination

      // Chỉ lấy các bài viết thuộc danh mục
      const articles = await Article.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

      res.render("client/pages/articles/index", {
        pageTitle: category.title,
        articles,
        pagination: objectPagination,
      });
    } else {
      res.redirect("/articles");
    }
  } catch (error) {
    console.log("Lỗi ở category:", error);
    res.redirect("/articles");
  }
};


module.exports = {
  index,
  detail,
  createComment,
  category
};