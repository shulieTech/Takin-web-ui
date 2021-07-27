import { Button, Checkbox, Col, Collapse, message, Row, Switch } from 'antd';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomTable from 'src/components/custom-table';
import SearchTable from 'src/components/search-table';
import AuthorityConfigService from '../service';
import styles from './../index.less';
import getAccountListColumn from './AccountListColumn';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const FuncPermissionList: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const { state, setState } = props;
  const { Panel } = Collapse;

  const handleChangeSwitch = async (value, id) => {
    setState({
      funcPermissionList:
        state.funcPermissionList &&
        state.funcPermissionList.map((item, k) => {
          if (id === item.id) {
            return {
              ...item,
              checked: value
            };
          }
          return { ...item };
        })
    });
  };

  const handleChangeCheckbox = async (id, key, checked) => {
    setState({
      funcPermissionList:
        state.funcPermissionList &&
        state.funcPermissionList.map((item1, k) => {
          if (id === item1.id) {
            return {
              ...item1,
              groupList:
                item1.groupList &&
                item1.groupList.map((item2, k2) => {
                  if (item2.value === key) {
                    return { ...item2, checked: !checked };
                  }
                  return { ...item2 };
                })
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
    } = await AuthorityConfigService.saveFuncPermission({
      roleId: state.roleId,
      funcPermissionList: state.funcPermissionList
    });
    if (success) {
      message.success('保存功能权限成功');
    }
  };

  return (
    <div className={styles.rightWrap}>
      <div>
        <span className={styles.rightTitle}>功能权限</span>
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
          {state.funcPermissionList &&
            state.funcPermissionList.map((item, k) => {
              return (
                <Panel
                  header={
                    <div>
                      <span
                        style={{
                          marginLeft:
                            item.groupList && item.groupList.length > 0 ? 0 : 4
                        }}
                        className={styles.moduleName}
                      >
                        {item.title}
                      </span>
                      <a onClick={e => e.stopPropagation()}>
                        <Switch
                          style={{ float: 'right' }}
                          checked={item.checked}
                          onChange={value => {
                            handleChangeSwitch(value, item.id);
                          }}
                        />
                      </a>
                    </div>
                  }
                  key={k}
                  disabled={
                    item.groupList && item.groupList.length > 0 ? false : true
                  }
                  showArrow={
                    item.groupList && item.groupList.length > 0 ? true : false
                  }
                >
                  <Row style={{ marginBottom: 20 }}>
                    {item.groupList &&
                      item.groupList.map((item2, k2) => {
                        return (
                          <Col span={4} key={k2}>
                            <Checkbox
                              checked={item2.checked}
                              value={item2.value}
                              disabled={item.checked === false ? true : false}
                              onChange={e =>
                                handleChangeCheckbox(
                                  item.id,
                                  e.target.value,
                                  item2.checked
                                )
                              }
                            >
                              {item2.label}
                            </Checkbox>
                          </Col>
                        );
                      })}
                  </Row>
                </Panel>
              );
            })}
        </Collapse>
      </div>
    </div>
  );
};
export default FuncPermissionList;
