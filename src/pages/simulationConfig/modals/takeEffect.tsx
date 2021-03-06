import React, { Fragment, useEffect } from 'react';
import { ImportFile, useStateReducer } from 'racc';
import {
  Modal, Form, Input, Descriptions, Icon, Tooltip, Alert, Row, Col, Select, Button, Badge, Pagination,
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
  searchParams: any;
  total: any;
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
    searchParams: {
      current: 0,
      pageSize: 10
    },
    total: 0,
    isEffect: [],
    projectName: []
  });

  useEffect(() => {
    if (props.state.row.enKey) {
      effectList();
    }
  }, [state.isEffect, state.projectName, state.searchParams]);

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
      projectName: value,
      searchParams: {
        current: 0,
        pageSize: 10
      },
    });
  };

  const takeEffects = (value) => {
    setState({
      isEffect: value,
      searchParams: {
        current: 0,
        pageSize: 10
      },
    });
  };

  const effectList = async () => {
    const {
      total,
      data: { data, success }
    } = await configService.effectList({
      enKey: props.state.row.enKey,
      isEffect: state.isEffect || undefined,
      projectName: state.projectName || undefined,
      current: state.searchParams.current,
      pageSize: state.searchParams.pageSize
    });
    if (success) {
      setState({
        total,
        dataList: data
      });
    }
  };

  const effectLists = async () => {
    const {
      total,
      data: { data, success }
    } = await configService.effectList({
      enKey: props.state.row.enKey,
      projectName: props.state.projectName,
      current: state.searchParams.current,
      pageSize: state.searchParams.pageSize
    });
    if (success) {
      setState({
        total,
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
      title: '??????',
      dataIndex: 'projectName',
    },
    {
      title: '???????????????',
      dataIndex: 'effectVal',
    },
    {
      title: '????????????',
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
                true: '?????????',
                false: '?????????',
              }[text]
            }
          />
        );
      }
    },
    {
      title: '??????????????????',
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

  const handleChangePage = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };

  return (
    <Modal
      title="??????????????????"
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
            <Descriptions.Item label="?????????" span={2}>
              {props.state.row.defaultValue}
              <Tooltip
                title={
                  <div>
                    <p>???????????? ???{props.state.row.desc}</p>
                    <p>  ???????????????{props.state.row.effectMinVersion}</p>
                  </div>}
              >
                <Icon type="down" style={{ color: '#3D82FF', marginLeft: 10 }} />
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="????????????">{props.state.row.gmtUpdate}</Descriptions.Item>
          </Descriptions>
        </div>
        <br />
        <Alert
          message={
            <p style={{ fontSize: 16, lineHeight: '20px' }}>????????????
              <span className={styles.font}>???????????? {state.count?.configCount}</span>
              <span className={styles.font}>???????????? {state.count?.effectiveCount}</span>
              <span className={styles.font}>?????????  {state.count?.invalidCount}</span>
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
              placeholder="?????????????????????"
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
            <Button type="link" onClick={() => reset()}>??????</Button>
            <span className={styles.span} />
            <Select
              showSearch
              style={{ width: 180 }}
              placeholder="?????????????????????"
              onChange={takeEffects}
              value={state.isEffect}
            >
              <Option value="true">?????????</Option>
              <Option value="false">?????????</Option>
            </Select>
            <span className={styles.span} />
            <Button type="default" icon="redo" onClick={() => resets()} />
          </Col>
        </Row>
        <CustomTable
          columns={columns}
          dataSource={state.dataList}
          pagination={false}
        />
        <div
          style={{
            padding: '8px 16px',
            width: '100%',
            height: '50px',
            marginTop: '50px',
            background: '#fff'
          }}
        >
          <Pagination
            style={{
              float: 'right'
            }}
            total={state.total}
            current={state.searchParams.current + 1}
            pageSize={state.searchParams.pageSize}
            showTotal={(t, range) =>
              `??? ${state.total} ????????? ???${state.searchParams.current +
              1}??? / ??? ${Math.ceil(
                state.total / (state.searchParams.pageSize || 10)
              )}???`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </Modal>
  );
};
export default Form.create()(takeEffect);
