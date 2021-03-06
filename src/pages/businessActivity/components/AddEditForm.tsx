/**
 * @name
 * @author MingShined
 */
import { Input, Select } from 'antd';
import { connect } from 'dva';
import { CommonForm, CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useEffect } from 'react';
import BusinessSelect from 'src/common/business-select';
import { CommonModelState } from 'src/models/common';
import { ActivityBean } from '../enum';
import styles from '../index.less';
import { AddEditActivityModalState } from '../modals/AddEditActivityModal';
import DomainManageModal from '../modals/DomainManageModal';
import BusinessActivityService from '../service';
import { debounce } from 'lodash';

interface AddEditFormProps extends CommonModelState, AddEditActivityModalState {
  setState: (state: Partial<AddEditActivityModalState>) => void;
  isVirtual?: boolean;
  details: any;
}
const AddEditForm: React.FC<AddEditFormProps> = props => {
  const { setState, app, serviceType, form, details = {} } = props;
  const disabled = !props.app;

  useEffect(() => {
    if (app && serviceType) {
      queryServiceList();
    }
  }, [app, serviceType]);
  const queryServiceList = async (inputVal = undefined) => {
    const {
      data: { data, success }
    } = await BusinessActivityService.queryServiceList({
      serviceName: inputVal,
      applicationName: app,
      type: serviceType
    });
    if (success) {
      // @ts-ignore 如果下拉框列表有分页，详情中的初始值在下拉框中没有，插入这条数据
      if ((!inputVal) && details.linkId && details.entranceName && !data.some(x => x.value === details.linkId)) {
        setState({
          // @ts-ignore
          serviceList: [{ label: details.entranceName, value: details.linkId }].concat(data)
        });
      } else {
        setState({ serviceList: data });
      }
    }
  };
  const getFormData = (): FormDataType[] => {
    const basicForm = [
      {
        key: ActivityBean.业务活动名称,
        label: '业务活动名称',
        options: {
          rules: [{ required: true, whitespace: true, message: '请填写业务活动名称' }],
          initialValue: props.systemName
        },
        node: <Input style={{ fontSize: 12 }} placeholder="业务活动名称" />
      },
      {
        key: ActivityBean.业务活动类型,
        label: '业务活动类型',
        options: {
          rules: [{ required: false, message: '请选择业务活动类型' }],
          initialValue: props.isCore ? props.isCore : undefined
        },
        node: (
          <CommonSelect
            placeholder="请选择业务活动类型"
            showSearch
            dataSource={props.dictionaryMap && props.dictionaryMap.isCore}
            optionFilterProp="children"
          />
        )
      },
      {
        key: ActivityBean.业务活动级别,
        label: '业务活动级别',
        options: {
          rules: [{ required: false, message: '请选择业务活动级别' }],
          initialValue: props.link_level ? props.link_level : undefined
        },
        node: (
          <CommonSelect
            placeholder="请选择业务活动级别"
            showSearch
            dataSource={props.dictionaryMap && props.dictionaryMap.link_level}
            optionFilterProp="children"
          />
        )
      },
      {
        key: ActivityBean.业务域,
        label: (
          <span>
            业务域 <DomainManageModal />
          </span>
        ),
        options: {
          rules: [{ required: false, message: '请选择业务域' }],
          initialValue:
            typeof props.businessDomain === 'string'
              ? +props.businessDomain
              : props.businessDomain ?? undefined
        },
        node: (
          // <CommonSelect
          //   style={{ flex: 1 }}
          //   placeholder="请选择业务域"
          //   showSearch
          //   // dataSource={props.dictionaryMap && props.dictionaryMap.domain}
          //   dataSource={props.domains}
          //   optionFilterProp="children"
          // />
          // CommonSelect会把值都转成了字符串，所以还是改用Select
          <Select
            placeholder="请选择业务域"
            showSearch
            optionFilterProp="children"
            allowClear
          >
            {props.domains.map(x => (
              <Select.Option key={x.value} value={x.value}>
                {x.label}
              </Select.Option>
            ))}
          </Select>
        )
      }
    ];
    const businessForm = [
      {
        key: ActivityBean.所属应用,
        label: '应用',
        options: {
          rules: [{ required: true, message: '请选择应用' }],
          initialValue: props.app,
        },
        node: (
          <BusinessSelect
            onChange={(value: any, options: any) => {
              setState({
                app: value,
                appName: options && options.props.children,
                service: undefined,
              });
              form.resetFields([
                ActivityBean.服务类型,
                ActivityBean['服务/入口'],
              ]);
            }}
            url="/application/names"
            placeholder="请选择应用"
            showSearch
            optionFilterProp="children"
            onLoad={() => setState({ loading: false })}
            dropdownClassName={styles.select}
          />
        ),
      },
      {
        key: ActivityBean.服务类型,
        label: '服务类型',
        options: {
          rules: [{ required: true, message: '请选择服务类型' }],
          initialValue: props.serviceType || 'HTTP',
        },
        node: (
          <BusinessSelect
            url="/application/entrances/types"
            onChange={(_serviceType) => {
              setState({ serviceType: _serviceType, service: undefined });
              form.resetFields([ActivityBean['服务/入口']]);
            }}
            disabled={disabled}
            placeholder="请选择服务类型"
            showSearch
            optionFilterProp="children"
            dropdownClassName={styles.select}
          />
        ),
      },
      {
        key: ActivityBean['服务/入口'],
        label: '服务',
        options: {
          rules: [{ required: true, message: '请选择服务' }],
          initialValue: props.service,
        },
        node: (
          <CommonSelect
            dataSource={props.serviceList}
            onChange={(service, options: any) => {
              setState({
                service,
                serviceName: Array.isArray(options?.props?.children)
                  ? options?.props?.children[options?.props?.children.length - 1]
                  : options?.props?.children,
              });
            }}
            placeholder="请选择服务"
            showSearch
            onSearch={debounce((val) => {
              queryServiceList(val);
            }, 500)}
            disabled={disabled}
            filterOption={false}
            // optionFilterProp="children"
            dropdownClassName={styles.select}
            optionLabelProp="label"
            onRender={(item, index) => {
              // 在下拉框中显示restful tag
              const isRestful =
                item.label.includes('*') || /\{.*\}/.test(item.label);
              return (
                <Select.Option key={item.value} value={item.value} label={item.label}>
                  {isRestful && (
                    <span
                      style={{
                        color: 'var(--BrandPrimary-500, #3BD9FF)',
                        backgroundColor: '#EEF8F8',
                        fontSize: 12,
                        marginRight: 4,
                        padding: '2px 4px',
                      }}
                    >
                      Restful
                    </span>
                  )}
                  {item.label}
                </Select.Option>
              );
            }}
          />
        ),
      },
    ];

    const virtualBusinessForm = [
      {
        key: ActivityBean.服务类型,
        label: '服务类型',
        options: {
          rules: [{ required: true, message: '请选择服务类型' }],
          initialValue: props.serviceType
        },
        node: (
          <BusinessSelect
            url="/application/entrances/types"
            placeholder="请选择服务类型"
            showSearch
            optionFilterProp="children"
            dropdownClassName={styles.select}
          />
        )
      },
      {
        key: ActivityBean.虚拟入口,
        label: '虚拟入口',
        options: {
          rules: [{ required: true, whitespace: true, message: '请输入虚拟入口' }],
          initialValue: props.virtualEntrance
        },
        node: <Input placeholder="请与脚本里的path保持一致" />
      }
    ];

    if (props.isVirtual) {
      return basicForm.concat(virtualBusinessForm);
    }
    return basicForm.concat(businessForm);
  };
  return (
    <Fragment>
      <CommonForm
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={f => setState({ form: f })}
        formItemProps={{
          labelCol: { span: 7 },
          wrapperCol: { span: 15, push: 1 }
        }}
        rowNum={1}
        formData={getFormData()}
      />
    </Fragment>
  );
};
export default connect(({ common }) => ({ ...common }))(AddEditForm);
