const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/sytem");
const Account = require("../../models/account.model");


// Hàm tạo cây phân cấp chung
function createTree(arr, parentId = "") {
  const tree = [];
  arr.forEach((item) => {
    if (String(item.parent_id || "") === String(parentId)) {
      const newItem = { ...item };
      const children = createTree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

// Hàm xử lý position chung
async function handlePosition(reqBody) {
  if (reqBody.position === "" || reqBody.position === undefined) {
    const count = await ProductCategory.countDocuments();
    reqBody.position = count + 1;
  } else {
    reqBody.position = parseInt(reqBody.position);
  }
}

module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };
    const recods = await ProductCategory.find(find).lean(); // ✅ thêm .lean()

    for (const product of recods) {
      if (product.createdBy && product.createdBy.account_id) {
        const user = await Account.findOne({ _id: product.createdBy.account_id }).lean(); // không bắt buộc .lean() ở đây nhưng nên dùng
        if (user) {
          product.accountfullName = user.fullName;
        }
      }
    }

    res.render("admin/pages/product-category/index", {
      pageTitle: "Danh mục sản phẩm",
      recods: recods,
    });
  } catch (error) {
    console.error("Error in index:", error);
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};


// GET /admin/product-category/create
module.exports.create = async (req, res) => {
  try {
    const find = { deleted: false };
    const allRecords = await ProductCategory.find(find).lean();
    const records = createTree(allRecords);

    res.render("admin/pages/product-category/create", {
      pageTitle: "Tạo danh mục",
      records: records,
    });
  } catch (error) {
    console.error("Error in create:", error);
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// POST /admin/product-category/create - Giữ nguyên tên như routes
module.exports.updatePost = async (req, res) => {
  try {
    await handlePosition(req.body);
    req.body.createdBy = {
      account_id: res.locals.user._id,
      createdAt: new Date(),
    };


    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Tạo danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  } catch (error) {
    console.error("Error in updatePost:", error);
    req.flash("error", "Có lỗi xảy ra khi tạo danh mục!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category/create`);
  }
};

// GET /admin/product-category/edit/:id
// Tìm tất cả con cháu theo parent_id
function findAllChildrenIds(records, parentId) {
  let ids = [];
  for (const item of records) {
    if (String(item.parent_id) === String(parentId)) {
      ids.push(item._id);
      ids = ids.concat(findAllChildrenIds(records, item._id));
    }
  }
  return ids;
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    }).lean(); 

    if (!data) {
      req.flash("error", "Không tìm thấy danh mục!");
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    const allRecords = await ProductCategory.find({ deleted: false }).lean();
    const childrenIds = findAllChildrenIds(allRecords, id);
    const idsToExclude = [id, ...childrenIds].map(x => String(x));
    const currentParentId = String(data.parent_id || "");

    const filteredRecords = allRecords.filter(item => {
      const itemId = String(item._id);
      return !idsToExclude.includes(itemId) || itemId === currentParentId;
    });

    const records = createTree(filteredRecords);

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data,
      records,
    });
  } catch (error) {
    console.error("Error in edit:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// DELETE /admin/product-category/delete/:id 
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Kiểm tra xem danh muc có tồn tại không
    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    if (!category) {
      req.flash("error", "Không tìm thấy danh mục cần xóa!");
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    // Kiểm tra xem danh mục có danh mục con không
    const hasChildren = await ProductCategory.countDocuments({
      parent_id: id,
      deleted: false
    });

    if (hasChildren > 0) {
      req.flash("error", "Không thể xóa danh mục này vì còn danh mục con!");
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    // Thực hiện xóa (có thể là soft delete hoặc hard delete)
    await ProductCategory.deleteOne({ _id: id });
    
    req.flash("success", "Xóa danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    
  } catch (error) {
    console.error("Error in deleteItem:", error);
    req.flash("error", "Có lỗi xảy ra khi xóa danh mục!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// PATCH /admin/product-category/editPatch/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await handlePosition(req.body);
    
    await ProductCategory.updateOne({_id: id}, req.body);
    
    req.flash("success", "Cập nhật danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  } catch (error) {
    console.error("Error in editPatch:", error);
    req.flash("error", "Có lỗi xảy ra khi cập nhật!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// GET /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await ProductCategory.findOne(find);

    if (!product) {
      req.flash("error", "Không tìm thấy danh mục!");
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    res.render("admin/pages/product-category/detail", {
      pageTitle: "Chi tiết danh mục sản phẩm",
      product: product
    });
  } catch (error) {
    console.error("Error in detail:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

//  [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });

  const backURL = req.header("Referer") || "/admin/product-category";
  res.redirect(backURL);
};