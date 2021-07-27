/**
 * @name 全局应用model
 */
import menuData from 'src/common/menu';
import { BasicDva } from 'src/components/basic-component/BasicDva';
import { filterBreadCrumbs } from 'src/components/page-layout/utils';

const initState = {
  /**
   * @name 菜单收缩
   */
  collapsed: false,
  /**
   * @name 面包屑
   */
  breadCrumbs: [],
  /** @name 链路梳理去调试工具id */
  debugToolId: undefined
};
export type AppModelState = Partial<typeof initState>;

const appModel = new BasicDva<AppModelState>({
  namespace: 'app',
  state: initState,
  effects: {
    /**
     * @name 获取当前面包屑
     */
    *filterBreadCrumbs({ payload }, { call, put }) {
      const breadCrumbs = [];
      filterBreadCrumbs(menuData, payload, breadCrumbs);
      yield put({
        type: 'updateState',
        payload: {
          breadCrumbs
        }
      });
    }
  }
}).render();

export default appModel;
