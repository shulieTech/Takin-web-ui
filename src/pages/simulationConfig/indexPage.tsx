import React, { useEffect, useState } from 'react';
import AgentVersin from './modals/AgentVersin';
import TakeEffect from './modals/takeEffect';
import { Input, Form, Button, Row, Col, Select, Radio, Tabs, Badge } from 'antd';
import { useStateReducer } from 'racc';
import configService from './service';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import styles from './index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import moment from 'moment';
import { FormItemProps } from 'antd/lib/form';
import CustomTable from 'src/components/custom-table';
import { values } from 'lodash';
const InputGroup = Input.Group;
const { Option } = Select;
const { TabPane } = Tabs;
interface AdminProps {
  form: any;
}

const getInitState = () => ({
  versinVisible: false,
  effectVisible: false,
  configList: [],
  searchInputValue: [],
  isEffect: [],
  effectMechanism: [],
  projectName: '',
  readProjectConfig: false,
  allApplicationList: [],
  row: {},
  key: '1'
});
export type AdminState = ReturnType<typeof getInitState>;

const Admin: React.FC<AdminProps> = props => {
  const [state, setState] = useStateReducer<AdminState>(getInitState());
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  useEffect(() => {
    queryPatrolSceneAndDashbordList();
  }, [state.isEffect, state.effectMechanism, state.projectName, state.readProjectConfig]);

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
  }, [state.versinVisible]);

  useEffect(() => {
    allApplication();
  }, []);

  const allApplication = async () => {
    const {
      data: { data, success }
    } = await configService.allApplication();
    if (success) {
      setState({
        allApplicationList: data
      });
    }
  };

  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await configService.configList({
      isEffect: state.isEffect,
      effectMechanism: state.effectMechanism,
      projectName: state.projectName,
      readProjectConfig: state.readProjectConfig
    });
    if (success) {
      setState({
        configList: data,
      });
    }
  };

  const takeEffect = (value) => {
    setState({
      isEffect: value
    });
  };

  const mode = (value) => {
    setState({
      effectMechanism: value
    });
  };

  const apply = (value) => {
    setState({
      projectName: value
    });
  };

  const radioChange = (e) => {
    setState({
      readProjectConfig: e.target.checked
    });
  };

  const formItemProps: FormItemProps = {
    labelCol: { span: 10 },
    wrapperCol: { span: 6 },
  };

  const callback = (key) => {
    if (key === '1') {
      setState({
        key,
        effectMechanism: [],
        isEffect: [],
        projectName: '',
        readProjectConfig: false
      });
    } else {
      setState({
        key,
        effectMechanism: [],
        isEffect: [],
        projectName: state.allApplicationList[0],
        readProjectConfig: false
      });
    }
  };

  const reset = (value) => {
    if (value === 1) {
      setState({
        effectMechanism: [],
        isEffect: [],
        projectName: '',
        readProjectConfig: false
      });
    } else {
      setState({
        effectMechanism: [],
        isEffect: [],
        projectName: state.allApplicationList[0],
        readProjectConfig: false
      });
    }

  };

  const resets = () => {
    queryPatrolSceneAndDashbordList();
  };

  const useGlobal = async (id) => {
    const {
      data: { data, success }
    } = await configService.useGlobal(id);
    if (success) {
      queryPatrolSceneAndDashbordList();
    }
  };

  const columns = [
    {
      title: '配置名称',
      dataIndex: 'zhKey',
      width: 350,
      render: (text, record) => {
        return (
          <Row>
            {text}
            <span
              style={{
                color: 'red',
                display: record.effectMechanism === 0 ? 'inline-block' : 'none',
                marginLeft: 10
              }}
            >需重启生效
            </span>
          </Row>
        );
      },
    },
    {
      title: '配置值',
      dataIndex: 'defaultValue',
    },
    {
      title: '生效状态',
      dataIndex: 'isEffect',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <Badge
              color={
                {
                  true: '#3D82FF',
                  false: '#ED6047',
                }[text]
              }
              text={
                {
                  true: '已生效',
                  false: '未生效',
                }[text]
              }
            />
            <a
              onClick={() => setState({ effectVisible: true, row: record })}
              style={{ marginLeft: 10, display: text ? 'none' : 'inline-block' }}
            >生效范围
            </a>
          </div>
        );
      }
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <AuthorityBtn isShow={btnAuthority && btnAuthority.admins_simulationConfig_3_update}>
            <a
              onClick={() => setState({ versinVisible: true, row: record })}
              style={{ display: record.editable === 1 ? 'none' : 'inline-block' }}
            >编辑
            </a>
          </AuthorityBtn>
        </span>
      ),
    },
  ];

  const column = [
    {
      title: '配置名称',
      dataIndex: 'zhKey',
      width: 350,
      render: (text, record) => {
        return (
          <Row>
            {text}
            <span
              style={{
                color: 'red',
                display: record.effectMechanism === 0 ? 'inline-block' : 'none',
                marginLeft: 10
              }}
            >需重启生效
            </span>
            <span
              style={{
                color: '#00D77D',
                display: record.type === 1 ? 'inline-block' : 'none',
                marginLeft: 10
              }}
            >个性
            </span>
          </Row>
        );
      },
    },
    {
      title: '配置值',
      dataIndex: 'defaultValue',
    },
    {
      title: '生效状态',
      dataIndex: 'isEffect',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <Badge
              color={
                {
                  true: '#3D82FF',
                  false: '#ED6047',
                }[text]
              }
              text={
                {
                  true: '已生效',
                  false: '未生效',
                }[text]
              }
            />
            <a
              onClick={() => setState({ effectVisible: true, row: record })}
              style={{ marginLeft: 10, display: text ? 'none' : 'inline-block' }}
            >生效范围
            </a>
          </div>
        );
      }
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 150,
      render: (text, record) => (
        <span>
          <AuthorityBtn isShow={btnAuthority && btnAuthority.admins_simulationConfig_3_update}>
            <a
              onClick={() => setState({ versinVisible: true, row: record })}
              style={{ display: record.editable === 1 ? 'none' : 'inline-block' }}
            >编辑
            </a>
          </AuthorityBtn>
          <AuthorityBtn isShow={btnAuthority && btnAuthority.admins_simulationConfig_4_delete}>
            <a
              onClick={() => useGlobal(record.id)}
              style={{ marginLeft: 10, display: record.type === 1 ? 'inline-block' : 'none' }}
            >
              恢复全局配置
            </a>
          </AuthorityBtn>
        </span >
      ),
    },
  ];

  return (
    <div style={{ background: '#F5F7F9', height: '100%' }}>
      <div className={styles.borders}>
        <CustomDetailHeader
          title="仿真系统配置"
          img={
            <CustomIcon
              imgWidth={28}
              color="#11D0C5"
              imgName="redis_icon"
              iconWidth={64}
            />
          }
        />
      </div>
      <div className={styles.borders}>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="全局配置" key="1">
            <Row style={{ marginBottom: 20, marginLeft: 20 }}>
              <Col span={1} offset={14}>
                <Button type="link" onClick={() => reset(1)} style={{ marginTop: 10 }}>重置</Button>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  style={{ width: 185 }}
                  placeholder="是否生效：全部"
                  onChange={takeEffect}
                  value={state.isEffect}
                >
                  <Option value="true">已生效</Option>
                  <Option value="false">未生效</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  style={{ width: 185 }}
                  placeholder="生效方式：全部"
                  onChange={mode}
                  value={state.effectMechanism}
                >
                  <Option value="0">重启生效</Option>
                  <Option value="1">立即生效</Option>
                </Select>
              </Col>
              <Col span={1}>
                <Button type="default" icon="redo" onClick={resets} />
              </Col>
            </Row>
            <CustomTable columns={columns} dataSource={state.configList} pagination={false} />
          </TabPane>
          <TabPane tab="应用配置" key="2">
            <Row style={{ marginBottom: 20, marginLeft: 20 }}>
              <Col span={1} offset={7}>
                <Button type="link" onClick={() => reset(2)} style={{ marginTop: 10 }}>重置</Button>
              </Col>
              <Col span={3} style={{ marginTop: 6 }}>
                <Radio.Group onChange={radioChange} value={state.readProjectConfig}>
                  <Radio value={true}>仅看应用配置</Radio>
                </Radio.Group>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  style={{ width: 185 }}
                  placeholder="是否生效：全部"
                  onChange={takeEffect}
                  value={state.isEffect}
                >
                  <Option value="true">已生效</Option>
                  <Option value="false">未生效</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  style={{ width: 185 }}
                  placeholder="生效方式：全部"
                  onChange={mode}
                  value={state.effectMechanism}
                >
                  <Option value="0">重启生效</Option>
                  <Option value="1">立即生效</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  style={{ width: 185 }}
                  placeholder="应用"
                  onChange={apply}
                  defaultValue={state.allApplicationList[0]}
                  value={state.projectName}
                >
                  {
                    state.allApplicationList.map(ite => {
                      return (
                        <Option value={ite} key={ite}>{ite}</Option>
                      );
                    })
                  }
                </Select>
              </Col>
              <Col span={1}>
                <Button type="default" icon="redo" onClick={resets} />
              </Col>
            </Row>
            <CustomTable columns={column} dataSource={state.configList} pagination={false} />
          </TabPane>
        </Tabs>
      </div>
      <AgentVersin state={state} setState={setState} />
      <TakeEffect state={state} setState={setState} />
    </div>
  );
};
export default Form.create()(Admin);