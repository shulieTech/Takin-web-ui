/**
 * @name
 * @author MingShined
 */
import { Card, Col, Row, Spin } from 'antd';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import { VersionHistoryEnum } from '../enum';
import ScriptManageService from '../service';
import { VersionHistoryChildrenProps } from '../versionPage';

const VersionJMXModal: React.FC<VersionHistoryChildrenProps> = props => {
  const [state, setState] = useStateReducer({
    list: [],
    loading: false
  });
  const getInfo = async () => {
    setState({ loading: true });
    const lastVersionId = props.versionList[0][VersionHistoryEnum.ID];
    const {
      data: { data, success }
    } = await ScriptManageService.getJMXScript({
      scriptManageDeployIds: `${lastVersionId},${props.current}`
    });
    if (success) {
      setState({
        loading: false,
        list: data.reverse()
      });
    }
  };
  const getVersionName = (id: number) => {
    return props.versionList.find(item => item[VersionHistoryEnum.ID] === id)[
      VersionHistoryEnum.版本名
];
  };
  return (
    <Fragment>
      <CommonModal
        modalProps={{
          footer: null,
          destroyOnClose: true,
          width: 960,
          title: '版本对比',
          bodyStyle: { height: 700, overflow: 'auto' }
        }}
        onClick={getInfo}
        btnText="对比jmx脚本"
        btnProps={{ type: 'primary' }}
      >
        <Spin spinning={state.loading}>
          <Row type="flex" gutter={48}>
            {state.list.map(item => (
              <Col span={12} key={item.scriptManageDeployId}>
                <Card
                  // bodyStyle={{ height: 500, overflow: 'auto', width: 'auto' }}
                  title={`版本${getVersionName(item.scriptManageDeployId)}`}
                >
                  {item.content}
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </CommonModal>
    </Fragment>
  );
};
export default VersionJMXModal;
