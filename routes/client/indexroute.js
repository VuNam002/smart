// Đây là file chính
const homeRoutes = require("./homeroute")
const productRouter = require("./productroute");

module.exports = (app) => {
    app.use("/", homeRoutes);

    app.use("/products", productRouter);
}