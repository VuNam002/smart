const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.categoryMiddlewares = async (req, res, next) => {
    try {
        const productCategories = await ProductCategory.find({
            deleted: false,
            status: "active"
        })
        .select("title slug parent_id thumbnail description position")
        .sort({ position: 1 })
        .lean();
        const newProductCategory = createTreeHelper.tree(productCategories);
        res.locals.layoutProductsCategory = newProductCategory;
        console.log("Luôn chạy qua đây");
        next();
    } catch (error) {
        console.error("Error fetching product categories:", error);
        res.locals.layoutProductsCategory = [];
        next();
    }
};