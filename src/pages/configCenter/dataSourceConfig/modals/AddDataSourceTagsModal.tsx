import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './../index.less';
import DataSourceConfigService from '../service';
import getDataSourceConfigTagFormData from '../components/DataSourceConfigTagFormData';

interface Props {
  btnText?: string | React.ReactNode;
  datasourceId?: number | string;
  tags?: any[];
  onSccuess?: () => void;
}

interface State {
  isReload?: boolean;
  tagList: any;
  tags: any;
  form: any;
  tagsValue: any;
}
const AddDataSourceTagsModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    tagList: [],
    tags: undefined,
    tagsValue: undefined,
    form: null as WrappedFormUtils
  });
  const { datasourceId, tags } = props;

  const handleClick = () => {
    // queryScriptTagList({ applicationId: appId });
    const tagsArr =
      tags &&
      tags.map((item, k) => {
        return item.id && item.id.toString();
      });
    const tasValueArr =
      tags &&
      tags.map((item, k) => {
        return item.id && item.tagName;
      });
    setState({
      tags: tagsArr ? tagsArr : undefined,
      tagsValue: tasValueArr ? tasValueArr : undefined
    });
    queryDataSourceConfigTagList();
  };

  /**
   * @name 获取标签列表
   */
  const queryDataSourceConfigTagList = async () => {
    const {
      data: { data, success }
    } = await DataSourceConfigService.queryTagList({});
    if (success) {
      setState({
        tagList:
          data &&
          data.map((item, k) => {
            return { label: item.tagName, value: item.id };
          })
      });
    }
  };

  const handleCancle = () => {
    setState({
      tags: undefined
    });
  };

  /**
   * @name 新增标签
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        const {
          data: { success, data }
        } = await DataSourceConfigService.addDataSourceConfigTags({
          ...values,
          datasourceId,
          tagNames: state.tagsValue
        });
        if (success) {
          message.success('操作成功');
          props.onSccuess();
          resolve(true);
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 482,
        title: '添加标签',
        maskClosable: false
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getDataSourceConfigTagFormData(state, setState)}
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false
          }}
          rowNum={1}
          formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
        />
      </div>
    </CommonModal>
  );
};
export default AddDataSourceTagsModal;
