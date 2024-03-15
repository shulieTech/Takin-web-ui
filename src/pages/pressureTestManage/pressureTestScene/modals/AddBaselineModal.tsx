import { DatePicker, Radio, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import React from 'react';
import PressureTestSceneService from '../service';
import { FormDataType } from 'racc/dist/common-form/type';
import moment from 'moment';

interface Props {
  btnText?: string | React.ReactNode;
  sceneId?: number | string;
  tags?: any[];
  onSccuess?: () => void;
}

interface State {
  isReload?: boolean;
  lineTypeEnum: number | string;
  form: any;
  reportList: any;
}
const AddBaselineModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    lineTypeEnum: 1,
    form: null as WrappedFormUtils,
    reportList: []
  });
  const { sceneId, tags } = props;
  const {  RangePicker } = DatePicker;

  const handleClick = () => {
    queryReportList();
  };

  /**
   * @name 获取报告列表
   */
  const queryReportList = async () => {

    const {
      data: { data, success }
    } = await PressureTestSceneService.queryReportList({ id: sceneId });
    if (success) {
      setState({
        reportList: data?.map((item, k) => {
          return {
            label: item,
            value: item
          };
        })
      });
    }
  };

  const handleCancle = () => {
    setState({
      reportList: []
    });
  };

  /**
   * @name 新增性能基线
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        let result = {} as any;
        
        if (values?.baseLineTime) {
          result = {
            ...values,
            sceneId,
            baseLineStartTime: moment(values?.baseLineTime?.[0]).valueOf(),
            baseLineEndTime: moment(values?.baseLineTime?.[1]).valueOf(),
          };
          delete result?.baseLineTime;
        } else {
          result = {
            ...values,
            sceneId,
          };
        };

        const {
          data: { success, data }
        } = await PressureTestSceneService.addBaseLine({
          ...result,    
        });
        if (success) {
          message.success('设置基线成功');
          props.onSccuess();
          resolve(true);
        }
        resolve(false);
      });
    });
  };

  const getFormData = (): FormDataType[] => {
  
    const dynamicFormData: FormDataType[] = [];
    // Conditionally add form data based on lineTypeEnum
    if (state.lineTypeEnum === 1) {
      dynamicFormData.push({
        key: 'baseLineTime',
        label: '时间范围',
        options: {
          initialValue: undefined,
          rules: [
            {
              required: true,
              message: '请输入时间',
            },
          ],
        },
        node: (
          <RangePicker style={{ width: 'calc(100%)' }} showTime format="YYYY-MM-DD HH:mm:ss" />
      ),
      });
    } else if (state.lineTypeEnum === 2) {
      dynamicFormData.push({
        key: 'reportId',
        label: '报告id',
        options: {
          initialValue: undefined,
          rules: [
            {
              required: true,
              message: '请选择报告ID',
            },
          ],
        },
        node: (
          <CommonSelect
            style={{ width: 250 }}
            placeholder="请选择报告id"
            dataSource={state?.reportList || []}
            allowClear
            optionFilterProp="children"
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().includes(input.toLowerCase())
            }
          />
        ),
      });
    }
  
    // Always include lineTypeEnum form field
    const basicFormData: FormDataType[] = [
      {
        key: 'lineTypeEnum',
        label: '基线类型',
        options: {
          initialValue: state.lineTypeEnum,
          rules: [
            {
              required: false,
              message: '请输入场景标签',
            },
          ],
        },
        node: (
          <Radio.Group onChange={e => setState({ lineTypeEnum: e.target.value })}>
            <Radio value={1}>根据时间范围</Radio>
            <Radio value={2}>根据过去的报告</Radio>
          </Radio.Group>
        ),
      },
    ];
  
    return [...basicFormData, ...dynamicFormData];
  };
  
  return (
    <CommonModal
      modalProps={{
        width: 482,
        title: '设置性能基线'
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
          formData={getFormData()}
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
export default AddBaselineModal;
