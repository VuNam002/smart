// Đây là file chính
const { categoryMiddlewares } = require("../../middlewares/client/category.middlewares");
const homeRoutes = require("./homeroute")
const productRouter = require("./productroute");

module.exports = (app) => {
    app.use(categoryMiddlewares)
    app.use("/",homeRoutes);

    app.use("/products",productRouter);
}