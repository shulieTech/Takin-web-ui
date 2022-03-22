import React from 'react';
import { Tree, Tooltip } from 'antd';

interface Props {
  defaultSelectedKey?: string;
  tabList: any[];
  onChange?: (key, e) => void;
  checkNodeDisabled?: (node) => boolean;
}

const BusinessActivityTree: React.FC<Props> = (props) => {
  const { tabList, defaultSelectedKey = props.tabList?.[0]?.xpathMd5, onChange } = props;
  const renderTreeNodes = (data) => {
    return (
      data &&
      data.map((item) => {
        if (item.children && item.children.length) {
          return (
            <Tree.TreeNode
              title={
                <Tooltip title={item.testName} placement="right">
                  <span>{item.testName}</span>
                </Tooltip>}
              key={item.xpathMd5}
              dataRef={item}
              treeDefaultExpandAll={true}
              style={{ color: '#fff', width: 100 }}
              disabled={props.checkNodeDisabled && props.checkNodeDisabled(item)}
            >
              {renderTreeNodes(item.children)}
            </Tree.TreeNode>
          );
        }
        return (
          <Tree.TreeNode
            style={{ color: '#fff' }}
            key={item.xpathMd5}
            dataRef={item}
            title={
              <Tooltip title={item.testName} placement="right">
                <span>{item.testName}</span>
              </Tooltip>}
            children={item.children}
          />
        );
      })
    );
  };

  return (
    <>
      {tabList && tabList.length > 0 && (
        <Tree
          onSelect={(keys, e) => onChange(keys[0], e)}
          defaultExpandAll
          defaultSelectedKeys={[defaultSelectedKey]}
        >
          {renderTreeNodes(tabList)}
        </Tree>
      )}
    </>
  );
};
export default BusinessActivityTree;
