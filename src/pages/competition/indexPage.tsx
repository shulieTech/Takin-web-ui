/**
 * @name
 * @author chuxu
 */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select, Input, Button, Empty } from 'antd';
import CompetitionService from './service';
import { Line } from '@ant-design/charts';
import style from './index.less';
const { Option } = Select;
const InputGroup = Input.Group;
interface Props { }

const DashboardPage: React.FC<Props> = props => {
  const [dataList, setDataList] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [lists, setLists] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const [ids, setIds] = useState(null);
  useEffect(() => {
    sceneList();
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
    const {
      data: { success, data }
    } = await CompetitionService.reportList({
      sceneIds: ids,
      current: 0,
      pageSize: 10
    });
    if (success) {
      setList1(data);
    }
  };
  const queryAppAndSystemFlowtwo = async () => {
    const {
      data: { success, data }
    } = await CompetitionService.reportList({
      sceneIds: ids,
      current: 1,
      pageSize: 10
    });
    if (success) {
      setList2(data);
    }
  };
  const queryAppAndSystemFlows = async () => {
    const {
      data: { success, data }
    } = await CompetitionService.reportList({
      sceneIds: ids,
      orderType: 2
    });
    if (success) {
      setLists(data);
    }
  };
  const handleChange = async (value) => {
    setId(value);
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
  return (
    <div style={{ padding: 40 }}>
      <Card
        title="人寿竞赛"
        style={{ width: '100%' }}
        extra={
          <InputGroup compact>
            <Select
              mode="multiple"
              placeholder="请选择场景id"
              onChange={handleChange}
              style={{ width: '300px' }}
            >
              {dataList.map((x) => (
                <Option key={x.id} value={x.id}>
                  {x.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" onClick={primary}>搜索</Button>
          </InputGroup>

        }
      >
        <Row style={{ display: !show ? 'block' : 'none' }}>
          <Empty />
        </Row>
        <Row style={{ display: show ? 'block' : 'none' }}>
          <Col span={16}>
            <Line
              // yAxis={{ label: { formatter: text => `${text}MB` } }}
              height={350}
              data={list1 || []}
              smooth
              xField="time"
              yField="tps"
              seriesField="sceneName"
              point={{
                shape: 'breath-point',
              }}
              tooltip={{
                showMarkers: false,
              }}
            // xAxis={{ tickCount: 10 }}
            />
            <div style={{ height: 60 }} />
            <Line
              // yAxis={{ label: { formatter: text => `${text}MB` } }}
              height={350}
              data={list2 || []}
              smooth
              xField="time"
              yField="tps"
              seriesField="sceneName"
              point={{
                shape: 'breath-point',
              }}
              tooltip={{
                showMarkers: false,
              }}
            // xAxis={{ tickCount: 10 }}
            />
          </Col>
          <Col span={8}>

            <div className={style.top10}>
              <h3>排行榜</h3>
              <ul>
                {lists.map((x, ind) => (
                  <li key={x.id}><a>{x.sceneName}</a><span>{x.tps}</span></li>
                ))}

              </ul>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default DashboardPage;
