const Cart = require("../../models/cart.model");
const Product = require("../../models/productmodel");
const productHelper = require("../../helpers/product.helper");

//POST /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const cartId = res.locals.cartId; //lấy từ middlewares
    const productId = req.params.productId;//Express lưu các tham số từ URL.
    const quantity = parseInt(req.body.quantity) || 1;//form với ban đầu là 1
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

//GET /cart/index
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart || cart.products.length === 0) {
      return res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: { products: [], totalPrice: 0 },
      });
    }

    for (const item of cart.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      });

      if (productInfo) {
        productInfo.priceNew = productHelper.calcNewPrice([productInfo])[0].priceNew;
        item.productInfo = productInfo;
        item.totalPrice = item.quantity * item.productInfo.priceNew;
      }
    }

    cart.products = cart.products.filter(item => item.productInfo);
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);


    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: cart,
    });
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại.");
    res.redirect("back");
  }
};

//GET /cart/delete/:productId
module.exports.delete = async (req, res) => {

    const cartId = res.locals.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
      _id: cartId,
    }, {
      "$pull": {
        products: {
          product_id: productId,
        },
      },
    });
    res.redirect("/cart");
}
//[GET] /cart/update/:productId
module.exports.update = async (req, res) => {
  const cartId = res.locals.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);

  if(isNaN(quantity) || quantity < 1) {
    req.flash("error", "Số lượng không hợp lệ.");
    res.redirect("back");
    return;
  }

  await Cart.updateOne({
    _id: cartId,
    "products.product_id": productId
  }, {
    $set: {
      "products.$.quantity": quantity
    },
  });
  req.flash("success", "Đã cập nhật số lượng");
  res.redirect("/cart");
}