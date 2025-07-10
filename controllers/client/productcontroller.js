const Product = require("../../models/productmodel");
const Comment = require("../../models/comment.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");
const categoryHelper = require("../../helpers/category.helper");
const paginationHelper = require("../../helpers/pagination");

const index = async (req, res) => {
  const find = {
    status: "active",
    deleted: false,
  };
  // Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = {
    currentPage: 1,
    limitItems: 16,
  };
  paginationHelper(objectPagination, req.query, countProducts);
  // End Pagination

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  const newProducts = productHelper.calcNewPrice(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
    pagination: objectPagination,
  });
};

const detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
    };
    const product = await Product.findOne(find).populate("product_category_id");

    if (product) {
      const comments = await Comment.find({
        product_id: product.id,
        deleted: false,
      }).sort({ createdAt: "desc" });

      const newProduct = productHelper.calcNewPrice([product])[0];
      res.render("client/pages/products/detail", {
        pageTitle: newProduct.title,
        product: newProduct,
        comments: comments,
      });
    } else {
      res.redirect("/products");
    }
  } catch (error) {
    res.redirect("/products");
  }
};

const createComment = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (!product) {
      return res.redirect("/products");
    }
    const comment = new Comment({
      product_id: product.id,
      fullName: req.body.fullName,
      email: req.body.email,
      content: req.body.content,
    });
    await comment.save();
    res.redirect(`/products/${slug}`);
  } catch (error) {
    res.redirect(`/products/${req.params.slug}`);
  }
};

//[GET]/products/:slugCategory
const category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active",
    });
    if (category) {
      const listSubCategory = await categoryHelper.getSubCategory(category.id);
      const listSubCategoryId = listSubCategory.map(item => item.id);
      const allCategoryIds = [category.id, ...listSubCategoryId];
      const find = {
        product_category_id: { $in: allCategoryIds },
        deleted: false,
        status: "active",
      };

      // Pagination
      const countProducts = await Product.countDocuments(find);
      let objectPagination = {
        currentPage: 1,
        limitItems: 16,
      };
      paginationHelper(objectPagination, req.query, countProducts);
      // End Pagination

      const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
      const newProducts = productHelper.calcNewPrice(products);
      res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
        pagination: objectPagination,
      });
    } else {
      res.redirect("/products");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/products");
  }
};

module.exports = {
  index,
  detail,
  createComment,
  category,
};