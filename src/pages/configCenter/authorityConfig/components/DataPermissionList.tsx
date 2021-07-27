import { Button, Collapse, message, Radio } from 'antd';
import React from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AuthorityConfigService from '../service';
import styles from './../index.less';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const DataPermissionList: React.FC<Props> = props => {
  const { state, setState } = props;
  const { Panel } = Collapse;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  const handleChangeRadio = async (e, id) => {
    setState({
      dataPermissionList:
        state.dataPermissionList &&
        state.dataPermissionList.map((item1, k) => {
          if (id === item1.id) {
            return {
              ...item1,
              checked: e.target.value
            };
          }
          return { ...item1 };
        })
    });
  };

  const handleSaveFuncPermission = async () => {
    /**
     * @name 保存功能权限
     */
    const {
      total,
      data: { data, success }
    } = await AuthorityConfigService.saveDataPermission({
      roleId: state.roleId,
      dataPermissionList: state.dataPermissionList
    });
    if (success) {
      message.success('保存数据权限成功');
    }
  };

  return (
    <div className={styles.rightWrap}>
      <div>
        <span className={styles.rightTitle}>数据权限</span>
        {/* <span className={styles.rightSubTitle}>操作描述</span> */}
        <AuthorityBtn
          isShow={
            btnAuthority && btnAuthority.configCenter_authorityConfig_3_update
          }
        >
          <Button
            type="primary"
            style={{ float: 'right' }}
            onClick={() => handleSaveFuncPermission()}
          >
            保存
          </Button>
        </AuthorityBtn>
      </div>
      <div style={{ marginTop: 40 }}>
        <Collapse defaultActiveKey={['0']} expandIconPosition="right">
          {state.dataPermissionList &&
            state.dataPermissionList.map((item, k) => {
              return (
                <Panel
                  header={
                    <div>
                      <span className={styles.moduleName}>{item.title}</span>
                    </div>
                  }
                  key={k}
                >
                  <Radio.Group
                    onChange={e => handleChangeRadio(e, item.id)}
                    value={item.checked}
                  >
                    {item.groupList &&
                      item.groupList.map((item2, k2) => {
                        return (
                          <Radio key={k2} value={item2.value}>
                            {item2.label}
                          </Radio>
                        );
                      })}
                  </Radio.Group>
                </Panel>
              );
            })}
        </Collapse>
      </div>
    </div>
  );
};
export default DataPermissionList;
