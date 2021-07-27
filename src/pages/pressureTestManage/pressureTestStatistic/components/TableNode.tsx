import { CommonTable, defaultColumnProps } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import TagEditor from 'src/common/tag-editor';
import { PressureTestStatisticEnum } from '../enum';
import { PressureTestStatisticChildrenProps } from '../indexPage';
import PressureTestStatisticService from '../service';
import { transformDatekey } from '../utils';

interface Props extends PressureTestStatisticChildrenProps {
  title: string;
  type: any;
}

const TableNode: React.FC<Props> = props => {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (!props.date.length) {
      return;
    }
    queryList();
  }, [props.date]);
  const queryList = async () => {
    const {
      data: { data, success }
    } = await PressureTestStatisticService.queryList({
      type: props.type,
      ...transformDatekey(props.date)
    });
    if (success) {
      setList(data);
    }
  };
  return (
    <Fragment>
      <h1 className="ft-18">{props.title}</h1>
      <CommonTable
        columns={[
          {
            ...defaultColumnProps,
            title: 'ID',
            dataIndex: PressureTestStatisticEnum.ID
          },
          {
            ...defaultColumnProps,
            title: '名称',
            dataIndex: PressureTestStatisticEnum.名称
          },
          {
            ...defaultColumnProps,
            title: '标签',
            dataIndex: PressureTestStatisticEnum.标签,
            render: text => (
              <TagEditor
                allowAdd={false}
                dataSource={text ? text.split(',') : []}
              />
            )
          },
          {
            ...defaultColumnProps,
            title: '创建日期',
            dataIndex: PressureTestStatisticEnum.创建日期
          },
          {
            ...defaultColumnProps,
            title: '创建人',
            dataIndex: PressureTestStatisticEnum.创建人
          },
          {
            ...defaultColumnProps,
            title: '压测次数',
            dataIndex: PressureTestStatisticEnum.压测次数
          },
          {
            ...defaultColumnProps,
            title: '通过',
            dataIndex: PressureTestStatisticEnum.通过
          },
          {
            ...defaultColumnProps,
            title: '不通过',
            dataIndex: PressureTestStatisticEnum.不通过
          }
        ]}
        dataSource={list || []}
        rowKey={(row, index) => index.toString()}
      />
    </Fragment>
  );
};

export default TableNode;
