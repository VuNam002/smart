const systemConfig = require("../../config/sytem");
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: req.cookies.token }).select("-password");
    if (!user) {
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role = await Role.findById(user.role_id).select("title permissions");

      res.locals.user = {
        ...user.toObject(),
        role: role.toObject()  // ✅ Gộp vào user
      };

      next();
    }
  }
};
