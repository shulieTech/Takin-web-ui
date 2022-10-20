/**
 * @name 公共model
 */
import { BasicDva } from 'src/components/basic-component/BasicDva';
import AppService from 'src/services/app';
import BusinessService from 'src/pages/businessActivity/service';

const initState = {
  dictionaryMap: {} as any,
  domains: [], // 业务域列表
  envList: [], // 环境列表
};
export type CommonModelState = Partial<typeof initState>;

const commonModel = new BasicDva<CommonModelState>({
  namespace: 'common',
  state: initState,
  effects: {
    *getDictionaries({ payload }, { call, put, select }) {
      const {
        data: { data, success }
      } = yield call(AppService.getDictionaries);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            dictionaryMap: data
          }
        });
      }
    },
    *getDomains({ payload }, { call, put, select }) {
      const {
        data: { data, success }
      } = yield call(BusinessService.domainList);
      if (success && data) {
        yield put({
          type: 'updateState',
          payload: {
            // 注意这里value用的是domainCode而不是id
            domains: (data || []).map((x) => ({ label: x.name, value: +x.domainCode })),
          }
        });
      }
    },
    *setEnvList({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          envList: payload
        }
      });
    },
  }
}).render();

export default commonModel;
