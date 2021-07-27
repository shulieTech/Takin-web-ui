/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonTable, defaultColumnProps } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import { PressureTestStatisticEnum, TabMap } from '../enum';
import { PressureTestStatisticChildrenProps } from '../indexPage';
import PressureTestStatisticService from '../service';
import { transformDatekey } from '../utils';
import TableNode from './TableNode';

const ScriptNode: React.FC<PressureTestStatisticChildrenProps> = props => {
  return (
    <Row style={{ marginTop: 24 }} gutter={24} type="flex" align="top">
      <Col className="flex-1">
        <TableNode
          {...props}
          title="压测次数 Top5 脚本"
          type={TabMap.脚本总数}
        />
      </Col>
      <Col style={{ width: 350 }}>
        <RankNode {...props} />
      </Col>
    </Row>
  );
};
export default ScriptNode;

const RankNode: React.FC<PressureTestStatisticChildrenProps> = props => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    if (!props.date.length) {
      return;
    }
    queryList();
  }, [props.date]);
  const queryList = async () => {
    const {
      data: { data, success }
    } = await PressureTestStatisticService.queryScriptLabelList({
      ...transformDatekey(props.date)
    });
    if (success) {
      setDataSource(data);
    }
  };
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...defaultColumnProps,
        title: '标签名称',
        dataIndex: PressureTestStatisticEnum.标签
      },
      {
        ...defaultColumnProps,
        title: '脚本数',
        dataIndex: PressureTestStatisticEnum.脚本数
      }
    ];
  };
  return (
    <Fragment>
      <h1 className="ft-18">Top5 脚本标签</h1>
      <CommonTable
        columns={getColumns()}
        dataSource={dataSource}
        rowKey={(row, index) => index.toString()}
      />
    </Fragment>
  );
};
