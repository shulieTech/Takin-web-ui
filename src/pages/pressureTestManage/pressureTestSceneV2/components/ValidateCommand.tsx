import React, { useEffect, useState } from 'react';
import { Table, Collapse, Empty } from 'antd';
import services from '../service';

const { Panel } = Collapse;

const ValidateCommand = (props) => {
  const { value = {}, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { businessActivityIds } = componentProps;
  const [missingDataScriptList, setMissingDataScriptList] = useState([]);

  /**
   * @name 获取漏数验证命令
   */
  const queryMissingDataScriptList = async (values) => {
    const {
      data: { success, data },
    } = await services.queryMissingDataScriptList(values);
    if (success) {
      setMissingDataScriptList(data);
    }
  };

  useEffect(() => {
    if (businessActivityIds && businessActivityIds.length > 0) {
      queryMissingDataScriptList({ businessActivityIds });
    }
  }, [JSON.stringify(businessActivityIds)]);

  if (!businessActivityIds) {
    return (
      <span style={{ textAlign: 'left', display: 'inline-block' }}>
        <Empty description={'请先选择业务活动或业务流程'} />
      </span>
    );
  }

  if (!(missingDataScriptList.length > 0)) {
    return (
      <span style={{ textAlign: 'left', display: 'inline-block' }}>
        <Empty description={<div>当前业务活动/业务流程暂未配置数据验证脚本，<br/>请先前往业务活动配置数据验证脚本</div>} />
      </span>
    );
  }

  return (
    <Collapse>
      {missingDataScriptList.map((x) => {
        return (
          <Panel
            key={x.jdbcUrl}
            header={<div style={{ position: 'relative' }}>
              <div>{x.datasourceName}</div>
              url: {x.jdbcUrl}
            </div>}
          >
            <Table
              defaultExpandAllRows
              dataSource={x.sqlResponseList}
              columns={[
                {
                  title: '序号',
                  dataIndex: 'order',
                  width: 80,
                },
                {
                  title: '命令',
                  dataIndex: 'sql',
                },
              ]}
              locale={{
                emptyText:
                  '当前业务活动/业务流程暂未配置数据验证脚本，请先前往业务活动配置数据验证脚本',
              }}
            />
          </Panel>
        );
      })}
    </Collapse>
  );
};

ValidateCommand.isFieldComponent = true;

export default ValidateCommand;
