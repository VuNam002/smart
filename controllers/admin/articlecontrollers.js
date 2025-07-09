const Article = require("../../models/articlemodel");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/sytem");
const Category = require("../../models/article-category.model");
const Account = require("../../models/account.model");

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

  const countArticles = await Article.countDocuments(find);
  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countArticles,
  );
  let sort = { position: -1 };
  if (req.query.sortKey && req.query.sortValue) {
    const value = req.query.sortValue === "asc" ? 1 : -1;
    sort = { [req.query.sortKey]: value };
  }

  const articles = await Article.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  for (const article of articles) {
    const user = await Account.findOne({
      _id: article.createdBy.account_id,
    });
    if (user) {
      article.accountfullName = user.fullName;
    }
  }

  res.render("admin/pages/articles/index", {
    pageTitle: "Trang bài viết",
    articles: articles,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[GET] /admin/article/create
module.exports.create = async (req, res) => {
  const records = await Category.find({});
  res.render("admin/pages/articles/create", {
    pageTitle: "Thêm mới bài viết",
    records,
  });
};

//[POST] /admin/article/create
module.exports.createPost = async (req, res) => {
  if (!req.body.title || req.body.title.trim().length < 2) {
    req.flash(
      "error",
      "Tiêu đề không được để trống và phải có ít nhất 2 ký tự!",
    );
    const backURL = req.header("Referer") || "/admin/articles";
    return res.redirect(backURL);
  }

  if (!req.body.position || req.body.position === "") {
    const countArticles = await Article.countDocuments();
    req.body.position = countArticles + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 1;
  }

  if (req.file && req.file.cloudinaryUrl) {
    req.body.thumbnail = req.file.cloudinaryUrl;
  }

  req.body.createdBy = {
    account_id: res.locals.user._id,
    createdAt: new Date(),
  };

  try {
    const article = new Article(req.body);
    await article.save();
    req.flash("success", "Thêm bài viết thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  } catch (err) {
    console.log("Error creating article:", err);
    req.flash("error", "Có lỗi xảy ra khi lưu bài viết!");
    const backURL = req.header("Referer") || "/admin/articles";
    res.redirect(backURL);
  }
};
//[PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Article.updateOne({ _id: id }, { status: status });
  const backURL = req.header("Referer") || "/admin/articles";
  res.redirect(backURL);
};
//[PATCH] /admin/articles/change-nulti/
module.exports.changeNulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  switch (type) {
    case "active":
      await Article.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Article.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete":
      await Article.updateMany({ _id: { $in: ids } }, { deleted: true });
      break;
    default:
      break;
  }
  const backURL = req.header("Referer") || "/admin/articles";
  res.redirect(backURL);
};

//[GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const article = await Article.findOne(find).populate(
      "article_category_id",
      "title",
    );

    if (!article) {
      req.flash("error", "Không tìm thấy bài viết!");
      return res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }

    // Lấy danh sách danh mục
    const records = await Category.find({
      deleted: false,
    });

    article.featured = article.featured ? "1" : "0";

    res.render("admin/pages/articles/edit", {
      pageTitle: "Chỉnh sửa bài viết",
      article: article,
      records: records,
    });
  } catch (err) {
    console.log("Error finding article:", err);
    req.flash("error", "Không tìm thấy bài viết!");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};
//[POST] /admin/articles/edit/:id - Xử lý cập nhật bài viết
module.exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body.title || req.body.title.trim().length < 2) {
      req.flash(
        "error",
        "Tiêu đề không được để trống và phải có ít nhất 2 ký tự!",
      );
      return res.redirect(`${systemConfig.prefixAdmin}/articles/edit/${id}`);
    }
    const updateData = {
      title: req.body.title.trim(),
      description: req.body.description || "",
      position: parseInt(req.body.position) || 1,
      status: req.body.status || "active",
    };
    if (req.file && req.file.cloudinaryUrl) {
      updateData.thumbnail = req.file.cloudinaryUrl;
    }
    const result = await Article.updateOne(
      { _id: id, deleted: false },
      { $set: updateData },
    );
    if (result.matchedCount === 0) {
      req.flash("error", "Không tìm thấy bài viết để cập nhật!");
      return res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  } catch (err) {
    console.log("Error updating article:", err);
    req.flash("error", "Có lỗi xảy ra khi cập nhật bài viết!");
    res.redirect(`${systemConfig.prefixAdmin}/articles/edit/${req.params.id}`);
  }
};
//[GET]/ admin/article/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const article = await Article.findOne(find);
    if (!article) {
      req.flash("error", "Không tìm thấy sản phẩm");
      return res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
    res.render("admin/pages/articles/detail", {
      pageTitle: "Chi tiết bài viết",
      article: article,
    });
  } catch (error) {
    console.log("Error finding article:", error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Article.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user._id,
        deletedAt: new Date(),
      },
    });
    const backURL = req.header("Referer") || "/admin/articles";
  res.redirect(backURL);
};
