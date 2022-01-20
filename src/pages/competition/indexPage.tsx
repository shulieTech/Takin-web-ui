/**
 * @name
 * @author chuxu
 */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select, Input, Button, Empty, message, Modal } from 'antd';
import CompetitionService from './service';
import { Line } from '@ant-design/charts';
import style from './index.less';
import _ from 'lodash';
import axios from 'axios';
const { Option } = Select;
const InputGroup = Input.Group;
interface Props { }

const DashboardPage: React.FC<Props> = props => {
  const [dataList, setDataList] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [lists, setLists] = useState([]);
  const [show, setShow] = useState(false);
  const [showtwo, setShowtwo] = useState(false);
  const [id, setId] = useState([]);
  const [ids, setIds] = useState([]);
  const [modalone, setmodalone] = useState(false);
  const [modaltwo, setmodaltwo] = useState(false);
  const [title, setTitle] = useState([]);
  useEffect(() => {
    sceneList();
    axiosF();
  }, []);

  useEffect(() => {
    if (ids && ids?.length > 0 && show) {
      queryAppAndSystemFlow();
      queryAppAndSystemFlows();
      queryAppAndSystemFlowtwo();
    }
    const timer2 = setInterval(() => {
      if (ids && ids?.length > 0 && show) {
        queryAppAndSystemFlow();
        queryAppAndSystemFlows();
        queryAppAndSystemFlowtwo();
      }
    }, 5000);
    return () => clearInterval(timer2);
  }, [ids]);
  const axiosF = async () => {
    const { data: json } = await axios.get('./version.json');
    setTitle(json.competitionTitle);
  };
  const sceneList = async () => {
    const {
      data: { success, data }
    } = await CompetitionService.sceneList({
      status: 1
    });
    if (success) {
      setDataList(data);
    }
  };
  /**
   * @name 获取应用和系统流程
   */
  const queryAppAndSystemFlow = async () => {
    if (ids?.length < 11) {
      const {
        data: { success, data }
      } = await CompetitionService.reportList({
        sceneIds: ids,
      });
      if (success) {
        setList1(data);
        setShowtwo(false);
      }
    } else if (ids?.length > 10) {
      const {
        data: { success, data }
      } = await CompetitionService.reportList({
        sceneIds: _.slice(ids, 0, 10),
      });
      if (success) {
        setList1(data);
        setShowtwo(true);
      }
    }
  };
  const queryAppAndSystemFlowtwo = async () => {
    if (ids?.length < 11) {
      setList2([]);
      setShowtwo(false);
    } else if (ids?.length > 10) {
      const {
        data: { success, data }
      } = await CompetitionService.reportList({
        sceneIds: _.slice(ids, 10, 20)
      });
      if (success) {
        setList2(data);
        setShowtwo(true);
      }
    }
  };
  const queryAppAndSystemFlows = async () => {
    const {
      data: { success, data }
    } = await CompetitionService.rank({
      sceneIds: ids
    });
    if (success) {
      setLists(data);
    }
  };
  const handleChange = async (value) => {
    sceneList();
    if (value.length > 20) {
      message.error('请勿超过20个');
      return;
    }
    setId(value);
  };
  const allin = async () => {
    sceneList();
    const arr = [];
    dataList.map(ite => arr.push(ite.id));
    if (arr?.length > 0) {
      setShow(true);
      setId(arr);
      setIds(arr);
    } else {
      setShow(false);
      setId(arr);
      setIds(arr);
    }

  };
  const primary = async () => {
    if (id?.length > 0) {
      setShow(true);
      setIds(id);
    } else {
      setShow(false);
      setIds(id);
    }
  };
  const showModalone = async () => {
    setmodalone(true);
  };
  const showModaltwo = async () => {
    setmodaltwo(true);
  };
  const handleCancel = async () => {
    setmodaltwo(false);
    setmodalone(false);
  };
  return (
    <div style={{ padding: 40 }}>
      <Card
        title={title}
        style={{ width: '100%' }}
        extra={
          <div>
            <InputGroup compact>
              <Button type="primary" onClick={allin}>全选</Button>
              <Select
                mode="multiple"
                placeholder="请选择场景id"
                onChange={handleChange}
                style={{ width: '300px' }}
                maxTagCount={2}
                value={id}
              >
                {dataList.map((x) => (
                  <Option key={x.id} value={x.id}>
                    {x.name}
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={primary}>搜索</Button>
            </InputGroup>
          </div>
        }
      >
        <Row style={{ display: !show ? 'block' : 'none' }}>
          <Empty />
        </Row>
        <Row style={{ display: show ? 'block' : 'none' }}>
          <Col span={18}>
            <div style={{ height: '350px' }} onClick={showModalone}>
              <Line
                yAxis={{
                  title: {
                    text: 'TPS',
                    position: 'end',
                    autoRotate: false,
                    offset: 50,
                  }
                }}
                height={350}
                data={list1 || []}
                smooth
                xField="time"
                yField="tps"
                seriesField="sceneName"
                tooltip={{
                  showMarkers: false,
                }}
                xAxis={{
                  tickCount: 10,
                  title: {
                    text: '时间',
                    position: 'end',
                    autoRotate: false,
                    offset: 30,
                  }
                }}
              />
            </div>
            <div style={{ height: 60 }} />
            <div
              style={{
                height: '350px',
                display: showtwo ? 'block' : 'none',
              }}
              onClick={showModaltwo}
            >
              <Line
                yAxis={{
                  title: {
                    text: 'TPS',
                    position: 'end',
                    autoRotate: false,
                    offset: 50,
                  }
                }}
                height={350}
                data={list2 || []}
                smooth
                xField="time"
                yField="tps"
                seriesField="sceneName"
                tooltip={{
                  showMarkers: false,
                }}
                xAxis={{
                  tickCount: 10,
                  title: {
                    text: '时间',
                    position: 'end',
                    autoRotate: false,
                    offset: 30,
                  }
                }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={style.top10}>
              <h3>排行榜（tps）</h3>
              <ul>
                {lists.map((x, ind) => (
                  <li key={x.id}>
                    <span>{x.sceneName}</span>
                    <span className={style.span}>{x.tps}</span>
                  </li>
                ))}

              </ul>
            </div>
          </Col>
        </Row>
      </Card>
      <Modal
        footer={null}
        visible={modalone}
        onCancel={handleCancel}
        width={1550}
      >
        <div style={{ height: 600 }}>
          <Line
            yAxis={{
              title: {
                text: 'TPS',
                position: 'end',
                autoRotate: false,
                offset: 50,
              }
            }}
            height={550}
            data={list1 || []}
            smooth
            xField="time"
            yField="tps"
            seriesField="sceneName"
            tooltip={{
              showMarkers: false,
            }}
            xAxis={{
              tickCount: 10,
              title: {
                text: '时间',
                position: 'end',
                autoRotate: false,
                offset: 30,
              }
            }}
          />
        </div>
      </Modal>
      <Modal
        footer={null}
        visible={modaltwo}
        onCancel={handleCancel}
        width={1550}
      >
        <div style={{ height: 600 }}>
          <Line
            yAxis={{
              title: {
                text: 'TPS',
                position: 'end',
                autoRotate: false,
                offset: 50,
              }
            }}
            height={550}
            data={list2 || []}
            smooth
            xField="time"
            yField="tps"
            seriesField="sceneName"
            tooltip={{
              showMarkers: false,
            }}
            xAxis={{
              tickCount: 10,
              title: {
                text: '时间',
                position: 'end',
                autoRotate: false,
                offset: 30,
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default DashboardPage;
