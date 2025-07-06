const ArticleCategory = require("../../models/article-category.model");
const systemConfig = require("../../config/sytem");
const Account = require("../../models/account.model");

// Hàm tạo cây phân cấp
function createTree(arr, parentId = "") {
  const tree = [];
  arr.forEach((item) => {
    if (String(item.parent_id || "") === String(parentId)) {
      const newItem = { ...item._doc || item }; // lấy dữ liệu gốc trong Mongoose document
      const children = createTree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

// Hàm xử lý vị trí
async function handlePosition(reqBody) {
  if (reqBody.position === "" || reqBody.position === undefined) {
    const count = await ArticleCategory.countDocuments();
    reqBody.position = count + 1;
  } else {
    reqBody.position = parseInt(reqBody.position);
  }
}

// [GET] /admin/article-category/index
module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };
    const recods = await ArticleCategory.find(find).lean();
    for (const article of recods) {
      if (article.createdBy && article.createdBy.account_id) {
        const user = await Account.findOne({
          _id: article.createdBy.account_id,
        }).lean();
        if (user) {
          article.accountfullName = user.fullName;
        }
      }
    }
    res.render("admin/pages/article-category/index", {
      pageTitle: "Danh mục bài viết",
      recods: recods,
    });
  } catch (error) {
    console.error("Error in index:", error);
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
}

// [GET] /admin/article-category/create
module.exports.create = async (req, res) => {
  try {
    const find = {deleted: false};
    const allRecords = await ArticleCategory.find(find).lean();
    const records = createTree(allRecords);
    res.render("admin/pages/article-category/create", {
      pageTitle: "Tạo danh mục bài viết",
      records: records,
    });
  } catch (error) {
    console.error("Error in create:", error);
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
}

//[POST] admin/article-category/create
module.exports.updatePost = async (req, res) => {
  try {
    await handlePosition(req.body);
    
    // Xử lý trường parent_id rỗng
    if (req.body.parent_id === "" || req.body.parent_id === undefined) {
      delete req.body.parent_id;
    }
    
    req.body.createBy = {
      account_id: res.locals.user._id,
      createAt: new Date(),
    }

    const record = new ArticleCategory(req.body);
    await record.save();
    req.flash("success", "Tạo danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  } catch (error) {
    console.error("Error in updatePost:", error);
    req.flash("error", "Có lỗi xảy ra khi tạo danh mục!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category/create`);
  }
};

//[PATCH] /admin/article-categoryRoute/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await ArticleCategory.updateOne({ _id: id }, { status: status });
  const backURL = req.header("Referer") || "/admin/article-category";
  res.redirect(backURL);
}

//[GET] /admin/article-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const article = await ArticleCategory.findOne(find);
    if (!article) {
      req.flash("error", "Không tìm thấy danh mục!");
      return res.redirect(`${systemConfig.prefixAdmin}/article-category`);
    }
    res.render("admin/pages/article-category/detail", {
      pageTitle: "Chi tiết danh mục bài viết",
      article: article,
    });
  } catch (error) {
    console.error("Error in detail:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
};

//[DELETE] /admin/article/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    //kiểm tra danh mục bài viết có tồn tại hay không
    const category = await ArticleCategory.findOne({
      _id: id,
      deleted: false,
    });
    if (!category) {
      req.flash("error", "Không tìm thấy danh mục bài viết cần xóa!");
      return res.redirect(`${systemConfig.prefixAdmin}/article-category`);
    }
    //kiểm tra danh mục bài viết có danh mục con hay không
    const hasChildren = await ArticleCategory.countDocuments({
      parent_id: id,
      deleted: false,
    });
    if (hasChildren > 0) {
      req.flash(
        "error",
        "Không thể xóa danh mục bài viết này vì còn danh mục con!"
      );
      return res.redirect(`${systemConfig.prefixAdmin}/article-category`);
    }
    //thực hiện xóa
    await ArticleCategory.deleteOne({ _id: id }); 
    req.flash("success", "Xóa danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  } catch (error) {
    console.error("Error in deleteItem:", error);
    req.flash("error", "Có lỗi xảy ra khi xóa danh mục!");  
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
};

//[GET] admin/article-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ArticleCategory.findOne({
      _id: id,
      deleted: false,
    });
    if(!data) {
      req.flash("error", "Không tìm thấy danh mục!");
      return res.redirect(`${systemConfig.prefixAdmin}/article-category`);
    }
    const allRecords = await ArticleCategory.find({
      deleted: false,
      _id: { $ne: id },
    }).lean();
    const records = createTree(allRecords);
    res.render("admin/pages/article-category/edit", {
      pageTitle: "Chỉnh sửa danh mục bài viết",
      data,
      records,
    });
  } catch (error) {
    console.error("Error in edit: ", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
}

//[PATCH] admin/article/editPatch/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await handlePosition(req.body);
    
    // Xử lý trường parent_id rỗng
    if (req.body.parent_id === "" || req.body.parent_id === undefined) {
      delete req.body.parent_id;
    }
    
    await ArticleCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật danh mục thành công!");  
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  } catch (error) {
    console.error("Error in editPatch:", error);
    req.flash("error", "Có lỗi xảy ra khi cập nhật!");
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
}