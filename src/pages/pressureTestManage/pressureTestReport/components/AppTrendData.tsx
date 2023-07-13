import React, { Fragment, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Row } from 'antd';
import styles from './../index.less';

const AppTrendData = (props) => {
  const { data = [] } = props;
  const color = ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'];

  const transData = (type, keyWord) => {
    const newData = data?.map((item, k) => {
      return {
        ...item,
        name: item?.appName,
        type,
      };
    });
    return newData?.map((item, k) => {
      return {
        ...item,
        data: item?.[keyWord]
      };
    });
  };

  const getOption = (title, type) => {
    return {
      color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        left: '6%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data?.[0]?.xtime,
      },
      yAxis: {
        type: 'value',
        name: title,
      },
      series: transData('line', type),
    };
  };

  const  getBarOption = () => {
    return {
      color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '6%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data?.[0]?.xcost,
      },
      yAxis: {
        type: 'value',
        name: '请求数目',
      },
      series: transData('bar', 'count'),
    };
  };  

  const chartStyle = {
    height: '200px',
    width: '100%' 
  };
  
  return (
    <Fragment>
        <div  className={styles.detailCardWarp} >
        <Row>
        <Col span={8}>
        <ReactEcharts style={chartStyle}  option={getOption('请求成功率', 'successRate')}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle}  option={getOption('平均RT', 'rt')}/>
        </Col>
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOption('TPS', 'tps')}/>
        </Col>
        </Row>
        <Row>
        {/* <Col span={8}>
        <ReactEcharts style={chartStyle} option={getOption('并发数','concurrent')}/>
        </Col> */}
        <Col span={8}>
        <ReactEcharts style={chartStyle} option={getBarOption()}/>
        </Col>
        </Row>
        </div>
    </Fragment>
    
  );
};

export default AppTrendData;
