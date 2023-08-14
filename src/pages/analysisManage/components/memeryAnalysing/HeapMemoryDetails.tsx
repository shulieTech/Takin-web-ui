/**
 * @name
 * @author MingShined
 */
import { Line } from '@ant-design/charts';
import { Button, Modal, notification } from 'antd';
import React, { Fragment, useContext } from 'react';
import { MemeryAnalysingState } from '.';
import CardItem from '../../common/CardItem';
import { ThreadContext } from '../../context';
import AnalysisService from '../../service';

const HeapMemoryDetails: React.FC<MemeryAnalysingState> = props => {
  const { state } = useContext(ThreadContext);
  const handleAnalysis = async () => {
    Modal.confirm({
      title: '是否确认Dump 内存文件?',
      icon: ' ',
      content: (
        <div>
          <div>1、Dump内存文件保存在/tmp目录下。</div>
          <div style={{ margin: '8px 0' }}>
            2、文件可能较大（GB级别），会比较消耗机器性能，请谨慎操作。
          </div>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      maskClosable: true,
      onOk: handleConfirm
    });
  };
  const handleConfirm = async () => {
    const {
      data: { data, success }
    } = await AnalysisService.confirmDumpMemory({ agentId: state.agentId });
    if (success) {
      if (data.path) {
        notification.open({
          message: 'dump成功',
          description: `文件位置：${data.path}`,
          duration: 0
        });
      }
    }
  };
  const extra: React.ReactNode = (
    <Fragment>
      <Button onClick={handleAnalysis} type="primary">
        Dump内存
      </Button>
      {/* <Tooltip
        placement="bottomLeft"
        title={
          <div>
            <div>
              1、Dump内存操作需要提前创建文件夹，请确保/data/dump 路径的存在
            </div>
            <div style={{ marginTop: 8 }}>
              2、文件比较大（GB 级别），同时也比较消耗机器性能，请谨慎操作。
            </div>
            <div style={{ marginTop: 8 }}>3、内存文件名称为 AgentID+时间。</div>
          </div>
        }
      >
        <Icon className="mg-l2x" type="info-circle" />
      </Tooltip> */}
    </Fragment>
  );
  return (
    <CardItem title="堆内存详情" extra={extra}>
      <Line
        yAxis={{ label: { formatter: text => `${text}MB` } }}
        height={400}
        data={props.chartMap.heapMemory || []}
        smooth
        xField="time"
        yField="value"
        seriesField="type"
        tooltip={{
          formatter: data => ({
            name: data.type,
            value: `${data.value}MB`
          })
        }}
        // xAxis={{ tickCount: 10 }}
      />
    </CardItem>
  );
};
export default HeapMemoryDetails;
