const Account = require("../../models/account.model");
const systemConfig = require("../../config/sytem");
const Role = require("../../models/roles.model");
const md5 = require("md5");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

//[GET]/admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};
//[POST]/admin/accounts/cratePost
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    }

    req.body.password = md5(req.body.password);
    const records = new Account(req.body);
    await records.save();

    req.flash("success", "Tạo tài khoản thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    req.flash("error", "Đã xảy ra lỗi khi tạo tài khoản.");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false, //xét lại quyền
    });

    if (!data) {
      req.flash("error", "Không tìm thấy danh sách tài khoản!");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      data: data,
      roles: roles,
    });
  } catch (error) {
    console.error("Error in accounts:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: { $ne: id},
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
};

// GET/admin/account/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const account = await Account.findOne(find);
    if(!account) {
      req.flash("error", "Không tìm thấy danh mục!");
      return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản",
      account: account
    });
  }catch(error){
    console.error("Error in detail: ", error);
    req.flash("error", "Có lỗi xảy ra");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

//[DELETE] /admin/accounts/delete/:id xóa mềm
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne(
      { _id: id },
      {
        deleted: true,
        deleteAt: new Date()
      }
    );

    const backURL = req.header("Referer") || `${systemConfig.prefixAdmin}/accounts`;
    res.redirect(backURL);
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error);
    req.flash("error", "Đã xảy ra lỗi khi xóa tài khoản.");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Account.updateOne({_id:id}, {status: status});
  const backURL = req.header("Referer") || "/admin/accounts";
  res.redirect(backURL);
}