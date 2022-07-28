/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import styles from './../index.less';
import customStyles from './../../../../custom.less';
import { MiddlewareManageContext } from '../indexPage';
import MiddlewareManageService from '../service';
import MiddlewareManageSearchAndTable from './MiddlewareManageSearchAndTable';
interface Props {}

const MiddlewareManageBottom: React.FC<Props> = props => {
  const { state, setState } = useContext(MiddlewareManageContext);
  const { middlewareDashboard } = state;

  useEffect(() => {
    queryMiddlewareDashboard();
  }, []);

  /**
   * @name 获取中间件概况
   */
  const queryMiddlewareDashboard = async () => {
    const {
      data: { success, data }
    } = await MiddlewareManageService.queryMiddlewareDashboard({});
    if (success) {
      setState({
        middlewareDashboard: data
      });
    }
  };

  const alertData = [
    {
      label: '总数',
      value: middlewareDashboard.totalNum,
      color: customStyles.alertValueNormal
    },
    {
      label: '已支持',
      value: middlewareDashboard.supportedNum,
      color: customStyles.alertValueNormal
    },
    {
      label: '未支持',
      value: middlewareDashboard.notSupportedNum,
      color:
        middlewareDashboard.notSupportedNum > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    },

    {
      label: '未知',
      value: middlewareDashboard.unknownNum,
      color:
        middlewareDashboard.unknownNum > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    },
    {
      label: '无需支持',
      value: middlewareDashboard.noRequiredNum,
      color: customStyles.alertValueNormal
    }
  ];
  return (
    <div
      className={styles.borders}
      style={{
        marginTop: 16,
        height: 'calc(100% - 112px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {middlewareDashboard.totalNum !== null && (
        <CustomAlert
          message
          showIcon
          types={
            middlewareDashboard.notSupportedNum > 0 ||
            middlewareDashboard.unknownNum > 0
              ? 'error'
              : 'info'
          }
          title="中间件库概况"
          content={
            <div style={{ display: 'inline-block', marginLeft: 16 }}>
              {alertData.map((item, k) => {
                return (
                  <span key={k} style={{ marginRight: 16 }}>
                    <span
                      className={customStyles.alertLabel}
                      style={{ marginRight: 8 }}
                    >
                      {item.label}
                    </span>
                    <span className={item.color}>{item.value}</span>
                  </span>
                );
              })}
            </div>}
        />
      )}
      <div
        style={{
          height: 'calc(100% - 35px)',
          position: 'relative',
          overflow: 'auto'
        }}
      >
        <MiddlewareManageSearchAndTable />
      </div>
    </div>
  );
};
export default MiddlewareManageBottom;
