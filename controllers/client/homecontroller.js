const Product = require("../../models/productmodel");
const ProductCategory = require("../../models/product-category.model");
const Article = require("../../models/articlemodel");
const productHelper = require("../../helpers/product.helper");
const categoryHelper = require("../../helpers/category.helper");

module.exports.index = async (req, res) => {
  //Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(8); //Lấy ra số lượng sản phẩm tối đa
  const newProductsFeatured = productHelper.calcNewPrice(productsFeatured);

  //Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ createdAt: "desc" }).limit(8);
  const newProductsNew = productHelper.calcNewPrice(productsNew);

  // Lấy ra danh sách sản phẩm theo danh mục
  const categories = await ProductCategory.find({
    deleted: false,
    status: "active",
    parent_id: "",
  });

  for (const category of categories) {
    const listSubCategory = await categoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const allCategoryIds = [category.id, ...listSubCategoryId];

    const productsInCategory = await Product.find({
      product_category_id: { $in: allCategoryIds },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" }).limit(8);

    category.products = productHelper.calcNewPrice(productsInCategory);
  }

  // Lấy ra bài viết nổi bật
  const articlesFeatured = await Article.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(6);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
    categories: categories,
    articlesFeatured: articlesFeatured,
  });
};
