/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import { message, Checkbox, Icon, Tooltip, Tag, Divider, Button } from 'antd';
import PressureTestSceneService from 'src/pages/pressureTestManage/pressureTestScene/service';
import { CommonSelect } from 'racc';

const getScriptFileColumns = (state, setState): ColumnProps<any>[] => {
  /**
   * @name 选择是否拆分
   */
  const handleSplit = async (fileId, uploadId, isSplit) => {
    if (fileId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.id === fileId) {
            return { ...item, isSplit: isSplit === 0 ? 1 : 0 };
          }
          return { ...item };
        })
      });
    }
    if (uploadId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.uploadId === uploadId) {
            return { ...item, isSplit: isSplit === 0 ? 1 : 0 };
          }
          return { ...item };
        })
      });
    }
  };

  /**
   * @name 选择是否分区排序
   */
  const handleSort = async (fileId, uploadId, isOrderSplit) => {
    if (fileId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.id === fileId) {
            return { ...item, isOrderSplit: isOrderSplit === 0 ? 1 : 0 };
          }
          return { ...item };
        })
      });
    }
    if (uploadId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.uploadId === uploadId) {
            return { ...item, isOrderSplit: isOrderSplit === 0 ? 1 : 0 };
          }
          return { ...item };
        })
      });
    }
  };

  /**
   * @name 选择数据类型
   */
  const handleChangeFileType = (fileId, uploadId, fileType) => {
    if (fileId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.id === fileId) {
            return { ...item, fileType };
          }
          return { ...item };
        })
      });
    }
    if (uploadId) {
      setState({
        fileList: state.fileList.map(item => {
          if (item.uploadId === uploadId) {
            return { ...item, fileType };
          }
          return { ...item };
        })
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
        fileList:
          state.fileList &&
          state.fileList.filter(item => {
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
      ...customColumnProps,
      title: '文件名称',
      dataIndex: 'fileName',
      width: 150
    },
    {
      ...customColumnProps,
      title: '文件类型',
      dataIndex: 'fileType',
      width: 110,
      render: (text, row) => {
        return (
          <CommonSelect
            allowClear={false}
            onChange={value =>
              handleChangeFileType(row.id, row.uploadId, value)
            }
            value={text}
            dataSource={[
              { label: '数据文件', value: 1 },
              { label: '附件', value: 2 }
            ]}
            onRender={item => (
              <CommonSelect.Option key={item.value} value={item.value}>
                {item.label}
              </CommonSelect.Option>
            )}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '文件数据量（条）',
      dataIndex: 'uploadedData'
    },
    {
      ...customColumnProps,
      title: (
        <span>
          是否拆分
          <Tooltip
            title="拆分时不同施压机将使用不同的数据；不拆分则所有施压机使用相同的数据。"
            placement="bottom"
          >
            <Icon style={{ marginLeft: 4 }} type="question-circle" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'isSplit',
      render: (text, row) => {
        return row.fileType === 1 ? (
          <Checkbox
            checked={text === 1 ? true : false}
            onChange={() => handleSplit(row.id, row.uploadId, text)}
          />
        ) : (
          '-'
        );
      }
    },
    {
      ...customColumnProps,
      title: <span>是否按分区排序</span>,
      dataIndex: 'isOrderSplit',
      render: (text, row) => {
        return row.fileType === 1 ? (
          <Checkbox
            checked={text === 1 ? true : false}
            onChange={() => handleSort(row.id, row.uploadId, text)}
          />
        ) : (
          '-'
        );
      }
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

export default getScriptFileColumns;
