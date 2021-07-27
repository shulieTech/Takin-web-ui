/**
 * @name 基础类原型
 */
import { Component } from 'react';
import { Basic } from 'src/types';

export default abstract class BasicComponent<
  T = Basic.BaseProps,
  Y = any
> extends Component<T & Basic.BaseProps, Y> {}
