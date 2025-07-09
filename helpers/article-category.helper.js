const ArticleCategory = require("../models/article-category.model");

const getSubCategory = async (parentId) => {
  const subs = await ArticleCategory.find({
    parent_id: parentId,
    status: "active",
    deleted: false,
  });

let allSub = [...subs];
for(const sub of subs) {
  const childs = await getSubCategory(sub.id);
  allSub = allSub.concat(childs)
}

return allSub;
}

module.exports.getSubCategory = getSubCategory;