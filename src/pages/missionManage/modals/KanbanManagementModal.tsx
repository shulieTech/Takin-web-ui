/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import {
  CommonModal,
  useStateReducer,
  CommonTable,
  defaultColumnProps
} from 'racc';
import { Button, message } from 'antd';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import React, { useEffect, Fragment } from 'react';
import { CommonModelState } from 'src/models/common';
import MissionManageService from '../service';
import NewKanbanModal from './NewKanbanModal';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import styles from '../index.less';
interface Props extends CommonModelState {
  btnText: string;
  onSuccess: () => void;
  applicationId: string;
}
const KanbanManagementModal: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const [state, setState] = useStateReducer({
    dataSource: [],
    total: 0,
    searchParams: {
      current: 0,
      pageSize: 10
    }
  });

  useEffect(() => {
    getDetails();
  }, [state.searchParams]);

  const getDetails = async () => {
    const {
      data: { data, success }
    } = await MissionManageService.queryBoard({ ...state.searchParams });
    if (success) {
      setState({ dataSource: data });
    }
  };

  const handleDelete = async boardId => {
    const {
      data: { data, success }
    } = await MissionManageService.sceneDelete(boardId);
    if (success) {
      message.success('删除成功');
      getDetails();
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...defaultColumnProps,
        title: '看板名称',
        dataIndex: 'patrolBoardName'
      },
      {
        ...defaultColumnProps,
        title: '场景数',
        dataIndex: 'sceneNum'
      },
      {
        ...defaultColumnProps,
        title: '最近更新时间',
        dataIndex: 'modifyTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'
      },
      {
        ...defaultColumnProps,
        title: '操作',
        width: 100,
        render: (text, row) => {
          return (
            <Fragment>
              {row.canEdit && (
                <NewKanbanModal
                  btnText="编辑"
                  id={row.patrolBoardId}
                  row={row}
                  onSuccess={() => {
                    getDetails();
                    setState({
                      searchParams: {
                        current: 0,
                        pageSize: 10
                      }
                    });
                  }}
                />
              )}
              {row.canRemove && (
                <CustomPopconfirm
                  title="是否确定删除？"
                  okColor="var(--FunctionalError-500)"
                  onConfirm={() => handleDelete(row.patrolBoardId)}
                >
                  <Button type="link" style={{ marginLeft: 8 }}>
                    删除
                  </Button>
                </CustomPopconfirm>
              )}
            </Fragment>
          );
        }
      }
    ];
  };

  const handleChange = (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current
      }
    });
  };

  return (
    <CommonModal
      modalProps={{
        title: '看板管理',
        width: 960,
        destroyOnClose: true,
        footer: null
      }}
      btnText={props.btnText}
      btnProps={{ type: 'primary' }}
      onClick={getDetails}
    >
      <div style={{ margin: '-10px 0 15px 91%' }}>
        <AuthorityBtn
          isShow={btnAuthority && btnAuthority.patrolBoard_2_create}
        >
          <NewKanbanModal
            btnText="新增看板"
            onSuccess={() => {
              getDetails();
              setState({
                searchParams: {
                  current: 0,
                  pageSize: 10
                }
              });
            }}
          />
        </AuthorityBtn>
      </div>
      <div className={styles.align}>
        <CommonTable
          columns={getColumns()}
          dataSource={state.dataSource}
          style={{ background: 'none' }}
          pageProps={{
            showSizeChanger: true,
            total: state.dataSource && state.dataSource.length,
            current: state.searchParams.current
          }}
          onPageChange={(current, pageSize) => handleChange(current, pageSize)}
          onPageSizeChange={(current, pageSize) =>
            handleChange(current, pageSize)
          }
        />
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(KanbanManagementModal);
