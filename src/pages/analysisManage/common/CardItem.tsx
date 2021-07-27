/**
 * @name
 * @author MingShined
 */
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import React from 'react';
interface Props extends CardProps {}
const CardItem: React.FC<Props> = props => {
  return <Card {...props}>{props.children}</Card>;
};
export default CardItem;
