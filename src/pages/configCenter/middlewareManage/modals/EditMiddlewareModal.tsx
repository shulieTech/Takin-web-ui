import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Input, message, Switch } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import MiddlewareManageService from '../service';
import { MiddlewareBean } from '../enum';
import { connect } from 'dva';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  type: string;
  details: any;
  dictionaryMap?: any;
  id: number;
}

const getInitState = () => ({
  form: null as WrappedFormUtils
});
const EditMiddlewareModal: React.FC<Props> = props => {
  const { details } = props;
  const [state, setState] = useStateReducer(getInitState());
  const { dictionaryMap, id } = props;
  const { MIDDLEWARE_STATUS, MIDDLEWARE_TYPE } = dictionaryMap;

  const getBaseFormData = (): FormDataType[] => {
    return [
      {
        key: MiddlewareBean['Artifact ID'],
        label: 'Artifact ID',
        options: {
          initialValue: details[MiddlewareBean['Artifact ID']],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入Artifact ID'
            }
          ]
        },
        node: <Input placeholder="请输入Artifact ID" disabled={true} />
      },
      {
        key: MiddlewareBean['Group ID'],
        label: 'Group ID',
        options: {
          initialValue: details[MiddlewareBean['Group ID']],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入Group ID'
            }
          ]
        },
        node: <Input placeholder="请输入Group ID" disabled={true} />
      },
      {
        key: MiddlewareBean.类型,
        label: '类型',
        options: {
          initialValue: details[MiddlewareBean.类型],
          rules: [
            {
              required: true,
              message: '请选择类型'
            }
          ]
        },
        node: (
          <CommonSelect
            dataSource={MIDDLEWARE_TYPE || []}
            placeholder="请选择类型"
            disabled={props.type === '2' ? true : false}
          />
        )
      }
    ];
  };

  const getMiddlewareOneFormData = (): FormDataType[] => {
    return [
      {
        key: MiddlewareBean.状态,
        label: '状态',
        options: {
          initialValue: String(details[MiddlewareBean.状态]),
          rules: [
            {
              required: true,
              message: '请选择状态'
            }
          ]
        },
        node: (
          <CommonSelect
            dataSource={MIDDLEWARE_STATUS || []}
            placeholder="请选择状态"
          />
        )
      },
      {
        key: MiddlewareBean.备注,
        label: '备注',
        options: {
          initialValue: details[MiddlewareBean.备注],
          rules: [
            {
              required: false,
              message: '请输入备注，200字以内',
              max: 200
            }
          ]
        },
        node: (
          <Input.TextArea
            style={{ height: 160 }}
            placeholder="请输入备注，200字以内"
          />
        )
      }
    ];
  };

  const getMiddlewareTwoFormData = (): FormDataType[] => {
    return [
      {
        key: MiddlewareBean.版本号,
        label: '版本号',
        options: {
          initialValue: details[MiddlewareBean.版本号],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请输入版本号'
            }
          ]
        },
        node: <Input disabled={true} placeholder="请输入版本号" />
      },
      {
        key: MiddlewareBean.状态,
        label: '状态',
        options: {
          initialValue: String(details[MiddlewareBean.状态]),
          rules: [
            {
              required: true,
              message: '请选择状态'
            }
          ]
        },
        node: (
          <CommonSelect
            dataSource={MIDDLEWARE_STATUS || []}
            placeholder="请选择状态"
          />
        )
      },
      {
        key: MiddlewareBean.备注,
        label: '备注',
        options: {
          initialValue: details[MiddlewareBean.备注],
          rules: [
            {
              required: false,
              message: '请输入备注，200字以内',
              max: 200
            }
          ]
        },
        node: (
          <Input.TextArea
            style={{ height: 160 }}
            placeholder="请输入备注，200字以内"
          />
        )
      }
    ];
  };

  /**
   * @name 中间件编辑
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
          data: { data, success }
        } = await MiddlewareManageService.editMiddleware({
          id,
          ...values
        });
        if (success) {
          message.success('修改中间件成功!');
          props.onSuccess();
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };

  /**
   * @name 中间件详情编辑
   */
  const handleSubmitDetail = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await MiddlewareManageService.editDetailMiddleware({
          id,
          ...values
        });
        if (success) {
          message.success('修改中间件成功!');
          props.onSuccess();
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 600,
        title: '中间件编辑',
        maskClosable: false
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      beforeOk={props.type === '1' ? handleSubmit : handleSubmitDetail}
    >
      <div style={{ position: 'relative' }}>
        <CommonForm
          getForm={form => setState({ form })}
          formData={
            props.type === '1'
              ? getBaseFormData().concat(getMiddlewareOneFormData())
              : getBaseFormData().concat(getMiddlewareTwoFormData())
          }
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false
          }}
          rowNum={1}
        />
      </div>
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(EditMiddlewareModal);
