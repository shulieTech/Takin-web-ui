/**
 * @name
 * @author chuxu
 */
import {
  Button,
  Popconfirm,
  message
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { customColumnProps } from 'src/components/custom-table/utils';
import { MapBtnAuthority } from 'src/utils/utils';
import { BigDataBean } from '../enum';
import { BigDataConfigState } from '../indexPage';
import EditModal from '../modals/EditModal';
import BigDataService from '../service';

const getColumns = (
  state: BigDataConfigState,
  setState: (state: Partial<BigDataConfigState>) => void
): ColumnProps<any>[] => {

  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await BigDataService.deleteConfig({ id });
    if (success) {
      message.success('删除成功');
      setState({
        reload: !state.reload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: '序号',
      dataIndex: 'order',
      render: (text, row, index) => index + 1
    },
    {
      ...customColumnProps,
      title: 'key',
      dataIndex: BigDataBean.key
    },
    {
      ...customColumnProps,
      title: '说明',
      dataIndex: BigDataBean.说明
    },
    {
      ...customColumnProps,
      title: 'value',
      dataIndex: BigDataBean.value
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: BigDataBean.最后修改时间
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'actions',
      render: (text, row) => (
        <Fragment>
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_bigDataConfig_3_update')}
          >
            <EditModal
              btnText="修改"
              onSuccess={() => setState({ reload: !state.reload })}
              details={row}
              id={row.id}
            />
          </AuthorityBtn>
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_bigDataConfig_4_delete')}
          >
            <Popconfirm
              onConfirm={() => handleDelete(row.id)}
              title="确认删除吗?"
            >
              <Button className="mg-l1x" type="link">
                删除
                </Button>
            </Popconfirm>
          </AuthorityBtn>
        </Fragment>
      )
    }
  ];
};

export default getColumns;
