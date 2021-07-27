/**
 * @name dva基础方法类原型
 */
import { Component } from 'react';
import { Basic } from 'src/types';

export default abstract class DvaComponent<
  T = Basic.BaseProps,
  Y = any
> extends Component<T & Basic.BaseProps, Y> {
  /** @name 声明model namespace */
  abstract namespace?: string;
  /**
   * @name 更新基础类型state
   * @param payload 更新数据源
   */
  updateState(payload: any) {
    this.props.dispatch({
      payload,
      type: `${this.namespace}/updateState`
    });
  }
  /**
   * @name 更新其他引用类型state
   * @param methodName  方法名
   * @param payload 更新数据源
   */
  async handleDispatch(methodName: string, payload: any = {}) {
    await this.props.dispatch({
      payload,
      type: `${this.namespace}/${methodName}`
    });
  }
  /**
   * @name 重置state
   */
  resetState() {
    this.props.dispatch({
      type: `${this.namespace}/resetState`
    });
  }
}
