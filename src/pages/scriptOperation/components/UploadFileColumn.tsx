/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { message, Checkbox, Icon, Tooltip, Tag, Divider } from 'antd';
import ScriptManageService from '../service';
import moment from 'moment';
import EditCodeModal from '../modals/EditCodeModal';
import styles from './../index.less';

const getUploadFileColumns = (
  state,
  setState,
): ColumnProps<any>[] => {

  /**
   * @name 删除新上传文件
   */
  const handleDeleteFiles = async (uploadId) => {
    const {
      data: { data, success }
    } = await ScriptManageService.deleteFiles({ uploadId });
    if (success) {
      setState({
        uploadFiles: state.uploadFiles.filter(item => {
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
        uploadFiles: state.uploadFiles.map(item2 => {
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
      ...customColumnProps,
      title: '文件',
      dataIndex: 'fileName',
      width: 250,
      render: (text, row) => {
        return (
          <div className={styles.scriptName}>
            {text}
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '大小',
      width: 150,
      dataIndex: 'fileSize',
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: 'uploadTime',
      width: 300,
      render: (text, row) => {
        if (text) {
          return text;
        }
        return moment(row.gmtUpdate).format('YYYY-MM-DD HH:mm:ss') || '--';
      }
    },
    {
      ...customColumnProps,
      title: '操作',
      align: 'right',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <Fragment>
            <EditCodeModal
              state={state}
              setState={setState}
              btnText="编辑"
              fileId={row.filePath ? row.filePath : row.downloadUrl}
              name={state.detail.name}
              type={state.detail.scriptType}
            />
            <Divider type="vertical" />
            <a
              style={{
                color: '#29C7D7',
                marginLeft: 8
              }}
              onClick={() => handleDelete(row)}
            >
              删除
            </a>
          </Fragment>
        );
      }
    }
  ];
};

export default getUploadFileColumns;
