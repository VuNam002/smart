const Product = require("../../models/productmodel");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/sytem");
const Category = require("../../models/product-category.model");
const Account = require("../../models/account.model");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelpers(req.query);

  let find = { deleted: false };

  // ✅ DEBUG: Log query parameters
  console.log("Query params:", req.query);
  console.log("product_category_id from query:", req.query.product_category_id);

  if (req.query.product_category_id) {
    // ✅ FIXED: Đảm bảo convert đúng ObjectId
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(req.query.product_category_id)) {
      find.product_category_id = req.query.product_category_id; // Không cần new mongoose.Types.ObjectId
      console.log("Category ID filter:", find.product_category_id);
    } else {
      console.log("Invalid ObjectId format:", req.query.product_category_id);
      // Không filter nếu ObjectId không hợp lệ
    }
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // ✅ DEBUG: Log find object
  console.log("Find object:", find);

  // Pagination
  const countProducts = await Product.countDocuments(find);
  console.log("Count products found:", countProducts);

  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts,
  );

  // Sort
  let sort = { position: -1 };

  if (req.query.sortKey && req.query.sortValue) {
    const value = req.query.sortValue === "asc" ? 1 : -1;
    sort = { [req.query.sortKey]: value };
  }

  // ✅ FIXED: Populate để lấy thông tin category
  const products = await Product.find(find)
    .populate("product_category_id", "title") // Populate category info
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  console.log("Products found:", products.length);
  if (products.length > 0) {
    console.log("Sample product:", {
      title: products[0].title,
      category_id: products[0].product_category_id,
      category_title: products[0].product_category_id?.title,
    });
  }

  // ✅ FIXED: Xử lý createdBy an toàn
  for (const product of products) {
    if (product.createdBy && product.createdBy.account_id) {
      const user = await Account.findOne({
        _id: product.createdBy.account_id,
      });
      if (user) {
        product.accountfullName = user.fullName;
      }
    }
  }

  // ✅ FIXED: Lấy danh sách categories để hiển thị trong filter
  const categories = await Category.find({ deleted: false });

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    categories: categories, // Thêm categories để hiển thị trong filter
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  const backURL = req.header("Referer") || "/admin/products";
  res.redirect(backURL);
};

// [PATCH] /admin/products/change-nulti/
module.exports.changeNulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: true });
      break;
    default:
      break;
  }

  const backURL = req.header("Referer") || "/admin/products";
  res.redirect(backURL);
};

// [DELETE] /admin/products/delete/:id đây là xóa mềm
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user._id,
        deletedAt: new Date(),
      },
    },
  );

  const backURL = req.header("Referer") || "/admin/products";
  res.redirect(backURL);
};

// [PATCH] /admin/products/change-position
module.exports.changePosition = async (req, res) => {
  try {
    const positions = req.body.positions;
    if (!positions) {
      const backURL = req.header("Referer") || "/admin/products";
      return res.redirect(backURL);
    }

    const updates = Object.entries(positions).map(([id, position]) => {
      return Product.updateOne({ _id: id }, { position: Number(position) });
    });
    await Promise.all(updates);

    req.flash("success", "Cập nhật vị trí thành công!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  } catch (err) {
    req.flash("error", "Có lỗi xảy ra khi cập nhật vị trí!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  }
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const records = await Category.find({});
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    records,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  // Kiểm tra tiêu đề không được để trống và phải 2 ký tự
  if (!req.body.title || req.body.title.trim().length < 2) {
    req.flash("error", "Tiêu đề không được để trống ");
    const backURL = req.header("Referer") || "/admin/products";
    return res.redirect(backURL);
  }

  // ✅ FIXED: Vì product_category_id là required, phải có giá trị
  if (!req.body.product_category_id || req.body.product_category_id === "") {
    req.flash("error", "Vui lòng chọn danh mục sản phẩm!");
    const backURL = req.header("Referer") || "/admin/products";
    return res.redirect(backURL);
  }

  // ✅ FIXED: Không cần convert to ObjectId, MongoDB sẽ tự động convert
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(req.body.product_category_id)) {
    req.flash("error", "Danh mục không hợp lệ!");
    const backURL = req.header("Referer") || "/admin/products";
    return res.redirect(backURL);
  }

  req.body.price = parseInt(req.body.price) || 0;
  req.body.discountPercentage = parseInt(req.body.discountPercentage) || 0;
  req.body.stock = parseInt(req.body.stock) || 0;

  // Nếu không nhập vị trí thì tự động tăng
  if (!req.body.position || req.body.position === "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 1;
  }

  // Nếu có file upload thì lấy đường dẫn file từ Cloudinary
  if (req.file && req.file.cloudinaryUrl) {
    req.body.thumbnail = req.file.cloudinaryUrl;
  }

  req.body.createdBy = {
    account_id: res.locals.user._id,
    createdAt: new Date(),
  };

  try {
    const product = new Product(req.body);
    await product.save();

    console.log("Saved product category_id:", product.product_category_id);

    req.flash("success", "Thêm sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    console.log("Error creating product:", err);
    req.flash("error", "Có lỗi xảy ra khi lưu sản phẩm!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  }
};

//[GET] /admin/products/edit/:id - Hiển thị form edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find)
      .populate("product_category_id")
      .lean();

    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm!");
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    if (
      product.product_category_id &&
      typeof product.product_category_id === "object"
    ) {
      product.product_category_id = product.product_category_id._id.toString();
    }

    product.featured = product.featured ? "1" : "0";
    const records = await Category.find({ deleted: false }).lean();
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product,
      records,
    });
  } catch (err) {
    console.log("Error finding product:", err);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find).populate("product_category_id");

    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm!");
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    console.log("Error finding product:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [POST] /admin/products/edit/:id - Xử lý cập nhật sản phẩm
module.exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate lại dữ liệu
    if (!req.body.title || req.body.title.trim().length < 2) {
      req.flash(
        "error",
        "Tiêu đề không được để trống và phải có ít nhất 2 ký tự!",
      );
      return res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
    }

    // ✅ FIXED: Validate category
    if (!req.body.product_category_id || req.body.product_category_id === "") {
      req.flash("error", "Vui lòng chọn danh mục sản phẩm!");
      return res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
    }

    // Chuyển đổi kiểu dữ liệu
    const updateData = {
      title: req.body.title.trim(),
      description: req.body.description || "",
      price: parseInt(req.body.price) || 0,
      discountPercentage: parseInt(req.body.discountPercentage) || 0,
      stock: parseInt(req.body.stock) || 0,
      position: parseInt(req.body.position) || 1,
      status: req.body.status || "active",
      featured: req.body.featured || "0", // ✅ THÊM DÒNG NÀY
      product_category_id: req.body.product_category_id,
    };

    // ✅ FIXED: Validate ObjectId
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(req.body.product_category_id)) {
      req.flash("error", "Danh mục không hợp lệ!");
      return res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
    }

    // Nếu có file upload mới thì cập nhật thumbnail
    if (req.file && req.file.cloudinaryUrl) {
      updateData.thumbnail = req.file.cloudinaryUrl;
    }

    // Cập nhật sản phẩm
    const result = await Product.updateOne(
      { _id: id, deleted: false },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      req.flash("error", "Không tìm thấy sản phẩm để cập nhật!");
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    console.log("Error updating product:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products/edit/${req.params.id}`);
  }
};
