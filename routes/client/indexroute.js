const cartMiddlewares = require("../../middlewares/client/cart.middlewares");
const flashMiddleware = require("../../middlewares/client/flash.middlewares");
const { categoryMiddlewares } = require("../../middlewares/client/category.middlewares");
const { articleCategoryMiddlewares } = require("../../middlewares/client/article-category.middleware");
const homeRoutes = require("./homeroute")
const productRouter = require("./productroute");
const articleRouter = require("./articleroute");
const searchRouter = require("./searchroute");
const cartRouter = require("./cartroute");
const checkoutRouter = require("./checkoutroute");
const userRouter = require("./userroute");
const userMiddleware = require("../../middlewares/client/user.middleware")




module.exports = (app) => {
    app.use(cartMiddlewares.cartId);
    app.use(flashMiddleware.flash);
    app.use(userMiddleware.infoUser)

    app.use(categoryMiddlewares)
    app.use(articleCategoryMiddlewares)
    app.use("/",homeRoutes);
    app.use("/products",productRouter);
    app.use("/cart",cartRouter);
    app.use("/checkout",checkoutRouter);

    app.use("/articles", articleRouter);
    app.use("/search",searchRouter);
    app.use("/user",userRouter);
    
}