/**
 * @name
 * @author MingShined
 */
import { Col, List, Row } from 'antd';
import React, { useEffect } from 'react';
import { VersionHistoryEnum } from '../enum';
import ScriptManageService from '../service';
import { VersionHistoryChildrenProps } from '../versionPage';

const VersionList: React.FC<VersionHistoryChildrenProps> = props => {
  useEffect(() => {
    queryList();
  }, []);
  const queryList = async () => {
    const {
      data: { data, success }
    } = await ScriptManageService.queryScriptList({
      scriptId: props.id
    });
    if (success) {
      props.setState({ versionList: data });
    }
  };
  const handleClick = (current: number, index: number) => {
    if (!index) {
      return;
    }
    props.setState({ current });
  };
  return (
    <List
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        overflow: 'auto',
        borderRight: '1px solid #ddd',
        boxShadow: '8px 4px 12px 3px #eee'
      }}
    >
      {props.versionList.map((item, index) => (
        <List.Item
          style={{
            flexDirection: 'column',
            alignItems: 'initial',
            padding: '8px',
            cursor: index ? 'pointer' : 'not-allowed',
            background: props.current === item[VersionHistoryEnum.ID] && '#eee',
            color: !index && 'gray'
          }}
          key={item[VersionHistoryEnum.ID]}
          onClick={() => handleClick(item[VersionHistoryEnum.ID], index)}
        >
          <div>版本{item[VersionHistoryEnum.版本名]}</div>
          <Row type="flex" justify="space-between">
            <Col>{item[VersionHistoryEnum.操作人]}</Col>
            <Col>{item[VersionHistoryEnum.时间]}</Col>
          </Row>
        </List.Item>
      ))}
    </List>
  );
};
export default VersionList;
