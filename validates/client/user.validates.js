module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Họ tên không được để trống!`);
    res.redirect("/user/register");
    return;
  }

  if (!req.body.email) {
    req.flash("error", `email không được để trống!`);
    res.redirect("/user/register");
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Mật khẩu không được để trống!`);
    res.redirect("/user/register");
    return;
  }
  next();
};
module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Email không được để trống!`);
    res.redirect("/user/password/forgot");
    return
  }
  next();
}

module.exports.resetPassWordPost = (req, res, next) => {
  if(!req.body.password) {
    res.flash("error", "Mật khẩu không được để trống!");
    res.redirect("/user/password/reset");
    return
  }
  next()
  if(!req.body.confirmPassword) {
    req.flash("error","Vui lòng nhập lại mật khẩu!");
    res.redirect("/user/password/reset")
    return
  }
  if(!req.body.password === req.body.confirmPassword) {
    req.flash("error", "Mật khẩu không khớp!");
    res.redirect("/user/password/reset");
    return
  }
}

