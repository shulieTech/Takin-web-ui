/**
 * @name 步骤1-基本信息
 */

import { Icon, message, Radio } from 'antd';
import { ImportFile } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React from 'react';
import CustomTable from 'src/components/custom-table';
import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import {
  default as PressureTestSceneService,
  default as ScriptManageService,
} from '../service';
import UploadAdjunctColumn from './UploadAdjunctColumn';
import getUploadFileColumns from './UploadFileColumn';

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

    const handleChange = (
      info,
      stateKeyName = 'fileList',
      acceptFileNames = ['jar', 'csv', 'jmx']
    ) => {
      // const uploadFileNum = info?.fileList?.length;
      const uploadFileNum = state[stateKeyName]?.length;

      /**
       * @name 已上传的文件列表名
       */
      const fileListName =
        state[stateKeyName] &&
        state[stateKeyName].map((item) => {
          return item.fileName;
        });

      /**
       * @name 准备上传的文件列表名
       */
      const readyToUploadFileName =
        info.fileList &&
        info.fileList.slice(uploadFileNum).map((item) => {
          return item.name;
        });

      /**
       * @name 准备上传的文件列表
       */
      const readyToUploadFileList =
        info.fileList && info.fileList.slice(uploadFileNum);

      /**
       * @name 判断是否是可接受类型
       */
      function isAcceptType(ext) {
        return acceptFileNames.indexOf(ext.toLowerCase()) !== -1;
      }

      // setState({
      //   uploadFileNum: info.fileList.length
      // });

      /**
       * @name 待上传的元素含有不可接受类型
       */
      if (
        readyToUploadFileName.find((item) => {
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
        readyToUploadFileList.find((item) => {
          return item.size / 1024 / 1024 > 200;
        })
      ) {
        message.error('上传的文件大小超过200M，请检查后上传');
        info.fileList = [];
        return;
      }

      /**
       * @name 待上传的元素含有重名文件列表
       */
      const equalList =
        readyToUploadFileName &&
        readyToUploadFileName.filter((item, index) => {
          if (
            fileListName &&
            fileListName
              .filter((item2) => {
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
      // console.log('info.fileList', info.fileList);
      const newUploadFileList = info.fileList.slice(uploadFileNum);
      // console.log('newUploadFileList', newUploadFileList);

      const formData = new FormData();
      info.fileList.slice(uploadFileNum).map((item) => {
        formData.append('file', item.originFileObj);
      });

      setState({
        [stateKeyName]:
          state[stateKeyName] && state[stateKeyName].concat(newUploadFileList),
      });

      if (info.file.uid === info.fileList.slice(-1)[0].uid && formData) {
        uploadFiles(formData, stateKeyName);
      }
    };

    /**
     * @name 上传文件
     */
    const uploadFiles = async (files, stateKeyName = 'fileList') => {
      const {
        data: { data, success },
      } = await {
        fileList: PressureTestSceneService.uploadFiles,
        attachmentList: ScriptManageService.uploadAttachments,
      }[stateKeyName](files);
      if (success) {
        setState({
          [stateKeyName]: state[stateKeyName]
            ? state[stateKeyName].concat(data)
            : data,
        });
      }
    };

    /**
     * @name 删除新上传文件
     */
    const handleDeleteFiles = async (uploadId, stateKeyName = 'fileList') => {
      const {
        data: { data, success },
      } = await PressureTestSceneService.deleteFiles({ uploadId });
      if (success) {
        message.success('删除文件成功！');
        setState({
          [stateKeyName]:
            state[stateKeyName] &&
            state[stateKeyName].filter((item) => {
              return uploadId !== item.uploadId;
            }),
        });
      }
    };

    /**
     * @name 删除上传文件
     */
    const handleDelete = async (item, stateKeyName = 'fileList') => {
      if (item.id) {
        setState({
          fileList: state[stateKeyName].map((item2) => {
            if (item.id === item2.id) {
              return { ...item2, isDeleted: 1 };
            }
            return { ...item2 };
          }),
        });
      } else {
        handleDeleteFiles(item.uploadId, stateKeyName);
      }
    };

    // const handleUpload = async (file) => {
    //   const {
    //     data: { success, data }
    //   } = await ScriptManageService.uploadAttachments(file);
    //   if (success) {
    //     message.success('上传成功');
    //     setState({ attachmentList: [...state.attachmentList, ...data] });
    //   }
    // };

    return [
      {
        key: 'scriptType',
        label: '脚本类型',
        options: {
          initialValue: action !== 'add' ? String(detailData.scriptType) : '0',
          rules: [{ required: true, message: '请选择脚本类型' }],
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
        ),
      },
      {
        key: 'uploadFiles',
        label: '上传文件',
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        options: {
          initialValue: action !== 'add' ? detailData.uploadFiles : '',
          rules: [{ required: false, message: '请上传文件' }],
        },
        node: (
          <ImportFile
            style={{ marginLeft: 100 }}
            UploadProps={{
              type: 'drag',
              multiple: true,
              onChange: (info) => handleChange(info),
            }}
            fileName="file"
            onImport={(file) => true}
          >
            <Icon type="inbox" />
            <p
              style={{
                display: 'flex',
                padding: '0px 10px',
                justifyContent: 'center',
              }}
            >
              <span>
                <span
                  style={{
                    color: '#474C50',
                    display: 'block',
                    fontSize: '16px',
                  }}
                >
                  JMeter脚本、csv数据文件、JMeter脚本使用的jar包上传至此处
                </span>
                <span
                  className={`ant-upload-hint ft-12`}
                  style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}
                >
                  文件将与JMeter脚本存储在同一目录下，
                </span>
                <span style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}>
                  所以JMeter脚本中的文件调用路径仅使用文件名即可
                </span>
                {/* <span style={{ color: 'rgba(0,0,0,0.43)', display: 'block' }}>
                  超过200M的数据文件，请保存场景后，请使用插件上传,
                  <a
                    onClick={e => e.stopPropagation()}
                    href={state.downloadUrl}
                    download
                  >
                    点击下载插件
                  </a>
                </span> */}
              </span>
            </p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 8, width: '200%' }}>
            <CustomTable
              columns={getUploadFileColumns(state, setState, props)}
              dataSource={
                state.fileList
                  ? state.fileList.filter((item) => {
                    return item.isDeleted !== 1;
                  })
                  : []
              }
            />
          </div>
        ),
      },
      {
        key: 'uploadAttachments',
        label: '上传附件',
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 16 } },
        options: {
          initialValue: action !== 'add' ? detailData.uploadAttachments : '',
          rules: [{ required: false, message: '请上传附件' }],
        },
        node: (
          <ImportFile
            style={{ marginLeft: 100 }}
            UploadProps={{
              type: 'drag',
              multiple: true,
              onChange: (info) =>
                handleChange(info, 'attachmentList', [
                  'jar',
                  'csv',
                  'bmp',
                  'png',
                  'jpg',
                  'jpeg',
                  'gif',
                  'xls',
                  'xlsx',
                ]),
            }}
            fileName="file"
            onImport={(file) => true}
          >
            <Icon type="inbox" />
            <p
              style={{
                display: 'flex',
                padding: '0px 10px',
                justifyContent: 'center',
              }}
            >
              <span>
                <span
                  style={{
                    color: '#474C50',
                    display: 'block',
                    fontSize: '16px',
                  }}
                >
                  点击新增或者拖拽到此上传文件
                </span>
              </span>
            </p>
            <p>
              支持数据文件格式：.csv <br />
              支持jar格式：.jar <br />
              支持其他附件格式：图片、Excel等
            </p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 8, width: '200%' }}>
            <CustomTable
              columns={UploadAdjunctColumn(state, setState, props)}
              dataSource={
                state.attachmentList
                  ? state.attachmentList.filter((item) => {
                    return item.isDeleted !== 1;
                  })
                  : []
              }
            />
          </div>
        ),
      },
    ];
  };

  return {
    title: '压测脚本/文件',
    rowNum: 1,
    span: 14,
    formData: getScriptFileUploadData(),
  };
};

export default ScriptFileUpload;
