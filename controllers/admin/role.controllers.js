const { json } = require("body-parser");
const systemConfig = require("../../config/sytem");
const Role = require("../../models/roles.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  try {
    const records = await Role.find({ deleted: false });

    res.render("admin/pages/roles/index", {
      pageTitle: "Trang nhóm quyền",
      records: records,
    });
  } catch (error) {
    console.error("Error in index:", error);
    req.flash("error", "Đã xảy ra lỗi khi tải danh sách nhóm quyền!");
    res.redirect(`${systemConfig.prefixAdmin}`);
  }
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();
    req.flash("success", "Tạo nhóm quyền thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error("Error in createPost:", error);
    req.flash("error", "Đã xảy ra lỗi khi tạo nhóm quyền!");
    res.redirect(`${systemConfig.prefixAdmin}/roles/create`);
  }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const role = await Role.findOne(find);  // đổi từ product thành role

    if (!role) {
      req.flash("error", "Không tìm thấy nhóm quyền!");
      return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

    // QUAN TRỌNG: Sửa từ "create" thành "detail"
    res.render("admin/pages/roles/detail", {  
      pageTitle: "Chi tiết nhóm quyền",
      role: role  // truyền biến role thay vì product
    });
  } catch (error) {
    console.error("Error in detail:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
     const find = {
      deleted: false,
      _id: req.params.id
    }
    const data = await Role.findOne(find);
     
    if (!data) {
      req.flash("error", "Không tìm thấy nhóm quyền!");
      return res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
     
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      data,
    });
  } catch (error) {
    console.error("Error in edit:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/update/:id
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    // Chỉ lấy những trường được phép cập nhật
    const updateData = {
      title: req.body.title,
      description: req.body.description,
    };

    await Role.updateOne({ _id: id }, updateData);

    req.flash("success", "Cập nhật nhóm quyền thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error("Error in update:", error);
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
//[DELETE] admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Role.deleteOne({_id: id});
  const backURL = req.header("Referer" || "/admin/roles");
  res.redirect(backURL);
}
//[GET] admin/roles/permissions
module.exports.permission = async (req, res) => {
  try {
    let find = {
      deleted: false
    }
    const records = await Role.find(find);
    
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Chi tiết phân quyền",
      records: records,
    });
  } catch (error) {
    console.error("Error in permission:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
//[PATCH] admin/roles/permissions
module.exports.permissionPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    
    for (const item of permissions) {
      await Role.updateOne(
        { _id: item.id }, 
        { permissions: item.permissions }
      );
    }
    
    req.flash("success", "Cập nhật phân quyền thành công!");
    res.redirect("/admin/roles/permissions"); 
  } catch (error) {
    console.error("Error in permissionPatch:", error);
    req.flash("error", "Cập nhật phân quyền thất bại!");
    res.redirect("/admin/roles/permissions");
  }
};
