import React, { Fragment, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Row } from 'antd';
import { Link } from 'umi';
import styles from './../index.less';

const BarChart = (props) => {
  const { data = [] } = props;

  const id = [];
  const avgRt = [];
  const avgTps = [];
  const successRate = [];
  const color = ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'];

  data?.map((item) => {
    return id?.push(item?.reportId);
  });
  data?.map((item) => {
    return avgRt?.push(item?.avgRt);
  });
  data?.map((item) => {
    return avgTps?.push(item?.avgTps);
  });
  data?.map((item) => {
    return successRate?.push(item?.successRate);
  });
  console.log(id);
  
  const getOption = (title, values) => {
    console.log('values', values);
    const option = {
      legend: {
        data: id,
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: 'id',
        data: id,  
      },
      yAxis: {
        type: 'value',
        name: title,
        nameTextStyle: {
          fontSize: 12
        },
        axisLabel: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'normal',
        }, 
      },
      series : [
        {
          name: title,
          type: 'bar',
          barWidth: '20px',
          data: values,
          itemStyle: {                   
            color(params) {
              return color[params?.dataIndex];
            }
          } 
        },
        
      ]
    };
    return option;
  };
  
  return (
    <Fragment>
        <Row  className={styles.detailCardWarp} >
        <Col span={8}>
        <ReactEcharts option={getOption('平均TPS', avgTps)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts option={getOption('平均RT', avgRt)}/>
        </Col>
        <Col span={8}>
        <ReactEcharts option={getOption('成功率', successRate)}/>
        </Col>
        </Row>
   
    </Fragment>
    
  );
};

export default BarChart;
