//[GET]/search/
const productHelper = require("../../helpers/product.helper");
const Product = require("../../models/productmodel");

let newProducts = [];

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    if(keyword) {
        const keywordRegex = new RegExp(keyword, "i");

        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        newProducts = productHelper.calcNewPrice(products);
    }
    res.render("client/pages/search/index", {
        pageTitle: "Tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
};
