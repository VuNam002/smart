// Đây là file chính
const sytemConfig = require("../../config/sytem");
const dashboardRoutes = require("./dashboardRoutes")
const productRoutes = require("./productroutes");

module.exports = (app) => {
    const PATH_ADMIN = sytemConfig.prefixAdmin;
    app.use(PATH_ADMIN+"/dashboard",dashboardRoutes);
    app.use(PATH_ADMIN+"/products",productRoutes);
}