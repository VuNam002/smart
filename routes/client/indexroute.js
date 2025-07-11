// Đây là file chính
const { categoryMiddlewares } = require("../../middlewares/client/category.middlewares");
const { articleCategoryMiddlewares } = require("../../middlewares/client/article-category.middleware");
const homeRoutes = require("./homeroute")
const productRouter = require("./productroute");
const articleRouter = require("./articleroute");
const searchRouter = require("./searchroute");


module.exports = (app) => {
    app.use(categoryMiddlewares)
    app.use(articleCategoryMiddlewares)
    app.use("/",homeRoutes);

    app.use("/products",productRouter);

    app.use("/articles", articleRouter);
    app.use("/search",searchRouter);
}