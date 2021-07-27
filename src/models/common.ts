/**
 * @name 公共model
 */
import { BasicDva } from 'src/components/basic-component/BasicDva';
import AppService from 'src/services/app';

const initState = {
  dictionaryMap: {} as any
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
    }
  }
}).render();

export default commonModel;
