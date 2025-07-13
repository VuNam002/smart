// Đây là file chính
const sytemConfig = require("../../config/sytem");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");
const dashboardRoutes = require("./dashboardRoutes");
const productRoutes = require("./productroutes");
const productCategoryRoutes = require("./product-category");
const roleRoutes = require("./roleRoute");
const accountRoutes = require("./accountRoute");
const authRoutes = require("./authRoute");
const articleCategoryRoutes = require("./article-categoryRoute");
const articleRoutes = require("./articleRoute");
const myAccountRoutes = require("./my-account");


module.exports = (app) => {
  const PATH_ADMIN = sytemConfig.prefixAdmin;
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes,
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
  app.use(PATH_ADMIN + "/product-category",authMiddleware.requireAuth, productCategoryRoutes);
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth,roleRoutes);
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth,accountRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes);// chứa các route đăng nhập đăng xuất nên ko cần app
  app.use(PATH_ADMIN + "/article-category",authMiddleware.requireAuth,articleCategoryRoutes);
  app.use(PATH_ADMIN + "/articles", authMiddleware.requireAuth,articleRoutes);
  app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth,myAccountRoutes);
};
