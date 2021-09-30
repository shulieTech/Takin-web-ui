import React, { Fragment, useEffect } from 'react';
import { ImportFile, useStateReducer } from 'racc';
import {
  Modal, Form, Input, Descriptions, Icon, Tooltip, Alert, Row, Col, Select, Button, Badge,
} from 'antd';
import styles from '../index.less';
import CustomTable from 'src/components/custom-table';
import RemoteSelect from 'src/common/remote-select';
import configService from '../service';
const { Option } = Select;
interface Props {
  state: any;
  setState: any;
  form: any;
}

interface State {
  uploadFiles: any;
  count: any;
  dataList: any;
  isEffect: any;
  projectName: any;
}
const takeEffect: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    uploadFiles: null,
    dataList: [],
    count: {
      configCount: 0,
      effectiveCount: 0,
      invalidCount: 0
    },
    isEffect: [],
    projectName: []
  });

  useEffect(() => {
    if (props.state.row.enKey) {
      effectList();
    }
  }, [state.isEffect, state.projectName]);

  useEffect(() => {
    if (props.state.key === '2' && props.state.row.enKey) {
      effectLists();
      countStatus();
      setState({
        projectName: props.state.projectName
      });
    } else {
      if (props.state.row.enKey) {
        countStatus();
        effectList();
      }
    }
  }, [props.state.effectVisible]);

  const countStatus = async () => {
    const {
      data: { data, success }
    } = await configService.countStatus({
      enKey: props.state.row.enKey,
    });
    if (success) {
      setState({
        count: data
      });
    }
  };

  const apply = (value) => {
    setState({
      projectName: value
    });
  };

  const takeEffects = (value) => {
    setState({
      isEffect: value
    });
  };

  const effectList = async () => {
    const {
      data: { data, success }
    } = await configService.effectList({
      enKey: props.state.row.enKey,
      isEffect: state.isEffect || undefined,
      projectName: state.projectName || undefined,
    });
    if (success) {
      setState({
        dataList: data
      });
    }
  };

  const effectLists = async () => {
    const {
      data: { data, success }
    } = await configService.effectList({
      enKey: props.state.row.enKey,
      projectName: props.state.projectName,
    });
    if (success) {
      setState({
        dataList: data
      });
    }
  };

  const columns = [
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      width: 200,
      render: (text, record) => {
        return (
          <Row>
            {text}
          </Row>
        );
      },
    },
    {
      title: '应用',
      dataIndex: 'projectName',
    },
    {
      title: '生效配置值',
      dataIndex: 'effectVal',
    },
    {
      title: '生效状态',
      dataIndex: 'isEffect',
      width: 80,
      render: text => {
        return (
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
        );
      }
    },
    {
      title: '建议处理方案',
      width: 120,
      dataIndex: 'program',
    },
  ];

  const handleCancel = e => {
    props.setState({
      effectVisible: false,
      row: {},
    });
    setState({
      isEffect: [],
      projectName: undefined
    });
  };

  const reset = () => {
    setState({
      isEffect: [],
      projectName: undefined
    });
  };

  const resets = () => {
    effectList();
  };

  return (
    <Modal
      title="配置生效范围"
      visible={props.state.effectVisible}
      style={{ top: 40 }}
      width={1000}
      footer={null}
      onCancel={handleCancel}
    >
      <div>
        <div className={styles.title}>
          <Descriptions
            title={props.state.row.zhKey}
            column={3}
          >
            <Descriptions.Item label="配置值" span={2}>
              {props.state.row.defaultValue}
              <Tooltip
                title={
                  <div>
                    <p>配置描述 ：{props.state.row.desc}</p>
                    <p>  生效版本：{props.state.row.effectMinVersion}</p>
                  </div>}
              >
                <Icon type="down" style={{ color: '#3D82FF', marginLeft: 10 }} />
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">{props.state.row.gmtUpdate}</Descriptions.Item>
          </Descriptions>
        </div>
        <br />
        <Alert
          message={
            <p style={{ fontSize: 16, lineHeight: '20px' }}>配置概况
              <span className={styles.font}>配置总数 {state.count.configCount}</span>
              <span className={styles.font}>生效总数 {state.count.effectiveCount}</span>
              <span className={styles.font}>未生效  {state.count.invalidCount}</span>
            </p>}
          type="info"
          showIcon
        />
        <br />
        <Row style={{ marginBottom: 20 }}>
          <Col span={5}>
            <Select
              showSearch
              style={{ width: 320 }}
              placeholder="请输入应用名称"
              onChange={apply}
              value={state.projectName}
            >
              {
                props.state.allApplicationList.map(ite => {
                  return (
                    <Option value={ite} key={ite}>{ite}</Option>
                  );
                })
              }
            </Select>
          </Col>
          <Col span={8} offset={11}>
            <span className={styles.span} />
            <Button type="link" onClick={() => reset()}>重置</Button>
            <span className={styles.span} />
            <Select
              showSearch
              style={{ width: 180 }}
              placeholder="是否生效：全部"
              onChange={takeEffects}
              value={state.isEffect}
            >
              <Option value="true">已生效</Option>
              <Option value="false">未生效</Option>
            </Select>
            <span className={styles.span} />
            <Button type="default" icon="redo" onClick={() => resets()} />
          </Col>
        </Row>
        <CustomTable columns={columns} dataSource={state.dataList} pagination={false} />

      </div>
    </Modal>
  );
};
export default Form.create()(takeEffect);
