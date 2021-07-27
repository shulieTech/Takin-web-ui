import { MenuBean } from 'src/common/menu/type';

/**
 * @name 获取面包屑
 * @param { menuData: 菜单数据源, pathname: 当前路由, breadCrumbs: 面包屑 }
 */
export const filterBreadCrumbs = (
  menuData: MenuBean[],
  pathname: string,
  breadCrumbs: any[]
): MenuBean => {
  return menuData.find(item => {
    breadCrumbs.push(item);
    if (item.path === pathname) {
      return true;
    }
    if (item.children) {
      const isFind = filterBreadCrumbs(item.children, pathname, breadCrumbs);
      if (isFind) {
        return true;
      }
    }
    breadCrumbs.pop();
    return false;
  });
};
