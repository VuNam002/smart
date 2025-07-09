const Product = require("../../models/productmodel");
const productHelper = require("../../helpers/product.helper");

module.exports.index = async (req, res) => {
  //Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);//Lấy ra số lượng sản phẩm tối đa
  const newProductsFeatured = productHelper.calcNewPrice(productsFeatured);

  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = productHelper.calcNewPrice(products);
  
  //Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ createdAt: "desc" }).limit(6);
  const newProductsNew = productHelper.calcNewPrice(productsNew);


  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    products: newProducts,
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
