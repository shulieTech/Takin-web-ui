/**
 * @name
 * @author chuxu
 */
import { Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestSceneService from '../service';

const UploadAdjunctColumn = (
  state,
  setState,
  dictionaryMap
): ColumnProps<any>[] => {
  /**
   * @name 删除新上传文件
   */
  const handleDeleteFiles = async (uploadId, topic) => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.deleteFiles({ uploadId, topic });
    if (success) {
      message.success('删除文件成功！');
      setState({
        attachmentList: state.attachmentList.filter(item => {
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
        attachmentList: state.attachmentList.map(item2 => {
          if (item.id === item2.id) {
            return { ...item2, isDeleted: 1 };
          }
          return { ...item2 };
        })
      });
    } else {
      handleDeleteFiles(item.uploadId, item.topic);
    }
  };

  return [
    {
      ...customColumnProps,
      title: '文件名称',
      dataIndex: 'fileName',
      width: 150
    },
    {
      ...customColumnProps,
      title: '文件类型',
      dataIndex: 'fileType',
      render: text => {
        return <span>{text === 1 ? '数据' : '附件'}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '文件数据量（条）',
      dataIndex: 'uploadedData'
    },
    {
      ...customColumnProps,
      title: '更新时间',
      dataIndex: 'uploadTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            <Button
              type="link"
              style={{
                marginLeft: 8
              }}
              onClick={() => handleDelete(row)}
            >
              删除
            </Button>
          </Fragment>
        );
      }
    }
  ];
};

export default UploadAdjunctColumn;
