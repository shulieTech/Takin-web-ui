import React, { Fragment, useEffect, useState } from 'react';
import styles from './../index.less';
import { Collapse, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ButtonProps } from 'antd/lib/button';
import CustomTable from 'src/components/custom-table';
import { CommonModal, useStateReducer } from 'racc';
import PressureTestSceneService from '../service';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  btnProps?: ButtonProps;
  sceneId?: string;
}

interface State {
  isReload?: boolean;
  form: any;
}
const SlaListModal: React.FC<Props> = props => {
  const { Panel } = Collapse;
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    form: null as WrappedFormUtils,
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setData] = useState([]);
  const [detail, setDetail] = useState({} as any);
  const {  sceneId } = props;

  const handleClick = () => {
    getPerformanceBaseline();
  };

  const handleCancle = () => {
    setData([]);
  };

  /**
   * @name 获取性能基线列表
   */
  const getPerformanceBaseline = async () => {
    setLoading(true);
    const {
      data: { data, success },
    } = await PressureTestSceneService.getPerformanceBaseline({ sceneId });
    console.log('data',data);
    setLoading(false);
    if (success && data) {
      setData(data || []);
    }
  };

  const columns = () => {
    return [
      {
        title: '应用',
        dataIndex: 'appName',
      },
      {
        title: '服务名',
        dataIndex: 'methodName',
        render: (text, row) => {
          return <span>{text}#{row?.serviceName}</span>;
        }
      },
      {
        title: 'rt',
        dataIndex: 'rt',
        render: (text, row) => {
          return <span>{text}ms</span>;
        }
      },
      {
        title: '成功率',
        dataIndex: 'successRate',
        render: (text, row) => {
          return <span>{text}%</span>;
        }
      }
    ];
  }; 

  return (
    <CommonModal
      modalProps={{
        centered: true,
        title: '性能基线详情',
        maskClosable: false,
        width: '95%',
        bodyStyle: {
          height: '70vh',
          overflow: 'scroll'
        }
      }}
      btnProps={{
        type: 'link',
        ...props.btnProps,
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      afterCancel={handleCancle}
    >
    <Collapse>
  
    {dataSource?.map((item: any, k) => {
      return  <Panel  header={item?.activityName} key={k}>
      <Table
        dataSource={item?.nodeList}
        columns={columns()}
      />
    </Panel>;
    })}
  </Collapse>
    </CommonModal>
  );
};
export default SlaListModal;
