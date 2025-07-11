const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 90;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });

    res.locals.cartId = cart.id;
  } else {
    // Nếu đã có cartId, gán vào res.locals
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    if (cart) {
      res.locals.cart = cart;
    }
    res.locals.cartId = req.cookies.cartId;
  }
  next();
};