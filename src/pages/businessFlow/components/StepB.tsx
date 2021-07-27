/**
 * @name 步骤1-基本信息
 */

import { Button, Popover, Tree } from 'antd';
import { CommonSelect, CommonTable } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import ToolTipIcon from 'src/common/tooltip-icon';
import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import BusinessActivityService from 'src/pages/businessActivity/service';
import uuid from 'uuid/v1';
import BusinessFlowService from '../service';
import styles from './../index.less';
import getMiddleWareColumns from './LinkMiddleWareTable';

interface Props {
  location?: any;
}

const StepB = (state, setState, props): FormCardMultipleDataSourceBean => {
  const { businessFlowStep, idList } = state;

  const { TreeNode } = Tree;

  const columns = [
    {
      title: 'applicationName',
      dataIndex: 'applicationName',
      key: 'applicationName',
      //   fixed: 'left',
      render: text => {
        return (
          <span
            style={{
              display: 'inline-block',
              color: '#1A7DC8',
              fontWeight: 'bold'
            }}
          >
            {text}
          </span>
        );
      }
    },
    {
      title: 'serviceType',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 100,
      render: text => {
        return (
          <span style={{ color: '#8267C5', fontWeight: 'bold' }}>{text}</span>
        );
      }
    },
    {
      title: 'serviceDetail',
      dataIndex: 'serviceDetail',
      key: 'serviceDetail'
    }
  ];

  useEffect(() => {
    if (state.deleteNode) {
      handledeleteNode();
    }
  }, [state.deleteNode]);

  // 判断对象是否相等
  function isObjectValueEqual(a, b) {
    if (typeof a !== 'object' && typeof b !== 'object') {
      if (a === b) {
        return true;
      }
      return false;
    }
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  }

  function getIndexWithArr(_arr, _obj) {
    const len = _arr.length;
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < len; i++) {
      if (isObjectValueEqual(_arr[i], _obj)) {
        return i;
      }
    }
    return -1;
  }

  /**
   *
   * @name 树平铺
   */
  const treeToArray = (data, arr) => {
    data.forEach(item => {
      arr.push({
        id: item.id,
        key: item.key
      });
      if (item.children) {
        item.children = treeToArray(item.children, arr);
      }
    });
    return arr;
  };

  /**
   * @name 增加同级节点
   */
  function addSiblingNode(data, key) {
    data.forEach(item => {
      if (item.key === key) {
        data.push({
          key: uuid(),
          id: '',
          children: []
        });
        return;
      }
      if (item.children && item.children.find(item2 => item2.key === key)) {
        item.children.push({ key: uuid(), id: '', children: [] });
        return;
      }
      if (item.children) {
        item.children = addSiblingNode(item.children, key);
      }
    });
    return data;
  }

  /**
   * @name 增加子节点
   */
  function addChildNode(data, key) {
    data.forEach(item => {
      if (item.key === key) {
        item.children.push({ key: uuid(), id: '', children: [] });
        return;
      }
      if (item.children) {
        item.children = addChildNode(item.children, key);
      }
    });
    return data;
  }

  /**
   * @name 删除节点后id以及中间件变更
   */
  const handledeleteNode = () => {
    const { deleteNode } = state;
    /**
     * @name 被删除的节点所含id数组
     */
    const deleteNodeIds = treeToArray([deleteNode], []).map(item6 => {
      return item6.id;
    });

    setState({
      idList: filterArr(state.idList, deleteNodeIds),
      businessActivityIds: filterArr(state.idList, deleteNodeIds).map(items => {
        return items.value;
      }),
      /** 重置待选择的下拉列表（不重复） */
      bussinessActiveList: filterArr(
        state.originBussinessActiveList,
        filterArr(state.idList, deleteNodeIds).map(items => {
          return items.value;
        })
      )
    });

    // if (
    //   filterArr(state.idList, deleteNodeIds).map(items => items.value).length >
    //   0
    // ) {
    //   querySceneMiddlewares(
    //     filterArr(state.idList, deleteNodeIds).map(items => items.value)
    //   );
    // } else {
    //   setState({
    //     middleWareList: null
    //   });
    // }
  };

  /**
   * @name 删除节点
   */
  function deleteNodes(data, key) {
    data.forEach(item => {
      if (item.key === key) {
        setState({
          deleteNode: item
        });

        data.splice(getIndexWithArr(data, item), 1);
        return;
      }
      if (item.children) {
        item.children = deleteNodes(item.children, key);
      }
    });
    return data;
  }

  /**
   * @name 改变id值,替换当前已被选择过的id
   */
  function handleChangeSelectId(data, key, id) {
    data.forEach(item => {
      if (item.key === key) {
        data.splice(getIndexWithArr(data, item), 1, {
          key,
          id,
          children: []
        });
      }
      if (item.children) {
        item.children = handleChangeSelectId(item.children, key, id);
      }
    });
    return data;
  }

  /**
   * @name 过滤含此id的数据
   */
  const filterArr = (a, b) => {
    const c = a.filter(e => {
      if (b.includes(e.value)) {
        return false;
      }
      return true;
    });
    return c;
  };

  /**
   * @name 过滤含此key的数据
   */
  const filterKeysArr = (a, b) => {
    const c = a.filter(e => {
      if (b.includes(e.key)) {
        return false;
      }
      return true;
    });
    return c;
  };

  const handleChange = async (value, key, item) => {
    const deleteNodeKeys = treeToArray([item], []).map(item6 => {
      return item6.key;
    });
    /**
     * @name 重新渲染树
     */
    setState({
      treeData: handleChangeSelectId(state.treeData, key, value)
    });

    if (
      state.idList
        .map(item6 => {
          return item6.key;
        })
        .includes(key)
    ) {
      // 获取更改选择的业务活动
      /**
       * @name key对于树是唯一的，过滤掉含此key的数据数组，将新选择的key,value添加的维护的id数组，为了做下拉选择的内容去重的工作
       */

      const newIdList = [
        ...filterKeysArr(idList, deleteNodeKeys),
        { key, value }
      ];
      setState({
        idList: newIdList,
        bussinessActiveList: filterArr(
          state.originBussinessActiveList,
          newIdList.map(item4 => {
            return item4.value;
          })
        ),
        businessActivityIds: newIdList.map(item4 => {
          return item4.value;
        })
      });
      /**
       * @name 重新根据新选择的id数组获取中间件列表
       */
      // querySceneMiddlewares(
      //   newIdList.map(item4 => {
      //     return item4.value;
      //   })
      // );
    } else {
      const newIdList = [...idList, { key, value }];
      setState({
        idList: newIdList,
        bussinessActiveList: filterArr(
          state.originBussinessActiveList,
          newIdList.map(item4 => {
            return item4.value;
          })
        ),
        businessActivityIds: newIdList.map(item4 => {
          return item4.value;
        })
      });
      // querySceneMiddlewares(
      //   newIdList.map(item4 => {
      //     return item4.value;
      //   })
      // );
    }
  };

  /**
   * @name 获取业务活动详情
   */
  const queryBusinessActivityDetail = async id => {
    setState({
      nodeLoading: true
    });
    const {
      data: { success, data }
    } = await BusinessActivityService.queryBusinessActivityDetail({
      id
    });
    if (success) {
      setState({
        businessActivityInfo: data &&
          data.techLinkDto &&
          data.techLinkDto.linkNode && [JSON.parse(data.techLinkDto.linkNode)],
        nodeLoading: false
      });
      return;
    }
    setState({
      nodeLoading: false
    });
  };

  /**
   * @name 获取业务流程中间件
   */
  // const querySceneMiddlewares = async ids => {
  //   const {
  //     data: { success, data }
  //   } = await BusinessFlowService.querySceneMiddlewares({
  //     ids
  //   });
  //   if (success) {
  //     setState({
  //       middleWareList: data
  //     });
  //   }
  // };

  /**
   * @name 添加同级节点
   */
  const handleAddNode = (key, item) => {
    setState({
      treeData: addSiblingNode(state.treeData, key)
    });
  };

  /**
   * @name 添加子节点
   */
  const handleAddChildNode = (key, item) => {
    setState({
      treeData: addChildNode(state.treeData, key)
    });
  };

  /**
   * @name 删除节点
   */
  const handleDeleteNode = (key, item) => {
    setState({
      treeData: deleteNodes(state.treeData, key)
    });
  };

  /**
   * @name 渲染节点链路信息
   */

  const renderContent = () => {
    return (
      <div
        className={styles.linkDetailTable}
        style={{ width: 800, height: 400, overflowY: 'scroll' }}
      >
        <CommonTable
          // bordered={false}
          loading={state.nodeLoading}
          rowKey={(row, index) => index.toString()}
          size="small"
          defaultExpandAllRows={true}
          columns={columns}
          showHeader={false}
          dataSource={
            state.businessActivityInfo ? state.businessActivityInfo[0] : []
          }
          scroll={{ x: true }}
        />
      </div>
    );
  };

  /**
   * @name 首次添加节点
   */
  const handleAddFirstTreeNode = () => {
    setState({
      treeData: [{ key: uuid(), id: '', children: [] }]
    });
  };

  const renderTreeNodes = data => {
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            selectable={false}
            title={
              <div>
                <CommonSelect
                  showSearch
                  allowClear={false}
                  defaultValue={item.id}
                  size="small"
                  style={{ width: 200 }}
                  placeholder="请选择业务活动"
                  dataSource={
                    state.bussinessActiveList ? state.bussinessActiveList : []
                  }
                  onChange={value => handleChange(value, item.key, item)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                />
                {item.id && (
                  <span
                    style={{ display: 'inline-block' }}
                    onClick={() => handleAddNode(item.key, item)}
                  >
                    <ToolTipIcon
                      title="下方添加节点"
                      iconName="node_icon"
                      imgStyle={{ marginLeft: 8, width: 20 }}
                    />
                  </span>
                )}
                {item.id && (
                  <span
                    style={{ display: 'inline-block' }}
                    onClick={() => handleAddChildNode(item.key, item)}
                  >
                    <ToolTipIcon
                      title="添加子节点"
                      iconName="childNode_icon"
                      imgStyle={{ marginLeft: 8, width: 20 }}
                    />
                  </span>
                )}
                <span
                  style={{ display: 'inline-block' }}
                  onClick={() => handleDeleteNode(item.key, item)}
                >
                  <ToolTipIcon
                    title="删除节点"
                    iconName="delete_icon"
                    imgStyle={{ marginLeft: 8, width: 20 }}
                  />
                </span>
              </div>
            }
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          selectable={false}
          title={
            <div>
              <CommonSelect
                showSearch
                allowClear={false}
                defaultValue={item.id}
                size="small"
                style={{ width: 200 }}
                placeholder="请选择业务活动"
                dataSource={
                  state.bussinessActiveList ? state.bussinessActiveList : []
                }
                onChange={value => handleChange(value, item.key, item)}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
              {item.id && (
                <span
                  style={{ display: 'inline-block' }}
                  onClick={() => handleAddNode(item.key, item)}
                >
                  <ToolTipIcon
                    title="下方添加节点"
                    iconName="node_icon"
                    imgStyle={{ marginLeft: 8, width: 20 }}
                  />
                </span>
              )}
              {item.id && (
                <span
                  style={{ display: 'inline-block' }}
                  onClick={() => handleAddChildNode(item.key, item)}
                >
                  <ToolTipIcon
                    title="添加子节点"
                    iconName="childNode_icon"
                    imgStyle={{ marginLeft: 8, width: 20 }}
                  />
                </span>
              )}
              {/* {item.id && (
                <Popover content={renderContent()} trigger="click">
                  <span onClick={() => queryBusinessActivityDetail(item.id)}>
                    <ToolTipIcon
                      title="查看节点链路"
                      iconName="detail_icon"
                      imgStyle={{ marginLeft: 8, width: 20 }}
                    />
                  </span>
                </Popover>
              )} */}
              <span
                style={{ display: 'inline-block' }}
                onClick={() => handleDeleteNode(item.key, item)}
              >
                <ToolTipIcon
                  title="删除节点"
                  iconName="delete_icon"
                  imgStyle={{ marginLeft: 8, width: 20 }}
                />
              </span>
            </div>
          }
          key={item.key}
          dataRef={item}
        />
      );
    });
  };

  /** @name 业务流程配置 */
  const GetBaseInfoFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action } = query;
    return [
      {
        key: 'existBusinessActive',
        label: '',
        formItemProps: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        options: {
          initialValue: action !== 'add' ? state.treeData : undefined,
          rules: [{ required: false, message: '请输入业务流程名称' }]
        },
        node: (
          <div
            style={{
              display: 'flex',
              border: '1px dotted #D7D8E1',
              height: 350
            }}
          >
            <div
              className={styles.linkListLeft}
              style={{ minWidth: 500, overflow: 'scroll', width: '70%' }}
            >
              {state.treeData.length === 0 && (
                <Button
                  onClick={handleAddFirstTreeNode}
                  style={{ marginLeft: 16 }}
                >
                  请添加节点
                </Button>
              )}
              <div className={styles.customTree}>
                {state.treeData && state.treeData.length > 0 && (
                  <Tree style={{ overflow: 'scroll' }} defaultExpandAll>
                    {renderTreeNodes(state.treeData)}
                  </Tree>
                )}
              </div>
            </div>
            {/** 已经注释，三变要求不展示 */}
            {/* <div
              className={styles.linkListRight}
              style={{ minWidth: 350, width: '30%' }}
            >
              <p className={styles.linkListTitle} style={{ minWidth: 350 }}>
                关联中间件列表
              </p>

              {(!state.treeData.length || !state.middleWareList) && (
                <p
                  className={styles.linkListWithoutData}
                  style={{ width: 350 }}
                >
                  配置业务活动后自动带出
                </p>
              )}
              {state.treeData.length !== 0 && state.middleWareList && (
                <CommonTable
                  size="small"
                  columns={getMiddleWareColumns()}
                  dataSource={state.middleWareList}
                />
              )}
            </div> */}
          </div>
        )
      }
    ];
  };

  return {
    title: '业务流程配置',
    hide: businessFlowStep !== 2,
    rowNum: 1,
    span: 24,
    formData: GetBaseInfoFormData()
  };
};

export default StepB;
