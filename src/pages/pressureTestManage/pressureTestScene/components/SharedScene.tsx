import React, { useState, useEffect, useCallback } from 'react';
import { Input, Modal, message, Tooltip, Divider, Popover } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import SearchTable from 'src/components/search-table';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { getTakinAuthority } from 'src/utils/utils';
import service from '../service';
import styles from '../../../scriptManage/index.less';

interface Props {}

const ShareSenceManage: React.FC<Props> = (props) => {
  const [searchTableRef, setSearchTableRef] = useState<any>();
  const [tableReload, setTableReload] = useState(false);
  const refHandle = useCallback((ref) => setSearchTableRef(ref), []);

  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  const formData = [
    {
      key: 'name',
      label: '',
      node: <Input placeholder="压测场景名称" />,
    },
  ];

  const forkScene = async (row) => {
    const {
      data: { success },
    } = await service.forkScene({
      id: row.id,
    });
    if (success) {
      message.success('操作成功');
      setTableReload(!tableReload);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '压测场景名称',
      dataIndex: 'sceneName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.pressureTestManage_pressureTestScene_2_create
              }
            >
              <CustomPopconfirm
                arrowPointAtCenter
                title="确定复制该场景？"
                onConfirm={() => forkScene(row)}
              >
                <a style={{ marginRight: 8 }}>复制到我的场景</a>
              </CustomPopconfirm>
            </AuthorityBtn>
          </>
        );
      },
    },
  ];

  return (
    <>
      <SearchTable
        ref={refHandle}
        commonTableProps={{
          columns,
        }}
        commonFormProps={{
          formData,
          rowNum: 4,
        }}
        ajaxProps={{ url: '/globalscenemanage/list', method: 'GET' }}
        datekeys={[
          {
            originKey: 'time',
            separateKey: ['lastPtStartTime', 'lastPtEndTime'],
          },
        ]}
        toggleRoload={tableReload}
      />
    </>
  );
};

export default ShareSenceManage;
