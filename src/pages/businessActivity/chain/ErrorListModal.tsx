/**
 * @name
 * @author MingShined
 */
import { Modal, Alert } from 'antd';
import React, { useContext } from 'react';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { ActivityBean } from '../enum';
import styles from '../index.less';
import { NodeDetailsCollapse, NodeDetailsTable } from './NodeInfoCommonNode';

interface Props {
  visible: boolean;
  onCancel: () => void;
}
const ErrorList: React.FC<Props> = (props) => {
  const { state } = useContext(BusinessActivityDetailsContext);
  const dataSource = state.details?.topology?.exceptions;
  if (!dataSource || !dataSource.length) {
    return null;
  }
  return (
    <Modal
      visible={props.visible}
      width={720}
      bodyStyle={{
        height: 450,
        overflow: 'auto',
      }}
      title={
        <div>
          <span
            className="iconfont icon-xiaoxiduilie"
            style={{
              backgroundColor: 'var(--FunctionalNetural-600, #232C3C)',
              color: '#fff',
              display: 'inline-block',
              verticalAlign: 'middle',
              textAlign: 'center',
              width: 32,
              lineHeight: '32px',
              fontSize: 20,
              borderRadius: 4,
              marginRight: 16,
            }}
          />
          配置异常
        </div>
      }
      onCancel={props.onCancel}
      footer={null}
    >
      <Alert
        type="error"
        showIcon
        icon={
          <span
            className="iconfont icon-anquandefuben"
            style={{ color: 'var(--FunctionalError-500, #F15F4A)', top: 6 }}
          />
        }
        message="当前链路配置异常，请尽快处理，以免影响压测"
        style={{
          marginBottom: 16,
        }}
      />
      {dataSource.map((x, i) => {
        const data = [
          { title: '问题详情', value: x[ActivityBean.问题描述] },
          { title: '建议解决方案', value: x[ActivityBean.建议解决方案] },
        ];
        return (
          <NodeDetailsCollapse
            key={i}
            title={x[ActivityBean.问题类型]}
            showNum={false}
          >
            <NodeDetailsTable
              showHeader={false}
              showOrder={false}
              columns={[
                {
                  dataIndex: 'title',
                  render: (text) => (
                    <span style={{ color: 'var(--Netural-10, #8E8E8E)' }}>{text}</span>
                  ),
                },
                { dataIndex: 'value' },
              ]}
              dataSource={data}
            />
          </NodeDetailsCollapse>
        );
      })}
    </Modal>
  );
};
export default ErrorList;
