import React, { useState, useEffect } from 'react';
import { Icon, TreeSelect, Tooltip, Modal, message, Input } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import service from './service';
import styles from './index.less';
import EditModal from './EditModal';

interface Props extends TreeSelectProps<string | string[]> {
  canEdit?: boolean;
}

const { TreeNode } = TreeSelect;

const CategoryTreeSelect: React.FC<Props> = (props) => {
  const { canEdit = false, ...rest } = props;
  const [editItem, setEditItem] = useState();

  const [treeData, setTreeData] = useState([
    {
      value: 0,
      title: '全部',
      children: [
        {
          value: 1,
          title: '订单',
        },
        {
          value: 2,
          title: '用户',
          children: [
            {
              value: 3,
              title:
                '订单1订单1订单1订单1订单1订单1订单1订单1订单1订单1订单1订单1',
            },
            {
              value: 4,
              title: '用户2',
            },
          ],
        },
      ],
    },
  ]);

  const getTreeData = async () => {
    const {
      data: { data, success },
    } = await service.categoryList();
    if (success) {
      setTreeData(data);
    }
  };

  const deleteItem = (e, item) => {
    e.stopPropagation();
    Modal.confirm({
      title: '提示',
      content: '确定删除该分类？',
      onOk: async () => {
        const {
          data: { success },
        } = await service.categoryDelete({ id: item.id });
        if (success) {
          message.success('操作成功');
          getTreeData();
        }
      },
    });
  };

  const renderNode = (arr) => {
    return arr.map((item) => {
      const isRoot = item.value === 0;
      return (
        <TreeNode
          key={item.value}
          value={item.value}
          title={
            <div
              style={{
                display: 'inline-flex',
                verticalAlign: 'middle',
                alignItems: 'center',
              }}
            >
              <Icon type="folder" style={{ marginRight: 4 }} />
              <div style={{ flex: 1 }}>{item.title}</div>
              {canEdit && (
                <span className={styles.action} style={{ marginLeft: 8 }}>
                  {!isRoot && (
                    <Tooltip title="编辑">
                      <Icon
                        type="edit"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditItem(item);
                        }}
                        style={{ marginRight: 8 }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="添加子分类">
                    <Icon
                      type="plus-circle"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditItem({
                          parentId: item.value,
                        });
                      }}
                      style={{ marginRight: 8 }}
                    />
                  </Tooltip>
                  {!isRoot && (
                    <Tooltip title="删除">
                      <Icon
                        type="minus-circle"
                        onClick={(e) => deleteItem(e, item)}
                        style={{ marginRight: 8 }}
                      />
                    </Tooltip>
                  )}
                </span>
              )}
            </div>
          }
        >
          {Array.isArray(item.children) && renderNode(item.children)}
        </TreeNode>
      );
    });
  };

  useEffect(() => {
    getTreeData();
  }, []);

  return (
    <>
      <TreeSelect placeholder="请选择" {...rest}>
        {renderNode(treeData)}
      </TreeSelect>
      <EditModal
        editItem={editItem}
        okCallback={() => {
          getTreeData();
          setEditItem(null);
        }}
        cancelCallback={() => {
          setEditItem(null);
        }}
      />
    </>
  );
};

export default CategoryTreeSelect;
