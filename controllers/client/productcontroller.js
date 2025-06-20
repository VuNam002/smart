// [get] /product
const Product = require("../../models/productmodel");

module.exports.index = async (req, res) => {
  //viết code để lấy data
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({position:"desc"})
  //Tạo ra mảng mới
  const newProducts = products.map((item) => {
    item.priceNew = (item.price * (100-item.discountPercentage)/100).toFixed(0);
    return item;
  })


  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// module.exports.create = (req, res) => {
//   res.render("client/pages/products/index");
// };

// module.exports.edit = (req, res) => {
//   res.render("client/pages/products/index");
// };

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
    };
    const product = await Product.findOne(find);

    console.log(product)

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect("/products");
  }
};