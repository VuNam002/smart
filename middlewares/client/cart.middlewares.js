const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    let cart;
    if (req.cookies.cartId) {
      cart = await Cart.findById(req.cookies.cartId);
    }
    if (!cart) {
      cart = new Cart();
      await cart.save();
      const expiresTime = 1000 * 60 * 60 * 24 * 90; 
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresTime),
      });
    }
    res.locals.cartId = cart.id;
    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    res.locals.miniCart = {
      totalQuantity: totalQuantity,
    };
  } catch (error) {
    console.error("Lỗi trong cart middleware:", error);
    res.locals.miniCart = { totalQuantity: 0 };
  }
  next();
};

