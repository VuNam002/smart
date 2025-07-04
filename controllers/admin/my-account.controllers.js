const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân",
  });
};
//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin",
  });
};

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });
    if(emailExist) {
        req.flash("error", "Email đã tồn tại");
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        await Account.findByIdAndUpdate({_id:id}, req.body);
        req.flash("success", "Cập nhật thông tin thành công");
    }
    res.redirect("back")
}