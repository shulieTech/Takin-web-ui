import { Button, Modal, Radio, Table } from 'antd';
import { InputItem } from 'antd-mobile';
import React, { Fragment, useEffect, useState } from 'react'; 
import CustomTable from 'src/components/custom-table/CustomTable';
import { customColumnProps } from 'src/components/custom-table/utils';
import ResourcePoolService from './service';
interface Props {}
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
const ResourcePool: React.FC<Props> = props => {

  const [resourcePoolList, setResourcePoolList] = useState([]);  
  const [visible, setVisible] = useState(false); 
  const [radioValue, setRadioValue] = useState(undefined); 
  const [regionList, setRegionList] = useState([]);
  const [regionValue, setRegionValue] = useState(undefined); 
  const [isReload, setIsReload] = useState(false);  

  const handleConfirm = () => {
    setRegion(radioValue);
  };

  useEffect(() => {
    queryResourcePoolList();
  }, [isReload]);

  /**
   * @name 获取资源池列表
   */

  const queryResourcePoolList = async () => {
    const {
          data: { success, data },
        } = await ResourcePoolService.queryResourcePoolList({ });
    if (success) {
      setResourcePoolList(data);
    }
  };

  /**
   * @name 获取可用区
   */

  const queryRegion = async (record) => {
    const {
              data: { success, data },
            } = await ResourcePoolService.queryRegion({ poolId: record?.poolId });
    if (success) {
      setRegionList(data);
    }
  };

  /**
   * @name 设置可用区
   */
  const setRegion = async (value) => {
    const { data: { success, data } } = await ResourcePoolService.setRegion({ pool: regionValue?.poolId, poolName: regionValue?.poolName, region: value , regionName: regionList?.filter(item => item?.region === value)?.[0]?.name });
    if (success) {
      setVisible(false);
      setIsReload(!isReload);
      return;
    }
  };

  const handleClick = (record: any) => {
    setRadioValue(record?.region);
    setVisible(true);
    queryRegion(record);
    setRegionValue(record);
  };
 
  const columns = [
    {
      ...customColumnProps,
      title: '资源池名称',
      dataIndex: 'poolName',
      key: 'poolName',
    },
    {
      ...customColumnProps,    
      title: '资源池ID',
      dataIndex: 'poolId',
      key: 'poolId',
    },
    {
      ...customColumnProps,
      title: '是否默认',
      dataIndex: 'choose',
      key: 'choose',
      render: (text) => {
        return text === true ? '是' : '否';
      }
    },
    {
      ...customColumnProps,
      title: '可用区',
      key: 'regionName',
      dataIndex: 'regionName'
    },
    {
      ...customColumnProps,
      title: '操作',
      key: 'action',
      render: (text, record) => (
           <Button type="link" onClick={() => { handleClick(record); }}>查看可用区</Button>
          ),
    },
  ];  
    
  return (
  <div style={{ padding: 16 }}>
      <CustomTable columns={columns} dataSource={resourcePoolList}/>
      <Modal
          maskClosable={false}
          title="可用区选择"
          width={700}
          visible={visible}
          onOk={handleConfirm}
          onCancel={() => {
            setVisible(false);
          }} 
          // tslint:disable-next-line:jsx-alignment
          >
          <Radio.Group onChange={(e) => { setRadioValue(e.target.value); }} value={radioValue}>
            {regionList?.map((item, k) => {
              return  <Radio key={item?.region} style={radioStyle} value={item?.region}>{item?.name}</Radio>;
            })}
      </Radio.Group>
      </Modal>
   </div>
  );
}; 
export default ResourcePool;