import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import { Button, Col, Icon, message, Row } from 'antd';
import BusinessActivityService from '../service';

const getDataSourceFormData = (
  state,
  setState,
  action,
  datasourceId
): FormDataType[] => {
  const handleChange = (value, option) => {
    setState({
      tags: value,
      tagsValue: option.map((item, k) => {
        return item.props.children;
      })
    });
  };
  const { dataSourceDetail } = state;

  const handleDebug = async () => {
    state.form.validateFields(async (err, values) => {
      if (err) {
        message.error('请检查表单必填项');
        return false;
      }
      setState({
        loading: true
      });
      const {
        data: { success, data }
      } = await BusinessActivityService.debugSql({
        datasourceId,
        ...values,
        sqls: values.sqls.split('\n')
      });
      if (success) {
        setState({
          debugStatus: true,
          loading: false,
          debugPassed: data.passed,
          info: data.passed ? '连接成功！' : data.errorMessage
        });
        return;
      }
      setState({
        loading: false,
        debugPassed: null
      });
    });
  };

  const iconColor =
    state.debugStatus === true && state.debugPassed === true
      ? '#11BBD5'
      : state.debugStatus === true && state.debugPassed === false
      ? '#EA5B3C'
      : '#595959';

  const basicFormData = [
    {
      key: 'datasourceId',
      label: '数据源',
      options: {
        initialValue:
          action === 'edit'
            ? dataSourceDetail && dataSourceDetail.datasourceId
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择数据源'
          }
        ]
      },
      node: (
        <CommonSelect
          style={{ width: 250 }}
          placeholder="请选择数据源"
          showSearch
          optionFilterProp="children"
          dataSource={(state && state.dataSourceList) || []}
          onRender={item => (
            <CommonSelect.Option key={item.value} value={item.value}>
              {item.label}
            </CommonSelect.Option>
          )}
        />
      )
    },
    {
      key: 'sqls',
      label: '验证命令',
      options: {
        initialValue:
          action === 'edit'
            ? dataSourceDetail &&
              dataSourceDetail.sqls &&
              dataSourceDetail.sqls.join('\n')
            : undefined,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '请输入验证命令'
          }
        ]
      },
      node: (
        <CodeMirrorWrapper
          mode="sql"
          // tslint:disable-next-line: max-line-length
          placeholder={`根据压测数据所在的库表以及标识设置查询语句，模板："SELECT field_name FROM table_name where field_name LIKE 'PT_%' limit 1;"，可输入多个命令，使用换行分隔。"`}
        />
      )
    },
    {
      key: 'debugStatus',
      label: '调试',
      options: {
        initialValue: state.debugStatus,
        rules: [
          {
            required: false,
            message: '保存前请先进行调试'
          }
        ]
      },
      node: (
        <Row type="flex" justify="start" align="middle">
          <Col>
            <Button loading={state.loading} onClick={handleDebug}>
              调试
            </Button>
          </Col>
          <Col>
            <Row type="flex" align="middle" justify="start">
              <Icon
                type="info-circle"
                style={{ color: iconColor, marginLeft: 16, marginRight: 8 }}
              />
              <span style={{ color: iconColor, lineHeight: '12px' }}>
                {state.info}
              </span>
            </Row>
          </Col>
        </Row>
      )
    }
  ];
  return basicFormData;
};
export default getDataSourceFormData;
