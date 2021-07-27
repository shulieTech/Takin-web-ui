import React, { Fragment, useEffect } from 'react';
import { CommonForm, useStateReducer, LoadingButton } from 'racc';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import FormCardMultiple from 'src/components/form-card-multiple';
// import BaseInfo from './components/BaseInfo';
import { Button, message } from 'antd';
import { BasePageLayout } from 'src/components/page-layout';
import { connect } from 'dva';
import CustomSkeleton from 'src/common/custom-skeleton';
// import ScriptFileUpload from './components/ScriptFileUpload';
import { router } from 'umi';
import BaseInfo from './components/BaseInfo';
import ShellManageService from './service';
interface Props {
  location?: { query?: any };
  dictionaryMap?: any;
}
interface ShellConfigPageState {
  form: any;
  detailData: any;
  loading: boolean;
  shellDemoList: any;
  isReload: boolean;
  scriptDeployId: string;
  resultStatus: boolean;
}

const ShellConfigPage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<ShellConfigPageState>({
    form: null as WrappedFormUtils,
    detailData: {} as any,
    loading: false,
    shellDemoList: null,
    isReload: false,
    scriptDeployId: null,
    resultStatus: null
  });

  const { location, dictionaryMap } = props;
  const { query } = location;
  const { action, id, scriptDeployId } = query;

  useEffect(() => {
    queryShellScriptDemo();
  }, []);

  useEffect(() => {
    if (action === 'edit') {
      queryPressureTestSceneDetail(id);
    }
  }, [state.isReload]);

  const formDataSource = [BaseInfo(state, setState, props)];

  /**
   * @name 获取shell脚本样例
   */
  const queryShellScriptDemo = async () => {
    const {
      data: { success, data }
    } = await ShellManageService.queryShellScriptDemo({});
    if (success) {
      setState({
        shellDemoList: data
      });
    }
  };

  /**
   * @name 获取shell脚本配置详情
   */
  const queryPressureTestSceneDetail = async value => {
    const {
      data: { success, data }
    } = await ShellManageService.queryShellScript({
      scriptId: value
    });
    if (success) {
      setState({
        detailData: data
      });
    }
  };

  const handleSubmit = async () => {
    state.form.validateFields(async (err, values) => {
      if (err) {
        message.error('请检查表单必填项');
        return false;
      }

      setState({
        loading: true
      });
      /**
       * @name 增加shell脚本
       */
      if (action === 'add') {
        const {
          data: { success, data }
        } = await ShellManageService.addShellScript(values);
        if (success) {
          setState({
            loading: false
          });
          message.success('增加shell脚本成功');
          router.push('/shellManage');
        }
        setState({
          loading: false
        });
      }

      /**
       * @name 编辑shell脚本
       */
      if (action === 'edit') {
        const {
          data: { success, data }
        } = await ShellManageService.editShellScript({
          ...values,
          scriptDeployId: state.scriptDeployId
            ? state.scriptDeployId
            : scriptDeployId
        });
        if (success) {
          setState({
            loading: false
          });
          message.success('编辑脚本配置成功');
          router.push('/shellManage');
        }
        setState({
          loading: false
        });
      }
    });
  };

  return (action !== 'add' && JSON.stringify(state.detailData) !== '{}') ||
    action === 'add' ? (
    <BasePageLayout title={'脚本配置'}>
      <FormCardMultiple
        commonFormProps={{
          rowNum: 1
        }}
        dataSource={formDataSource}
        getForm={form => setState({ form })}
      />

      <Button
        type="primary"
        onClick={() => handleSubmit()}
        loading={state.loading}
      >
        保存
      </Button>
    </BasePageLayout>
  ) : (
    <CustomSkeleton />
  );
};
export default connect(({ common }) => ({ ...common }))(ShellConfigPage);
