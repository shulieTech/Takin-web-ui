/**
 * @name 菜单项
 */
export interface MenuBean {
  model?: string;
  title: string;
  icon?: string;
  path?: string;
  key?: string;
  type?: MenuType;
  authority?: any;
  hideInMenu?: boolean;
  children?: MenuBean[];
}
/**
 * @name 菜单类型
 */
export enum MenuType {
  SubMenu = 'SubMenu',
  ItemGroup = 'ItemGroup',
  Item = 'Item',
  Url = 'url',
  NoMenu = 'NoMenu'
}
