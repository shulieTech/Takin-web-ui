import React, { Fragment, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Row } from 'antd';
import { Link } from 'umi';
import styles from './../index.less';

const TrendChart = (props) => {
  const { data  } = props;

  const id = [];
  const avgRt = [];
  const avgTps = [];
  const successRate = [];

  const cpu = data?.cpu;
  const memory = data?.memory;
  const io = data?.io;
  const mbps = data?.mbps;
  const tps = data?.tps;
  const gcCount = data?.gcCount;
  const gcCost = data?.gcCost;
  const time = data?.time;
  const color = ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'];
  
  const getOption = (title, values) => {
    return {
      color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
          '2023-01-01',
          '2023-01-02',
          '2023-01-03',
          '2023-01-04',
          '2023-01-05',
          '2023-01-06',
          '2023-01-07',
        ],
      },
      yAxis: {
        type: 'value',
        name: title,
      },
      series: [
        {
          name: title,
          type: 'line',
          data: [95, 98, 97, 99, 96, 98, 95],
        },
      ],
    };
  };

  const chartStyle = {
    height: '200px',
    width: '100%' 
  };

  const  getOptions = (keyWord, symbol?, dataSource) => {

    return {
      color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      grid: {
        left: '7%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: time,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: keyWord,
          axisLabel: {
            formatter: `{value} ${symbol}`,
          },
          splitNumber: 5, // 控制左侧纵轴的刻度数量
        },
        {
          type: 'value',
          name: 'TPS',
          axisLabel: {
            formatter: '{value}',
          },
          splitNumber: 5, // 控制右侧纵轴的刻度数量
        },
      ],
      series: [
        {
          name: keyWord,
          type: 'line',
          data: dataSource,
        },
        {
          name: 'TPS',
          type: 'line',
          yAxisIndex: 1,
          data: tps,
        },
      ],
    };
  };

  return (
    <Fragment>
        <div  className={styles.detailCardWarp} >
            <Row>
            <Col span={8}>
        <ReactEcharts style={chartStyle}  option={getOptions('CPU使用率', '%', cpu)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle}  option={getOptions('内存使用率', '%', memory)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOptions('磁盘使用率', '%', io)}/>
        </Col>
            </Row>
        <Row>
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOptions('网络使用率', '%', mbps)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOptions('GC次数', '', gcCount)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOptions('GC耗时', '', gcCost)}/>
        </Col>
        </Row>
        
        </div>
   
    </Fragment>
    
  );
};

export default TrendChart;
