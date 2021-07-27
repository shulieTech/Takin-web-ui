/**
 * @name
 * @author chuxu
 */
import { message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestSceneService from '../service';
import moment from 'moment';
import styles from './../index.less';

const UploadAdjunctColumn = (
  state,
  setState
): ColumnProps<any>[] => {

  /**
   * @name 删除新上传文件
   */
  const handleDeleteFiles = async (uploadId) => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.deleteFiles({ uploadId });
    if (success) {
      setState({
        uploadAttachments: state.uploadAttachments.filter(item => {
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
        uploadAttachments: state.uploadAttachments.map(item2 => {
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
      dataIndex: 'fileSize',
      width: 150,
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
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
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

export default UploadAdjunctColumn;
