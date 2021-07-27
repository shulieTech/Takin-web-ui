/**
 * @name 步骤1-基本信息
 */

import React from 'react';

import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { FormDataType } from 'racc/dist/common-form/type';
import { Input, Radio, Icon, message } from 'antd';
import { CommonSelect, ImportFile, CommonTable } from 'racc';
import PressureTestSceneService from '../service';
import getUploadFileColumns from './UploadFileColumn';
import CustomTable from 'src/components/custom-table';

interface Props {
  dictionaryMap?: any;
}

const ScriptFileUpload = (
  state,
  setState,
  props
): FormCardMultipleDataSourceBean => {
  /** @name 基本信息 */
  const getScriptFileUploadData = (): FormDataType[] => {
    const { location, dictionaryMap } = props;
    const { query } = location;
    const { action } = query;

    const { SCRIPT_TYPE } = dictionaryMap;
    const { detailData } = state;

    const handleChange = info => {
      /**
       * @name 已上传的文件列表名
       */
      const fileListName =
        state.fileList &&
        state.fileList.map(item => {
          return item.fileName;
        });

      /**
       * @name 准备上传的文件列表名
       */
      const readyToUploadFileName =
        info.fileList &&
        info.fileList.slice(state.uploadFileNum).map(item => {
          return item.name;
        });

      /**
       * @name 准备上传的文件列表
       */
      const readyToUploadFileList =
        info.fileList && info.fileList.slice(state.uploadFileNum);

      /**
       * @name 判断是否是可接受类型
       */
      function isAcceptType(ext) {
        return ['jar', 'csv', 'jmx'].indexOf(ext.toLowerCase()) !== -1;
      }

      setState({
        uploadFileNum: info.fileList.length
      });

      /**
       * @name 待上传的元素含有不可接受类型
       */
      if (
        readyToUploadFileName.find(item => {
          return !isAcceptType(item.substr(item.lastIndexOf('.') + 1));
        })
      ) {
        message.error('上传的文件含有不可接受类型，请检查后上传');
        return;
      }

      /**
       * @name 待上传的元素超过200M大小
       */
      if (
        readyToUploadFileList.find(item => {
          return item.size / 1024 / 1024 > 200;
        })
      ) {
        message.error('上传的文件大小超过200M，请检查后上传');
        return;
      }

      /**
       * @name 待上传的元素含有重名文件列表
       */
      const equalList = readyToUploadFileName.filter((item, index) => {
        if (
          fileListName
            .filter(item2 => {
              if (item2.isDeleted) {
                return item2;
              }
            })
            .includes(item)
        ) {
          return item;
        }
      });

      if (equalList.length) {
        if (info.file.uid === info.fileList.slice(-1)[0].uid) {
          message.error('不能重复上传文件');
        }
        return;
      }

      const newUploadFileList = info.fileList.slice(state.uploadFileNum);

      const formData = new FormData();
      info.fileList.slice(state.uploadFileNum).map(item => {
        formData.append('file', item.originFileObj);
      });

      setState({
        fileList: state.fileList.concat(newUploadFileList)
      });

      if (info.file.uid === info.fileList.slice(-1)[0].uid && formData) {
        uploadFiles(formData);
      }
    };

    /**
     * @name 上传文件
     */
    const uploadFiles = async files => {
      const {
        data: { data, success }
      } = await PressureTestSceneService.uploadFiles(files);
      if (success) {
        setState({
          fileList: state.fileList.concat(data)
        });
      }
    };

    /**
     * @name 删除新上传文件
     */
    const handleDeleteFiles = async uploadId => {
      const {
        data: { data, success }
      } = await PressureTestSceneService.deleteFiles({ uploadId });
      if (success) {
        message.success('删除文件成功！');
        setState({
          fileList: state.fileList.filter(item => {
            return uploadId !== item.uploadId;
          })
        });
      }
    };

    /**
     * @name 删除上传文件
     */
    const handleDelete = async item => {
      if (item.id) {
        setState({
          fileList: state.fileList.map(item2 => {
            if (item.id === item2.id) {
              return { ...item2, isDeleted: 1 };
            }
            return { ...item2 };
          })
        });
      } else {
        handleDeleteFiles(item.uploadId);
      }
    };

    return [
      {
        key: 'scriptType',
        label: '脚本类型',
        options: {
          initialValue: action !== 'add' ? String(detailData.scriptType) : '0',
          rules: [{ required: true, message: '请选择脚本类型' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        node: (
          <Radio.Group>
            {SCRIPT_TYPE &&
              SCRIPT_TYPE.map((item, k) => {
                return (
                  <Radio key={k} value={item.value}>
                    {item.label}
                  </Radio>
                );
              })}
          </Radio.Group>
        )
      },
      {
        key: 'uploadFile',
        label: '上传文件',
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        options: {
          initialValue: action !== 'add' ? detailData.uploadFile : '',
          rules: [{ required: false, message: '请上传文件' }]
        },
        node: (
          <ImportFile
            style={{ marginLeft: 100 }}
            UploadProps={{
              type: 'drag',
              multiple: true,
              onChange: info => handleChange(info)
            }}
            fileName="file"
            onImport={file => true}
          >
            <Icon type="inbox" />
            <p style={{ display: 'flex', padding: '0px 10px' }}>
              <span>
                <span
                  style={{
                    color: '#474C50',
                    display: 'block',
                    fontSize: '16px'
                  }}
                >
                  点击或将文件拖拽到此处上传
                </span>
                <span
                  className={`ant-upload-hint ft-12`}
                  style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}
                >
                  支持格式：.jar | .csv | .jmx
                </span>
                <span style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}>
                  上传的文件必须包含一个压测脚本
                </span>
                <span style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}>
                  超过200M的数据文件，请保存场景后，请使用插件上传,
                  <a
                    onClick={e => e.stopPropagation()}
                    href={state.downloadUrl}
                    download
                  >
                    点击下载插件
                  </a>
                </span>
              </span>
            </p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 8, width: '160%' }}>
            <CustomTable
              columns={getUploadFileColumns(state, setState, props)}
              dataSource={
                state.fileList
                  ? state.fileList.filter(item => {
                    return item.isDeleted !== 1;
                  })
                  : []
              }
            />
            {/* {state.fileList.map((item, k) => {
              return (
                item.isDeleted !== 1 && (
                  <p
                    key={k}
                    style={{
                      position: 'relative',
                      lineHeight: '28px'
                    }}
                  >
                    <Icon
                      style={{ color: '#29C7D7', marginRight: 8 }}
                      type="link"
                    />
                    {item.fileName}
                    <Icon
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 6,
                        color: '#29C7D7'
                      }}
                      type="delete"
                      onClick={() => handleDelete(item)}
                    />
                  </p>
                )
              );
            })} */}
          </div>
        )
      }
    ];
  };

  return {
    title: '压测脚本/文件',
    rowNum: 1,
    span: 14,
    formData: getScriptFileUploadData()
  };
};

export default ScriptFileUpload;
