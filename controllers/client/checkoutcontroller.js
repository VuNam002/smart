const Cart = require("../../models/cart.model");
const Product = require("../../models/productmodel");
const productHelper = require("../../helpers/product.helper");
const Order = require("../../models/order.model");

//[GET] /checkout/
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart || cart.products.length === 0) {
      return res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
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


    res.render("client/pages/checkout/index", {
      pageTitle: "Đặt hàng",
      cartDetail: cart,
    });
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại.");
    res.redirect("back");
  }
};

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const cartId = res.locals.cartId;
    console.log("Dữ liệu form nhận được:", req.body);

    const userInfo = req.body;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    if (!cart || cart.products.length === 0) {
      req.flash("error", "Giỏ hàng trống, không thể đặt hàng.");
      return res.redirect("/cart");
    }

    let products = [];
    for (const item of cart.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
        deleted: false,
        status: "active",
      });

      if (!productInfo) {
        req.flash("error", `Sản phẩm có ID ${item.product_id} không hợp lệ.`);
        return res.redirect("/cart");
      }

      if (productInfo.stock < item.quantity) {
        req.flash("error", `Sản phẩm "${productInfo.title}" không đủ số lượng.`);
        return res.redirect("/cart");
      }

      const objectProduct = {
        product_id: item.product_id,
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: item.quantity,
      };
      products.push(objectProduct);
    }

    const objectOrder = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
    };

    const order = new Order(objectOrder);
    await order.save();

    for (const item of products) {
      await Product.updateOne({ _id: item.product_id }, { $inc: { stock: -item.quantity } });
    }

    await Cart.updateOne({ _id: cartId }, { products: [] });

    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Đặt hàng không thành công, vui lòng thử lại!");
    res.redirect("back");
  }
}

//[GET]/checkout/success/:id 
module.exports.success = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
    }).lean();

    if (!order || !Array.isArray(order.products)) {
      req.flash("error", "Đơn hàng không tồn tại hoặc bị lỗi.");
      return res.redirect("/");
    }

    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail");

      product.productInfo = productInfo;

      product.priceNew = (product.price * (100 - product.discountPercentage)) / 100;
      product.totalPrice = product.priceNew * product.quantity;
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
      pageTitle: "Đặt hàng thành công",
      order: order
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}