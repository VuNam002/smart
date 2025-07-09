const Product = require("../../models/productmodel");
const Comment = require("../../models/comment.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");
const categoryHelper = require("../../helpers/category.helper");

const index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({position:"desc"})
  const newProducts = productHelper.calcNewPrice(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
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

const rate = async (req, res) => {
  const { slug } = req.params;
  const { star } = req.body;
  if (!star || star < 1 || star > 5) {
    return res.redirect(`/products/${slug}`);
  }
  try {
    const product = await Product.findOne({ slug: slug, deleted: false });
    if (!product) {
      return res.redirect("/products");
    }
    product.ratings.push({ star: parseInt(star, 10) });
    const totalStars = product.ratings.reduce((sum, item) => sum + item.star, 0);
    product.rating = (totalStars / product.ratings.length).toFixed(1);

    await product.save();
    res.redirect(`/products/${slug}`);
  } catch (error) {
    console.error("Error processing rating:", error);
    res.redirect(`/products/${slug}`);
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
      const products = await Product.find({
        product_category_id: { $in: allCategoryIds },
        deleted: false,
        status: "active",
      }).sort({ position: "desc" });
      const newProducts = productHelper.calcNewPrice(products);
      res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
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
  rate,
  category,
};