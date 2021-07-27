/**
 * @name
 * @author chuxu
 */
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { CommonModal, useStateReducer } from 'racc';
import React from 'react';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { CommonModelState } from 'src/models/common';

interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  onSuccess: () => void;
  applicationId: string;
  dataSource: any[];
}
const AssertModal: React.FC<Props> = props => {
  const text = '断言详情';

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '断言名称',
        dataIndex: 'assertName'
      },
      {
        ...customColumnProps,
        title: '断言失败异常',
        dataIndex: 'assertMessage'
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        title: text,
        width: 720,
        destroyOnClose: true,
        footer: null
      }}
      btnText={props.btnText}
      btnProps={{ type: 'link' }}
    >
      <div style={{ maxHeight: 400, overflow: 'scroll' }}>
        <CustomTable
          columns={getColumns()}
          dataSource={props.dataSource || []}
        />
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(AssertModal);
