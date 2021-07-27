import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import React from 'react';
import getShellTagFormData from '../components/ShellTagFormData';
import ShellManageService from '../service';

interface Props {
  btnText?: string | React.ReactNode;
  scriptId?: number | string;
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
const AddShellTagsModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    tagList: [],
    tags: undefined,
    tagsValue: undefined,
    form: null as WrappedFormUtils
  });
  const { scriptId, tags } = props;

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
    queryScriptTagList();
  };

  /**
   * @name 获取标签列表
   */
  const queryScriptTagList = async () => {
    const {
      data: { data, success }
    } = await ShellManageService.queryScriptTagList({});
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
   * @name 新增表单
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        if (values.tagNames && values.tagNames.length > 10) {
          message.error('标签不得添加超过10个');
          resolve(false);
          return false;
        }

        const {
          data: { success, data }
        } = await ShellManageService.addShellTags({
          ...values,
          scriptId,
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
        title: '添加标签'
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
          formData={getShellTagFormData(state, setState)}
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
export default AddShellTagsModal;
