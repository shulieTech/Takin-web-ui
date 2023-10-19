/**
 * @name 步骤1-基本信息
 */

import React from 'react';

import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { FormDataType } from 'racc/dist/common-form/type';
import SLAConfigStopTable from './SLAConfigStopTable';
import styles from './../index.less';
import { Tooltip, Icon } from 'antd';

interface Props {}

const SLAConfig = (state, setState, props): FormCardMultipleDataSourceBean => {
  const getSLAConfigFormData = (): FormDataType[] => {
    const { location, dictionaryMap } = props;
    const { query } = location;
    const { action } = query;
    const { detailData } = state;

    const stopInitList = [
      {
        ruleName: undefined,
        businessActivity: undefined,
        rule: {
          indexInfo: undefined,
          condition: undefined,
          during: undefined,
          times: undefined
        }
      }
    ];

    const warningInitList = [
      {
        ruleName: undefined,
        businessActivity: undefined,
        rule: {
          indexInfo: undefined,
          condition: undefined,
          during: undefined,
          times: undefined
        }
      }
    ];
    return [
      {
        key: 'stopCondition',
        label: '',
        options: {
          initialValue:
            action !== 'add' ? detailData.stopCondition : stopInitList,
          rules: [{ required: true, message: '请设置终止条件' }]
        },
        formItemProps: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        node: (
          <SLAConfigStopTable
            state={state}
            dictionaryMap={dictionaryMap}
            title={
              <span className={styles.cardTitle}>
                终止条件
                <span style={{ color: '#F7917A', marginLeft: 10 }}>
                  为保证安全压测，建议所有业务活动需配置含「RT」和「成功率」的终止条件
                </span>
              </span>}
          />
        )
      },
      {
        key: 'warningCondition',
        label: '',
        options: {
          initialValue:
            action !== 'add'
              ? detailData.warningCondition &&
                detailData.warningCondition.length > 0
                ? detailData.warningCondition
                : warningInitList
              : warningInitList,
          rules: [{ required: false, message: '请设置告警条件' }]
        },
        formItemProps: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        node: (
          <SLAConfigStopTable
            state={state}
            dictionaryMap={dictionaryMap}
            title={<span className={styles.cardTitle}>告警条件</span>}
          />
        )
      }
    ];
  };

  return {
    title: (
      <span style={{ fontSize: 16 }}>
        SLA配置
        <Tooltip
          title="服务等级协议 SLA（Service Level Agreement）是判定压测是否异常的重要依据。请为各业务活动设置 SLA，从而监控压测中服务状态、查看异常告警或及时终止压测"
          placement="right"
          trigger="click"
        >
          <Icon type="question-circle" style={{ marginLeft: 4 }} />
        </Tooltip>
      </span>
    ),
    rowNum: 1,
    span: 24,
    formData: getSLAConfigFormData()
  };
};

export default SLAConfig;
