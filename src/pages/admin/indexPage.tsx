import React, { useEffect, useState } from 'react';
import AgentVersin from './modals/AgentVersin';
import { Input, Form, Button, Row, Col, Select, Pagination } from 'antd';
import { useStateReducer } from 'racc';
import agentService from './service';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import styles from './index.less';
import { FormItemProps } from 'antd/lib/form';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomTable from 'src/components/custom-table';
import moment from 'moment';
const InputGroup = Input.Group;
const { Option } = Select;
declare var serverUrl: string;
interface AdminProps {
  form: any;
}

const getInitState = () => ({
  searchParams: {
    current: 0,
    pageSize: 10
  },
  total: 0,
  versinVisible: false,
  deployVisible: false,
  deployList: [],
  version: '0',
  dataList: [],
  versionSelect: [],
  allVersionList: [],
  value: {},
  keys: 0
});
export type AdminState = ReturnType<typeof getInitState>;

const Admin: React.FC<AdminProps> = props => {
  const [state, setState] = useStateReducer<AdminState>(getInitState());
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  useEffect(() => {
    queryList();
    allVersionList();
  }, []);

  useEffect(() => {
    queryList();
  }, [state.versinVisible, state.versionSelect, state.searchParams]);

  /**
   * @name 获取列表
   */
  const queryList = async () => {
    const {
      total,
      data: { data, success }
    } = await agentService.agentList({
      version: state.versionSelect,
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

  const allVersionList = async () => {
    const {
      data: { data, success }
    } = await agentService.allVersionList({});
    if (success) {
      setState({
        allVersionList: data
      });
    }
  };

  const onChange = value => {
    resets();
    setState({
      versionSelect: value
    });
  };

  const reset = () => {
    setState({
      versionSelect: [],
      searchParams: {
        current: 0,
        pageSize: 10
      }
    });
  };

  const resets = () => {
    setState({
      searchParams: {
        current: 0,
        pageSize: 10
      }
    });
  };

  const columns = [
    {
      title: '探针版本',
      dataIndex: 'version',
      width: 350,
      render: (text, record) => {
        return (
          <Row>
            <Col span={5}>
              <CustomIcon
                imgWidth={20}
                color="#F8F8F8"
                imgName="redis_icon_black"
                iconWidth={45}
              />
            </Col>
            <Col span={19}>
              <h3>{text}</h3>
              <span>
                <span style={{ color: '#8E8E8E' }}>更新时间 ：</span>
                {moment(record.gmtUpdate).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </Col>
          </Row>
        );
      }
    },
    {
      title: '版本特性',
      dataIndex: 'versionFeatures',
      width: '65%'
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <AuthorityBtn
            isShow={btnAuthority && btnAuthority.admins_admin_7_download}
          >
            <a
              onClick={e => e.stopPropagation()}
              href={`${serverUrl}/fast/agent/access/download?version=${record.version}`}
              download
            >
              下载
            </a>
          </AuthorityBtn>
        </span>
      )
    }
  ];

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
    <div style={{ background: '#F5F7F9', height: '100%' }}>
      <div className={styles.borders}>
        <CustomDetailHeader
          title="探针版本"
          img={
            <CustomIcon
              imgWidth={28}
              color="#11D0C5"
              imgName="redis_icon"
              iconWidth={64}
            />
          }
          description="探针管理"
          extra={
            <div style={{ float: 'right' }}>
              <AuthorityBtn
                isShow={btnAuthority && btnAuthority.admins_admin_2_create}
              >
                <Button
                  type="primary"
                  onClick={() => setState({ versinVisible: true })}
                >
                  新增探针版本
                </Button>
              </AuthorityBtn>
            </div>}
        />
      </div>
      <div className={styles.borders}>
        <Row style={{ marginBottom: 20 }}>
          <Col span={1} offset={18}>
            <Button type="link" onClick={reset} style={{ marginTop: 10 }}>
              重置
            </Button>
          </Col>
          <Col span={4}>
            <Select
              showSearch
              style={{ width: 185 }}
              placeholder="探针版本号：全部"
              onChange={onChange}
              value={state.versionSelect}
            >
              {state.allVersionList.map(ite => {
                return (
                  <Option value={ite} key={ite}>
                    {ite}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={1}>
            <Button type="default" icon="redo" onClick={resets} />
          </Col>
        </Row>
        <CustomTable
          columns={columns}
          dataSource={state.dataList}
          pagination={false}
        />
        <div style={{ height: 50 }}>
          <Pagination
            style={{
              marginTop: 20,
              float: 'right'
            }}
            total={state.total}
            current={state.searchParams.current + 1}
            pageSize={state.searchParams.pageSize}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchParams.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchParams.pageSize || 10)
              )}页`
            }
            showSizeChanger={true}
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
      <AgentVersin state={state} setState={setState} />
    </div>
  );
};
export default Form.create()(Admin);
