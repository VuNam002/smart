const ArticleCategory = require("../../models/article-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.articleCategoryMiddlewares = async (req, res, next) => {
    try {
        const articleCategories = await ArticleCategory.find({
            deleted: false,
            status: "active"
        })
        .select("title slug parent_id thumbnail description position")
        .sort({ position: 1 })
        .lean();

        const newArticleCategory = createTreeHelper.tree(articleCategories);
        res.locals.layoutBlogCategories = newArticleCategory;
        next();
    } catch (error) {
        console.error("Error fetching article categories:", error);
        res.locals.layoutBlogCategories = [];
        next();
    }
};