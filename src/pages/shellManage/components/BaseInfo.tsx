/**
 * @name 步骤1-基本信息
 */

import React from 'react';

import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { FormDataType } from 'racc/dist/common-form/type';
import { Divider, Input, message, Popover } from 'antd';
import CodeMirrorWrapper from './CodeMirrorWrapper';
import copy from 'copy-to-clipboard';
import styles from './../index.less';
import { CommonSelect } from 'racc';
import ShellManageService from '../service';

const BaseInfo = (state, setState, props): FormCardMultipleDataSourceBean => {
  /** @name 基本信息 */
  const getBaseInfoFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action, id, scriptDeployId } = query;

    const { detailData, shellDemoList } = state;

    const handleCopy = async copyValue => {
      if (copy(copyValue)) {
        message.success('复制成功');
      } else {
        message.error('复制失败');
      }
    };

    const handleChangeVersion = async value => {
      const {
        data: { success, data }
      } = await ShellManageService.queryShellScriptCode({
        scriptId: id,
        version: value
      });
      if (success) {
        setState({
          detailData: {
            ...state.detailData,
            description: data.description,
            content: data.content
          },
          scriptDeployId: data.scriptManageDeployId
        });
      }
    };

    if (action === 'edit') {
      return [
        {
          key: 'scriptName',
          label: '脚本名称',
          options: {
            initialValue: action !== 'add' ? detailData.scriptName : undefined,
            rules: [
              { required: true, message: '请输入正确的脚本名称', max: 16 }
            ]
          },
          formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
          node: (
            <Input
              placeholder="请输入(最多16个字符)"
              disabled={action !== 'add' ? true : false}
            />
          )
        },
        {
          key: 'description',
          label: '脚本描述',
          options: {
            initialValue: action !== 'add' ? detailData.description : undefined,
            rules: [
              { required: false, message: '请输入正确的脚本描述', max: 200 }
            ]
          },
          formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
          node: <Input.TextArea placeholder="请输入脚本描述（最多200个字符）" />
        },
        {
          key: 'scriptVersion',
          label: '脚本版本',
          options: {
            initialValue:
              action !== 'add' ? detailData.scriptVersion : undefined,
            rules: [{ required: false, message: '请选择脚本' }]
          },
          formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
          node: (
            <CommonSelect
              dataSource={detailData.versions || []}
              allowClear={false}
              onChange={handleChangeVersion}
              onRender={item => (
                <CommonSelect.Option key={item.value} value={item.value}>
                  {item.label}
                </CommonSelect.Option>
              )}
            />
          )
        },
        {
          key: 'content',
          label: (
            <span
              style={{
                fontSize: 14,
                position: 'relative',
                display: 'inline-block',
                height: 100
              }}
            >
              脚本代码
              <Popover
                placement="bottom"
                trigger="click"
                title="脚本样例"
                content={
                  <div className={styles.shellDemoWrap}>
                    {shellDemoList &&
                      shellDemoList.map((item, k) => {
                        return (
                          <p key={k}>
                            {item.name}
                            <a
                              style={{ float: 'right', marginRight: 8 }}
                              onClick={() => handleCopy(item.content)}
                            >
                              复制
                            </a>

                            <Divider />
                          </p>
                        );
                      })}
                  </div>}
              >
                <a
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 30,
                    color: '#888',
                    textDecoration: 'underline'
                  }}
                >
                  样例
                </a>
              </Popover>
            </span>
          ),
          options: {
            initialValue: action !== 'add' ? detailData.content : undefined,
            rules: [{ required: true, message: '请输入脚本代码' }]
          },
          formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
          node: (
            <CodeMirrorWrapper
              action={action}
              scriptId={id}
              version={detailData.scriptVersion}
              versionsList={detailData.versions ? detailData.versions : []}
            />
          )
        }
      ];
    }

    return [
      {
        key: 'scriptName',
        label: '脚本名称',
        options: {
          initialValue: action !== 'add' ? detailData.scriptName : undefined,
          rules: [{ required: true, message: '请输入正确的脚本名称', max: 16 }]
        },
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
        node: (
          <Input
            placeholder="请输入(最多16个字符)"
            disabled={action !== 'add' ? true : false}
          />
        )
      },
      {
        key: 'description',
        label: '脚本描述',
        options: {
          initialValue: action !== 'add' ? detailData.description : undefined,
          rules: [{ required: false, message: '请输入脚本描述' }]
        },
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
        node: <Input.TextArea placeholder="请输入脚本描述" />
      },
      {
        key: 'content',
        label: (
          <span
            style={{
              fontSize: 14,
              position: 'relative',
              display: 'inline-block',
              height: 100
            }}
          >
            脚本代码
            <Popover
              placement="bottom"
              trigger="click"
              title="脚本样例"
              content={
                <div className={styles.shellDemoWrap}>
                  {shellDemoList &&
                    shellDemoList.map((item, k) => {
                      return (
                        <p key={k}>
                          {item.name}
                          <a
                            style={{ float: 'right', marginRight: 8 }}
                            onClick={() => handleCopy(item.content)}
                          >
                            复制
                          </a>
                          <Divider />
                        </p>
                      );
                    })}
                </div>}
            >
              <a
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 30,
                  color: '#888',
                  textDecoration: 'underline'
                }}
              >
                样例
              </a>
            </Popover>
          </span>
        ),
        options: {
          initialValue: action !== 'add' ? detailData.content : undefined,
          rules: [{ required: true, message: '请输入脚本代码' }]
        },
        formItemProps: { labelCol: { span: 2 }, wrapperCol: { span: 16 } },
        node: <CodeMirrorWrapper action={action} />
      }
    ];
  };

  return {
    title: '基础信息',
    rowNum: 1,
    span: 24,
    formData: getBaseInfoFormData()
  };
};

export default BaseInfo;
