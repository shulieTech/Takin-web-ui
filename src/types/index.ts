import { AxiosResponse } from 'axios';
import { Location } from 'history';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export namespace Basic {
  export interface BaseResponse<T = any> extends AxiosResponse<DataProps> {
    /** 接口列表总条数 */
    total?: number;
    /** 请求头 */
    headers: {
      'X-Total-Count'?: number;
      'x-total-count'?: number;
      totalCount?: number;
      [propName: string]: any;
    };
  }
  interface DataProps {
    data?: any;
    error?: { code: string; msg: string };
    status: number;
    success: boolean;
  }
  export interface BaseProps<T = any> {
    /** dispatch */
    dispatch?: (action: Action) => void;
    /** antd Rc Form实例 */
    form?: WrappedFormUtils<T>;
    /** location路由 */
    location?: Location & { query: any };
    /** 其他拓展Props */
    // [propsName: string]: any;
  }
  export interface BaseModel<T> {
    /** 模块名  */
    namespace: string;
    /** 状态  */
    state: T;
    reducers?: Reducers<T>;
    effects?: Effects;
    subscriptions?: Object;
  }
  interface EffectsCommandMap {
    put: (action: Action) => any;
    call: Function;
    select: Function;
    take: Function;
    cancel: Function;
    [key: string]: any;
  }
  export interface Effects {
    [propName: string]: (action: Action, effects: EffectsCommandMap) => void;
  }
  export interface ReducersFun<State> {
    (state: State, params?: Action): State;
  }
  export interface Reducers<State> {
    [propName: string]: ReducersFun<State>;
  }
  interface Action<T = any> {
    type?: string;
    payload?: T;
    [propName: string]: any;
  }
}
