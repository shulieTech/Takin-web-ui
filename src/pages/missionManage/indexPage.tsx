import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getMissionManageFormData from './components/MissionManageSearch';
import getMissionManageColumns from './components/MissionManageTable';
import MissionManageService from './service';
import _ from 'lodash';
import { Col, message, Modal, Row, Switch } from 'antd';
import MissionManageTableAction from './components/MissionManageTableAction';
import styles from './index.less';
interface MissionManageProps { }

const getInitState = () => ({
  timeOn: false,
  isReload: false,
  visible: false,
  configStatus: 'ready',
  startStatus: 'ready',
  startErrorList: null,
  status: '启动',
  // searchParams: {
  //   current: 0,
  //   pageSize: 10,
  //   renterId: 1
  // },
  patrolSceneDataSource: null,
  patrolDashbordDataSource: null
});
export type MissionManageState = ReturnType<typeof getInitState>;

const MissionManage: React.FC<MissionManageProps> = props => {
  const [state, setState] = useStateReducer<MissionManageState>(getInitState());
  const [newdata, setData] = useState([]);

  useEffect(() => {
    queryPatrolSceneAndDashbordList();
    patrolDashbordDataSourceList();
  }, []);

  useEffect(() => {
    queryList();
  }, [state.timeOn]);

  const queryList = () => {
    setTimeout(async () => {
      const {
        data: { data, success }
      } = await MissionManageService.timeList({});
      if (success) {
        if (!_.isEqual(newdata, data)) {
          setData(data);
          setState({
            isReload: !state.isReload
          });
        }
      }
      setState({
        timeOn: !state.timeOn
      });
    }, 10000);
  };
  /**
   * @name 获取巡检场景和看板列表
   */
  const queryPatrolSceneAndDashbordList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.queryPatrolSceneAndDashbordList({});
    if (success) {
      setState({
        patrolSceneDataSource:
          data.sceneListResponses &&
          data.sceneListResponses.map((item1, k1) => {
            return {
              label: item1.patrolSceneName,
              value: item1.patrolSceneId
            };
          }),
      });
    }
  };

  const patrolDashbordDataSourceList = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.patrolDashbordDataSourceList({});
    if (success) {
      setState({
        patrolDashbordDataSource:
          data &&
          data.map((item, k) => {
            return {
              label: item.patrolBoardName,
              value: item.patrolBoardId
            };
          })
      });
    }
  };

  const handleCancel = () => {
    setState({
      visible: false,
    });
  };

  return (
    <Fragment>
      <SearchTable
        commonTableProps={{
          columns: getMissionManageColumns(state, setState)
        }}
        commonFormProps={{ formData: getMissionManageFormData(state), rowNum: 6 }}
        ajaxProps={{ url: '/patrol/manager/scene/get', method: 'POST' }}
        toggleRoload={state.isReload}
        tableAction={
          <MissionManageTableAction state={state} setState={setState} />}
      />
      <Modal
        title={`${state.status}进度`}
        visible={state.visible}
        footer={null}
        bodyStyle={{
          width: 522,
          minHeight: 279
        }}
        onCancel={() => handleCancel()}
      >
        {state.startStatus === 'fail' ? (
          <div>
            <div className={styles.modalErrorImg}>
              <img
                style={{ width: 50 }}
                src={require('./../../assets/config_fail.png')}
              />
            </div>
            <p className={styles.modalFailTitle}>{`${state.status}失败`}</p>
            <center style={{ marginTop: 5 }}>{state.startErrorList}</center>
          </div>
        ) : (
          <Row
            type="flex"
            align="middle"
            justify="center"
            style={{ marginTop: 24 }}
          >
            <Col style={{ textAlign: 'center', display: state.status === '启动' ? 'block' : 'none' }}>
              <p>
                <img
                  style={{ width: 72, marginBottom: 8 }}
                  src={require(`./../../assets/${state.configStatus === 'ready' ||
                    state.configStatus === 'loading'
                    ? 'config_ready'
                    : 'config_success'
                    }.png`)}
                />
              </p>
              <span style={{ color: '#474C50' }}>
                {state.configStatus === 'success'
                  ? '巡检配置检查无误'
                  : '巡检配置检查中···'}
              </span>
            </Col>
            <Col>
              <div
                style={{
                  width: 80,
                  height: 1,
                  border:
                    state.configStatus === 'success'
                      ? '1px dotted #29C7D7'
                      : '1px dotted #CACED5',
                  marginBottom: 8,
                  marginRight: 8,
                  display: state.status === '启动' ? 'block' : 'none'
                }}
              />
            </Col>
            <Col
              style={{
                textAlign: 'center'
              }}
            >
              <p>
                <img
                  style={{ width: 72, marginBottom: 8 }}
                  src={require(`./../../assets/${state.startStatus === 'ready'
                    ? 'start_ready'
                    : state.startStatus === 'loading'
                      ? 'start_ready'
                      : 'start_ing'
                    }.png`)}
                />
              </p>
              <span
                style={{
                  color: state.startStatus === 'ready' ? '#E4EAF0' : '#474C50'
                }}
              >
                {state.startStatus === 'ready' ? `${state.status}巡检` : `${state.status}中`}
              </span>
            </Col>
          </Row>
        )}
      </Modal>
    </Fragment>
  );
};
export default MissionManage;
