import { Basic } from 'src/types';

export class BasicDva<T> {
  state: T;
  initState: T;
  namespace: string;
  reducers?: Basic.Reducers<T>;
  effects?: Basic.Effects;
  resetState: Basic.ReducersFun<T>;
  constructor(ModelType: Basic.BaseModel<T>) {
    this.initState = ModelType.state;
    this.state = ModelType.state;
    this.namespace = ModelType.namespace;
    /**
     * @name 重置state
     */
    this.resetState = () => {
      return this.state;
    };
    this.reducers = {
      ...ModelType.reducers,
      updateState: this.updateState,
      resetState: this.resetState
    };
    this.effects = ModelType.effects;
  }
  /**
   * @name 更新state
   */
  updateState(state: T, { payload }) {
    return { ...state, ...payload };
  }
  render(): Basic.BaseModel<T> {
    return {
      namespace: this.namespace,
      state: this.state,
      reducers: this.reducers,
      effects: this.effects
    };
  }
}