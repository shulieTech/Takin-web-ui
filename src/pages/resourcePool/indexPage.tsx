import { Button, Modal, Radio, Table } from 'antd';
import React, { Fragment, useState } from 'react'; 
import CustomTable from 'src/components/custom-table/CustomTable';
import { customColumnProps } from 'src/components/custom-table/utils';
interface Props {}
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
const ResourcePool: React.FC<Props> = props => {

  const [radioValue, setRadioValue] = useState(1);  
  const [visible, setVisible] = useState(false); 

  const handleConfirm = (e) => {
    setVisible(false);
  };

  const columns = [
    {
      ...customColumnProps,
      title: '资源池名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      ...customColumnProps,    
      title: '资源池ID',
      dataIndex: 'age',
      key: 'age',
    },
    {
      ...customColumnProps,
      title: '是否默认',
      dataIndex: 'address',
      key: 'address',
    },
    {
      ...customColumnProps,
      title: '可用区',
      key: 'tags',
      dataIndex: 'tags'
    },
    {
      ...customColumnProps,
      title: '操作',
      key: 'action',
      render: (text, record) => (
           <Button type="link" onClick={() => { setVisible(true); }}>查看可用区</Button>
          ),
    },
  ];  
    
  return (
  <div style={{ padding: 16 }}>
      <CustomTable columns={columns} dataSource={[{ a: '1' }]}/>
      <Modal
          maskClosable={false}
          title="接入说明"
          width={700}
          visible={visible}
          onOk={handleConfirm}
          onCancel={() => {
            setVisible(false);
          }} 
          // tslint:disable-next-line:jsx-alignment
          >
          <Radio.Group onChange={(e) => { setRadioValue(e.target.value); }} value={radioValue}>
        <Radio style={radioStyle} value={1}>可用区1</Radio>
        <Radio style={radioStyle} value={2}>可用区2</Radio>
        <Radio style={radioStyle} value={3}>
        可用区3
        </Radio>
        <Radio style={radioStyle} value={4}>
        可用区4
        </Radio>
      </Radio.Group>
      </Modal>
   </div>
  );
}; 
export default ResourcePool;