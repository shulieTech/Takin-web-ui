import { Button, Card, Icon, Input, message, Modal, Upload } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonSelect, CommonTable, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import BusinessFlowService from '../service';

interface Props {
  title?: string | React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  state?: any;
  dictionaryMap?: any;
}
interface State {
  list: any[];
  disabled: boolean;
  visible: boolean;
  textValue: string;
  modalIndex: string;
}

const IB2HeaderTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    list: [],
    disabled: false,
    visible: false,
    textValue: undefined,
    modalIndex: undefined
  });

  useEffect(() => {
    setState({
      list: props.value?.length === 0 ? [{ paramName: '', paramValue: '', allowEdit: true, paramType : 'text' }] : props.value
    });
  }, [props.value, setState]);

  const handleChanegeInfo = (info, index) => {
    const formData = new FormData();
    formData.append('file', info?.file);
    uploadFile(formData, index);
  };

  /**
   * @name 上传脚本文件
   */
  const uploadFile = async (file: any, index) => {
    const msg = await BusinessFlowService.uploadJmeter(file);
    if (msg?.data?.success) {
      message.success('上传文件成功！');
      handleChange('change', 'paramValue', msg?.data?.data?.[0]?.downloadUrl, index);
    }
  };

  const handleClickModal = (text, index) => {
    setState({
      visible: true,
      textValue: text,
      modalIndex: index
    });
  };
 
  const handleChangeModalValue = (e) => {
    setState({
      textValue: e.target.value,
    });
  };

  const handleConfirm = () => {
    handleChange('change', 'paramValue', state?.textValue, state?.modalIndex);
    setState({
      visible: false
    });
  };

  /** @name header定义 */
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'Name',
        dataIndex: 'paramName',
        render: (text, row, index) => {
          return (
                <Input
                  disabled={!row?.allowEdit}
                  placeholder="请输入参数 Key"
                  value={text}
                  onChange={e =>
                    handleChange('change', 'paramName', e.target.value, index)
                  }
                />
          );
        }
      },
      {
        ...customColumnProps,
        title: 'Value',
        dataIndex: 'paramValue',
        render: (text, row, index) => {
          return (
            <div>
            <Input
              style={{ width: '80%' }}
              placeholder="请输入参数 Value"
              value={text}
              onChange={e =>
                handleChange('change', 'paramValue', e.target.value, index)
              }
            />
            {row?.paramType === 'text' && <Button
              style={{ marginLeft: 8 }}
              size="small" 
              onClick={() => handleClickModal(text, index)}>...</Button>}
            {row?.paramType === 'file' &&  
             <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                handleChanegeInfo(info, index);
              }}
             >
             <Button type="link" style={{ marginLeft: 8 }}>
              上传
            </Button>
             </Upload>}
             </div>
          );
        }
      },
      {
        ...customColumnProps,
        title: '备注',
        dataIndex: 'paramCNDesc',
        render: (text, row, index) => {
          return (
            <Fragment>
             {text} 
            </Fragment>
            
          );
        }
      },
      // {
      //   ...customColumnProps,
      //   title: '操作',
      //   dataIndex: 'action',
      //   render: (text, row, index) => {
      //     return (
      //       <span>
      //         {index <= state.list.length - 1 && state.list.length !== 1 && row?.allowEdit && (
      //           <Button type="link" onClick={() => handleChange('minus', '', '', index)}>
      //            <Icon
      //             type="minus-circle"
      //             style={{ color: '#11BBD5', marginLeft: 5 }}
      //            />
      //           </Button>
      //         )}
      //         {index === state.list.length - 1 && (
      //           <Button type="link" disabled={false}  onClick={() => handleChange('plus', '', '', index)}>
      //           <Icon
      //             type="plus-circle"
      //             style={{ color: '#11BBD5', marginLeft: 5 }}             
      //           />
      //           </Button>
      //         )}
      //       </span>
      //     );
      //   }
      // }
    ];
  };

  const handleChange = (type, key, value, k) => {
    setState({ disabled: value.disabled });
    if (type === 'change') {
      state.list.splice(k, 1, { ...state.list[k], [key]: value });
    } else if (type === 'plus') {
      state.list.push({
        paramName: '', 
        paramValue: '', 
        allowEdit: true, 
        paramType : 'text' 
      });
    } else {
      state.list.splice(k, 1);
    }

    if (props.onChange) {
      props.onChange(state.list);
    }
  };

  return (
    <Fragment>
       <CommonTable
        rowKey={(row, index) => index.toString()}
        columns={getColumns()}
        size="small"
        dataSource={state.list}
      />
      <Modal 
        width={'calc(100% - 40px)'} 
        onOk={() => {
          handleConfirm();
        }}
        centered
        onCancel={() => {
          setState({
            visible: false
          });
        }} 
        visible={state?.visible} 
        bodyStyle={{ height: '90vh' }}>
        <Input.TextArea onChange={handleChangeModalValue} value={state?.textValue}  style={{ height: '85vh',maxHeight:'85vh',minHeight:'85vh', marginTop: 20,overflow:'scroll' }}/>
      </Modal>
    </Fragment>
     
  );
};
export default IB2HeaderTable;
