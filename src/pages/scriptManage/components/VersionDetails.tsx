/**
 * @name
 * @author MingShined
 */
import { Card, Col, Row, Spin } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import { CommonTable, defaultColumnProps, renderToolTipItem, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { FileTypeEnum, ScriptTypeEnum, VersionHistoryEnum } from '../enum';
import VersionJMXModal from '../modals/VersionJMXModal';
import ScriptManageService from '../service';
import { VersionHistoryChildrenProps } from '../versionPage';

const VersionDetails: React.FC<VersionHistoryChildrenProps> = props => {
  const [state, setState] = useStateReducer({
    lastDetails: null,
    curDetails: null,
    loading: false
  });
  useEffect(() => {
    if (props.versionList.length) {
      getLastVersionDetails(
        props.versionList[0][VersionHistoryEnum.ID],
        'lastDetails'
      );
    }
  }, [props.versionList]);
  useEffect(() => {
    if (!props.current) {
      return;
    }
    getLastVersionDetails(props.current, 'curDetails');
  }, [props.current]);
  const getLastVersionDetails = async (scriptId: number, key: string) => {
    setState({ loading: true });
    const {
      data: { data, success }
    } = await ScriptManageService.queryScript({
      scriptId
    });
    if (data && success) {
      setState({ [key]: data, loading: false });
    }
  };
  return (
    <Spin spinning={state.loading}>
      <div style={{ padding: '24px' }}>
        {state.curDetails && (
          <div className="ft-ct mg-b4x">
            <VersionJMXModal {...props} />
          </div>
        )}
        <Row type="flex" justify="space-around" gutter={48}>
          <Col className="flex-1">
            <DetailsCard details={state.lastDetails} />
          </Col>
          {state.curDetails && (
            <Col className="flex-1">
              <DetailsCard details={state.curDetails} />
            </Col>
          )}
        </Row>
      </div>
    </Spin>
  );
};
export default VersionDetails;

const DetailsCard: React.FC<{ details: any }> = ({ details }) => {
  if (!details) {
    return null;
  }
  const titleMap = [
    {
      label: '脚本名称',
      key: VersionHistoryEnum.脚本名称
    },
    {
      label: '关联业务',
      key: VersionHistoryEnum.关联业务
    },
    {
      label: '脚本类型',
      key: VersionHistoryEnum.脚本类型,
      render: text => {
        return text !== undefined && text !== null
          ? ScriptTypeEnum[text]
          : '--';
      }
    }
  ];
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...defaultColumnProps,
        title: '文件名称',
        dataIndex: VersionHistoryEnum.文件名称,
        render: text => renderToolTipItem(text, 15)
      },
      {
        ...defaultColumnProps,
        title: '文件类型',
        dataIndex: VersionHistoryEnum.文件类型,
        render: text => FileTypeEnum[text]
      },
      {
        ...defaultColumnProps,
        title: '文件数据量（条）',
        dataIndex: VersionHistoryEnum.文件数据量
      },
      {
        ...defaultColumnProps,
        title: '是否拆分',
        dataIndex: VersionHistoryEnum.是否拆分,
        render: text =>
          text !== null && text !== undefined ? (text ? '是' : '否') : '--'
      },
      {
        ...defaultColumnProps,
        title: '更新时间',
        dataIndex: VersionHistoryEnum.更新时间
      }
    ];
  };
  return (
    <Fragment>
      <Card
        title={
          <Title style={{ margin: 0 }} level={4} className="ft-ct">
            版本{details[VersionHistoryEnum.版本名]}
          </Title>}
        style={{ boxShadow: '0 0 10px 2px #eee' }}
      >
        {titleMap.map(item => (
          <div
            key={item.key}
            className="ft-14"
            style={{ marginBottom: '16px' }}
          >
            {item.label}：
            <span className="mg-l1x">
              {item.render
                ? item.render(details[item.key])
                : details[item.key] || '--'}
            </span>
          </div>
        ))}
        <CommonTable
          columns={getColumns()}
          dataSource={details.relatedFiles}
          rowKey={(row, index) => index.toString()}
        />
      </Card>
    </Fragment>
  );
};
