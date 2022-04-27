import React, { useState, useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import getPressureTestSceneColumns from './components/PressureTestSceneColumn';
import getPressureTestSceneFormData from './components/PressureTestSceneFormData';
import service from './service';
import { message, Modal } from 'antd';
import { Link } from 'umi';

interface Props {}

/**
 * 压测场景回收站列表，复用的是压测场景列表
 * @param props
 * @returns
 */
const RecycleManage: React.FC<Props> = (props) => {
  const [columnState, setColumnState] = useState({
    isReload: false,
    tagReloadKey: 0,
  });
  const setState = (newState = {}) =>
    setColumnState({
      ...columnState,
      ...newState,
    });

  const { columns } = getPressureTestSceneColumns(columnState, setState, {});

  const scenceRecovery = ({ sceneName, id }) => {
    Modal.confirm({
      title: '提示',
      content: (
        <div>
          确定恢复场景 <strong>{sceneName}</strong> ？
        </div>
      ),
      onOk: async () => {
        const {
          data: { data, success },
        } = await service.scenceRecovery({ id });
        if (success) {
          message.success('操作成功');
          setState({
            isReload: !columnState.isReload,
          });
          return Promise.resolve();
        }
        return Promise.reject();
      },
    });
  };

  columns[columns.length - 1].render = (text, record) => {
    return (
      <div>
        <Link
          to={`/pressureTestManage/pressureTestSceneV2/edit?id=${record.id}`}
        >
          查看
        </Link>
        <span className="ant-divider" />
        <a
          onClick={() => {
            scenceRecovery(record);
          }}
        >
          恢复
        </a>
      </div>
    );
  };

  return (
    <SearchTable
      commonTableProps={{
        columns,
      }}
      commonFormProps={{
        formData: getPressureTestSceneFormData({}),
        rowNum: 4,
      }}
      ajaxProps={{ url: '/scenemanage/list?recovery=true', method: 'GET' }}
      toggleRoload={columnState.isReload}
    />
  );
};

export default RecycleManage;
