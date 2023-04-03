/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from 'react';
import StepsComponent from 'src/common/steps';
import { StepdColumnsData } from './enum';
import { useStateReducer } from 'racc';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import FormCardMultiple from 'src/components/form-card-multiple';
import StepABaseInfo from './components/StepABaseInfo';
import BasePageLayout from 'src/components/page-layout/BasePageLayout';
import { Row, Col, Button, notification, message, Icon } from 'antd';
import ProcessComponent from 'src/common/process';
import BusinessFlowService from './service';
import StepB from './components/StepB';
import { connect } from 'dva';
import uuid from 'uuid/v1';
import router from 'umi/router';

interface Props {
  location?: any;
}

const AddBusinessFlow: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    prvStatus: false, // 上一步是否可用
    nextStatus: false, // 下一步是否可用
    form: null as WrappedFormUtils,
    formData: {} as any,
    middleWareList: null, // 中间件列表数据
    treeData: [], // 构造的树结构
    idList: [], // 前端维护的已经选择的业务活动数组
    businessActivityIds: [], // 前端维护的已经选择的业务活动数组id
    businessFlowStep: 1, // 注册到第几步
    originBussinessActiveList: null, // 业务活动下拉列表所有数据(不要更改)
    bussinessActiveList: null, // 业务活动下拉列表所有数据，不能重复需要每次过滤
    bussinessFlowDetail: null, // 业务流程详情
    deleteNode: null, // 被删除的节点
    // businessFlowInfo: null, // 业务流程信息
    businessActivityInfo: null, // 业务活动信息
    nodeLoading: false // 节点链路loading状态
  });
  const [form, setForm] = useState<WrappedFormUtils>(null);
  const { businessFlowStep } = state;
  const { location } = props;
  const { query } = location;
  const { action, id } = query;

  useEffect(() => {
    if (action === 'edit') {
      queryBusinessActivityDetail(id);
    }
    queryBussinessActive([]);
  }, []);

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
   * @name 获取所有业务活动
   */
  const queryBussinessActive = async businessActivityIds => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryBussinessActive({});
    if (success) {
      setState({
        bussinessActiveList: filterArr(
          (data &&
            data.map(item => {
              return { label: item.businessActiveName, value: item.id };
            })) ||
            [],
          businessActivityIds
        ),
        originBussinessActiveList:
          data &&
          data.map(item => {
            return { label: item.businessActiveName, value: item.id };
          })
      });
    }
  };

  /**
   * @name 获取流程详情
   */
  const queryBusinessActivityDetail = async value => {
    const {
      data: { success, data }
    } = await BusinessFlowService.queryBusinessActivityDetail({ id: value });
    if (success) {
      setState({
        bussinessFlowDetail: data,
        treeData: data.roots,
        idList:
          data.existBusinessActive &&
          data.existBusinessActive.map(item => {
            return { key: item.key, value: item.id };
          }),
        businessActivityIds:
          data.existBusinessActive &&
          data.existBusinessActive.map(item4 => {
            return item4.id;
          }),
        middleWareList: data.middleWareEntities
      });
      queryBussinessActive(
        data.existBusinessActive &&
          data.existBusinessActive.map(item4 => {
            return item4.id;
          })
      );
    }
  };

  /**
   * @name 判断id有空的
   */

  const hasEmptyNode = (data, arr) => {
    data.map(item => {
      if (!item.id) {
        arr.push({
          id: item.id,
          key: item.key
        });
      }

      if (item.children && item.children.length > 0) {
        hasEmptyNode(item.children, arr);
      }
    });

    if (arr.length) {
      return true;
    }
    return false;
  };

  const formDataSource = [
    StepABaseInfo(state, setState, props),
    StepB(state, setState, props)
  ];

  // 上一步
  const handlerBack = () => {
    setState({
      businessFlowStep: businessFlowStep - 1
    });
  };
  // 下一步
  const handlerNext = async e => {
    switch (state.businessFlowStep) {
      case 1:
        form.validateFields(async (err, values) => {
          if (err) {
            notification.open({
              message: (
                <span style={{ color: '#f5222d', fontSize: '18px' }}>注意</span>
              ),
              description: (
                <span style={{ color: 'rgba(53, 65, 83)', fontSize: '14px' }}>
                  请先填写必填项，方允许进入下一步！
                </span>
              )
            });
            return;
          }

          setState({
            businessFlowStep: state.businessFlowStep + 1,
            formData: values
          });
        });
        break;
      default:
        setState({
          businessFlowStep: businessFlowStep + 1
        });
        break;
    }
  };
  // 保存
  const handlerSubmit = async () => {
    if (
      !state.treeData.length ||
      !state.idList.length ||
      hasEmptyNode(state.treeData, [])
    ) {
      notification.open({
        message: (
          <span style={{ color: '#f5222d', fontSize: '18px' }}>注意</span>
        ),
        description: (
          <span style={{ color: 'rgba(53, 65, 83)', fontSize: '14px' }}>
            请配置业务流程，方允许完成保存！
          </span>
        )
      });
      return;
    }

    const result = {
      ...state.formData,
      root: state.treeData,
      existBusinessActive: state.idList.map(item => {
        return { key: item.key, id: item.value };
      })
    };

    if (action === 'edit') {
      const {
        data: { success, data }
      } = await BusinessFlowService.editBusinessFlow({ ...result, id });
      if (success) {
        message.success('编辑成功');
        router.push('/businessFlow');
      } else {
        message.error('编辑失败');
      }
    } else {
      const {
        data: { success, data }
      } = await BusinessFlowService.addBusinessFlow(result);
      if (success) {
        message.success('创建成功');
        router.push('/businessFlow');
      } else {
        message.error('创建失败');
      }
    }
  };

  const controlBottom: React.ReactNode = (
    <Row type="flex" justify="center" gutter={24}>
      {businessFlowStep > 1 && (
        <Col>
          <Button onClick={() => handlerBack()}>上一步</Button>
        </Col>
      )}

      {businessFlowStep < 2 && (
        <Col>
          <Button onClick={e => handlerNext(e)} type="primary">
            下一步
          </Button>
        </Col>
      )}
      {businessFlowStep === 2 && (
        <Col>
          <Button onClick={() => handlerSubmit()} type="primary">
            保存
          </Button>
        </Col>
      )}
    </Row>
  );

  return (
    <BasePageLayout title={'业务流程配置'} extra={controlBottom}>
      {window.history.length > 1 && (
        <a
          onClick={() => window.history.go(-1)}
          style={{ marginBottom: 8, display: 'inline-block' }}
        >
          <Icon type="left" style={{ marginRight: 8 }} /> 返回
        </a>
      )}
      <StepsComponent
        columnsData={StepdColumnsData}
        active={businessFlowStep}
      />
      <FormCardMultiple
        commonFormProps={{ rowNum: 1 }}
        dataSource={formDataSource}
        getForm={f => setForm(f)}
      />
    </BasePageLayout>
  );
};

export default connect(({ common }) => ({ ...common }))(AddBusinessFlow);
