import React, { Fragment } from 'react';
import { CommonSelect } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import { Button, Col, Icon, Input, message, Row, Tooltip } from 'antd';
import DataSourceConfigService from '../service';
import { trimObj } from 'src/utils/utils';

const getAddDataSourceConfigFormData = (
  state,
  setState,
  action,
  dictionaryMap
): FormDataType[] => {
  const { detailData } = state;

  const handleChange = (value, option) => {
    setState({});
  };

  const handleDebug = async () => {
    state.form.validateFields(async (err, values) => {
      if (err) {
        message.error('请检查表单必填项');
        return false;
      }
      setState({
        loading: true,
      });
      const {
        data: { success, data },
      } = await DataSourceConfigService.debugDataSource({ ...trimObj(values) });
      if (success) {
        setState({
          debugStatus: true,
          loading: false,
          debugPassed: data.passed,
          info: data.passed ? '连接成功！' : data.errorMessage,
        });
        return;
      }
      setState({
        loading: false,
        debugPassed: null,
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
      key: 'datasourceName',
      label: '数据源名称',
      options: {
        initialValue:
          action === 'edit'
            ? detailData && detailData.datasourceName
            : undefined,
        rules: [
          {
            required: true,
            message: '请输入正确数据源名称',
            max: 20,
            whitespace: true,
          },
        ],
      },
      node: <Input placeholder="请输入数据源名称，最多20个字符" />,
    },
    {
      key: 'type',
      label: '数据库类型',
      options: {
        initialValue:
          action === 'edit'
            ? detailData &&
              (detailData.type || detailData.type === 0) &&
              `${detailData.type}`
            : undefined,
        rules: [
          {
            required: true,
            message: '请选择数据库类型',
          },
        ],
      },
      node: (
        <CommonSelect
          placeholder="请选择数据库类型"
          dataSource={
            (dictionaryMap && dictionaryMap.VERIFY_DATASOURCE_TYPE) || []
          }
        />
      ),
    },
    {
      key: 'jdbcUrl',
      label: (
        <span>
          数据源地址
          <Tooltip title="示例：jdbc:mysql://192.168.1.102:3306/easydemo_db">
            <Icon type="question-circle" style={{ cursor: 'pointer', marginLeft: 4 }}/>
          </Tooltip>
        </span>
      ),
      options: {
        initialValue:
          action === 'edit' ? detailData && detailData.jdbcUrl : undefined,
        rules: [
          {
            required: true,
            message: '请输入正确数据源地址',
            whitespace: true,
          },
        ],
      },
      node: <Input placeholder="请输入数据源地址（不可重复添加）" />,
    },
    {
      key: 'username',
      label: '用户名',
      options: {
        initialValue:
          action === 'edit' ? detailData && detailData.username : undefined,
        rules: [
          {
            required: true,
            message: '请输入用户名',
            whitespace: true,
          },
        ],
      },
      node: <Input placeholder="请输入用户名" autoComplete="off"/>,
    },
    {
      key: 'password',
      label: '密码',
      options: {
        initialValue: action === 'edit' ? undefined : undefined,
        rules: [
          {
            required: true,
            message: '请输入密码',
            whitespace: true,
          },
        ],
      },
      node: (
        <Input placeholder="请输入密码" type="password" autoComplete="off" />
      ),
    },
    {
      key: 'debugStatus',
      label: '测试连接',
      options: {
        initialValue: state.debugStatus,
        rules: [
          {
            required: false,
            message: '保存前请先测试连接有效性',
          },
        ],
      },
      node: (
        <div>
          <Button loading={state.loading} onClick={handleDebug}>
            测试连接
          </Button>
          <div>
            <Icon
              type="info-circle"
              style={{ color: iconColor, marginRight: 8 }}
            />
            <span style={{ color: iconColor, lineHeight: '12px' }}>
              {state.info}
            </span>
          </div>
        </div>
      ),
    },
  ];
  return basicFormData;
};
export default getAddDataSourceConfigFormData;
