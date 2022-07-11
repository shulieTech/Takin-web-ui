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
  const [open, setOpen] = useState(false);

  const [treeData, setTreeData] = useState([
    {
      id: 0,
      title: '全部',
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
      content: '确定删除该文件夹？',
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
      const isRoot = item.id === 0;
      return (
        <TreeNode
          key={item.id}
          value={item.id}
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
                          e.stopPropagation();
                          setEditItem(item);
                        }}
                        style={{ marginRight: 8 }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="添加子文件夹">
                    <Icon
                      type="plus-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditItem({
                          parentId: item.id,
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

  const dismissListener = () => {
    if (open) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getTreeData();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.addEventListener('click', dismissListener);
      return () => {
        document.body.removeEventListener('click', dismissListener);
      };
    }
  }, [open]);

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <TreeSelect
        placeholder="请选择"
        {...rest}
        open={open}
        onSelect={() => {
          setOpen(false);
        }}
        onClick={() => setOpen(!open)}
      >
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
    </span>
  );
};

export default CategoryTreeSelect;
