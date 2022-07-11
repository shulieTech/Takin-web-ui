import { TempleteType } from './types';
import React from 'react';
import { Input } from 'antd';
import NodeTypeThree from './NodeTypeThree';
import NodeTypeFour from './NodeTypeFour';
import NodeTypeFive from './NodeTypeFive';

/**
 * @name 动态表单渲染枚举工具
 */

export const getRenderFormNode = (node: TempleteType): React.ReactNode => {
  const nodeType: number = node.nodeType;
  let renderNode: React.ReactNode = null;
  switch (nodeType) {
    /**
     * @name 输入框
     */
    case 1:
      renderNode = <Input placeholder="请输入"/>;
      break;
    /**
     * @name 输入框（密码）
     */
    case 2:
      renderNode = <Input type="password" placeholder="请输入" autoComplete="new-password"/>;
      break;
    /**
     * @name 下拉框、数值输入框
     */
    case 6:
      renderNode = (
        <NodeTypeThree
          keys={node.nodeInfo.keys}
          dataSource={node.nodeInfo.dataSource}
        />
      );
      break;
    /**
     * @name 下拉框、Input输入框
     */
    case 3:
      renderNode = (
        <NodeTypeFour
          keys={node.nodeInfo.keys}
          dataSource={node.nodeInfo.dataSource}
        />
      );
      break;
    /**
     * @name 下拉框、Input密码框
     */
    case 7:
      renderNode = (
        <NodeTypeFour
          keys={node.nodeInfo.keys}
          dataSource={node.nodeInfo.dataSource}
          inputProps={{ type: 'password' }}
        />
      );
      break;
    /**
     * @name 列表（table）
     */
    case 4:
      renderNode = (
        <NodeTypeFive
          list={node.list}
          //   keys={node.nodeInfo.keys}
          //   dataSource={node.nodeInfo.dataSource}
        />
      );
      break;
    /**
     * @name 文本输入框
     */
    case 5:
      renderNode = <Input.TextArea autoSize placeholder="请输入"/>;
      break;
    default:
      break;
  }
  return renderNode;
};
