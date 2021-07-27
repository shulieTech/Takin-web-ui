import React, { Fragment } from 'react';
import { Popconfirm } from 'antd';
import { PopconfirmProps } from 'antd/lib/popconfirm';
interface Props extends PopconfirmProps {
  cancleColor?: string;
  okColor?: string;
}
const CustomPopconfirm: React.FC<Props> = props => {
  return (
    <Popconfirm
      cancelButtonProps={{
        type: 'link',
        style: {
          color: props.cancleColor ? props.cancleColor : 'var(--Netural-06)'
        }
      }}
      okButtonProps={{
        type: 'link',
        style: {
          color: props.okColor ? props.okColor : 'var(--BrandPrimary-500)'
        }
      }}
      {...props}
    >
      {props.children}
    </Popconfirm>
  );
};
export default CustomPopconfirm;
