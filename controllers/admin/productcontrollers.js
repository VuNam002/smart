const Product = require("../../models/productmodel");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/sytem");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelpers(req.query);

  let find = { deleted: false };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  // Lấy sản phẩm theo trang
  const products = await Product.find(find)
    .sort({position:"desc"})
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
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
      await Product.updateMany({_id: { $in: ids}}, {status: "active"});  
      break;
    case "inactive":
      await Product.updateMany({_id: { $in: ids}}, {status: "inactive"});
      break;
    case "delete":
      await Product.updateMany({_id: { $in: ids}}, {deleted: true});
      break;
    default:
      break;
  }

  const backURL = req.header("Referer") || "/admin/products";
  res.redirect(backURL);
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({_id: id}, {
    deleted: true,
    deleteAt: new Date()
  });

  const backURL = req.header("Referer") || "/admin/products";
  res.redirect(backURL);
};

// [PATCH] /admin/products/change-position
module.exports.changePosition = async (req, res) => {
  try {
    const positions = req.body.positions; // {id1: pos1, id2: pos2, ...}
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
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  // Kiểm tra tiêu đề không được để trống và phải >= 8 ký tự
  if (!req.body.title || req.body.title.trim().length < 8) {
    req.flash("error", "Tiêu đề không được để trống và phải có ít nhất 8 ký tự!");
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

  // Nếu có file upload thì lấy đường dẫn file
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    req.flash("error", "Có lỗi xảy ra khi lưu sản phẩm!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  }
};


//[POST] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (err) {
    req.flash("error", "Không tìm thấy sản phẩm!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm sản phẩm",
      product: product
    });
  }catch(error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [POST] /admin/products/edit/:id
module.exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    // Validate lại dữ liệu
    if (!req.body.title || req.body.title.trim().length < 2) {
      req.flash("error", "Tiêu đề không được để trống và phải có ít nhất 8 ký tự!");
      const backURL = req.header("Referer") || "/admin/products";
      return res.redirect(backURL);
    }

    // Chuyển đổi kiểu dữ liệu
    req.body.price = parseInt(req.body.price) || 0;
    req.body.discountPercentage = parseInt(req.body.discountPercentage) || 0;
    req.body.stock = parseInt(req.body.stock) || 0;
    req.body.position = parseInt(req.body.position) || 1;

    // Nếu có file upload mới thì cập nhật thumbnail
    if (req.file && req.file.cloudinaryUrl) {
      req.body.thumbnail = req.file.cloudinaryUrl;
    }

    // Cập nhật sản phẩm
    await Product.updateOne(
      { _id: id },
      { $set: req.body }
    );

    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm!");
    const backURL = req.header("Referer") || "/admin/products";
    res.redirect(backURL);
  }
};
