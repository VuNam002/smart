// helpers/createTree.js
module.exports.tree = (arr, parentId = "") => {
  const tree = [];
  
  for (const item of arr) {
    if (item.parent_id == parentId) {
      const newItem = {
        id: item._id,
        title: item.title,
        slug: item.slug,
        thumbnail: item.thumbnail,
        status: item.status,
        position: item.position,
        description: item.description,
        parent_id: item.parent_id,
        children: []
      };
      const children = module.exports.tree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      
      tree.push(newItem);
    }
  }
  
  tree.sort((a, b) => {
    if (a.position && b.position) {
      return a.position - b.position;
    }
    return 0;
  });
  
  return tree;
};

module.exports.treeOptimized = (arr, parentId = "") => {
  const itemMap = new Map();
  const tree = [];
  arr.forEach(item => {
    itemMap.set(item._id.toString(), {
      id: item._id,
      title: item.title,
      slug: item.slug,
      thumbnail: item.thumbnail,
      status: item.status,
      position: item.position,
      description: item.description,
      parent_id: item.parent_id,
      children: []
    });
  });
  
  itemMap.forEach(item => {
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id.toString());
      if (parent) {
        parent.children.push(item);
      }
    } else {
      tree.push(item);
    }
  });
  
  function sortByPosition(items) {
    items.sort((a, b) => {
      if (a.position && b.position) {
        return a.position - b.position;
      }
      return 0;
    });
    
    // Sắp xếp children
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByPosition(item.children);
      }
    });
  }
  
  sortByPosition(tree);
  
  return tree;
};