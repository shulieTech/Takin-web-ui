/**
 * 树结构平铺
 * @param nodes
 * @param parentId
 * @returns
 */
const result = [];
export const flatTree = (nodes, parentId = '-1', idName = 'id') => {
  if (Array.isArray(nodes) && nodes.length > 0) {
    nodes.forEach((node) => {
      const { children, ...rest } = node;
      result.push({
        parentId,
        ...rest,
      });
      flatTree(node.children, node[idName], idName);
    });
    return result;
  }
};

/**
 * 平铺结构转成树结构，（未验证）
 * @param list
 * @returns
 */
export const buildTree = (list) => {
  const map = {};
  list.forEach((item) => {
    if (!map[item.id]) {
      map[item.id] = item;
    }
  });

  list.forEach((item) => {
    if (item.parent_id !== 0) {
      map[item.parent_id].children
        ? map[item.parent_id].children.push(item)
        : (map[item.parent_id].children = [item]);
    }
  });

  return list.filter((item) => {
    if (item.parent_id === 0) {
      return item;
    }
  });
};
