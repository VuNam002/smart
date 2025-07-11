const Cart = require("../../models/cart.model");
const Product = require("../../models/productmodel");
module.exports.addPost = async (req, res) => {
  try {
    const cartId = res.locals.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    const product = await Product.findOne({
      _id: productId,
      deleted: false,
      status: "active",
    });
    if (!product) {
      req.flash("error", "Sản phẩm không tồn tại!");
      return res.redirect("back");
    }
    const cart = await Cart.findById(cartId);
    const existProductInCart = cart.products.find(
      (item) => String(item.product_id) === productId
    );

    if (existProductInCart) {
      existProductInCart.quantity += quantity;
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };
      cart.products.push(objectCart);
    }
    await cart.save();
    req.flash("success", "Đã thêm vào giỏ hàng");
    res.redirect(`/products/${product.slug}`);
  } catch (error) {
    console.log("Lỗi khi thêm vào giỏ hàng:", error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại.");
    res.redirect("back");
  }
};