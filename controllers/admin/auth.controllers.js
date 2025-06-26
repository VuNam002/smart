const Account = require("../../models/account.model");
const systemConfig = require("../../config/sytem");
const md5 = require("md5");
//[GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
};
//[POST] /admin/auth/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //Kiểm tra email có tồn tại hay không
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }

  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không chính xác");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};
//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token"); // xóa cookie tên "token"
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
