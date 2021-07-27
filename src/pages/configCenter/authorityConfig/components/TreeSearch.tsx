import { Col, Divider, Icon, message, Modal, Popover, Row, Tree } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { MapBtnAuthority } from 'src/utils/utils';
import AddDepartmentModal from '../modals/AddDepartmentModal';
import AuthorityConfigService from '../service';
import styles from './../index.less';
const { TreeNode } = Tree;
interface Props {
  state: any;
  setState: (value: any) => void;
}

const TreeSearch: React.FC<Props> = props => {
  const { state, setState } = props;
  const { searchValue, expandedKeys } = state;
  const [openKey, setOpenkey] = useState<number>(undefined);
  const [activity, setActivity] = useState(undefined);
  const handleChange = e => {
    // console.log(e);
    const { value } = e.target;
    setState({
      searchValue: value
      // autoExpandParent: true
    });
  };

  useEffect(() => {
    setState({
      selectedDept: null,
      searchParams: {
        current: 0,
        pageSize: 10
      },
      accountSearchValues: {
        accountName: null,
        roleId: null
      }
    });
    const resetKey = () => {
      setOpenkey(undefined);
    };
    document.body.addEventListener('click', resetKey);
    return () => {
      document.body.removeEventListener('click', resetKey);
    };
  }, []);

  const handleSearch = async () => {
    const {
      total,
      data: { data, success }
    } = await AuthorityConfigService.queryDepartmentList({
      departmentName: state.searchValue
    });
    if (success) {
      setState({
        treeData: data
      });
    }
  };

  const onExpand = keys => {
    // console.log(keys);
    setState({
      expandedKeys: keys
      // autoExpandParent: true
    });
  };

  const findDeptName = (data, selectedKeys) => {
    if (!data || !data.length) {
      return '';
    }
    let result;
    data.some(item => {
      if (item.id.toString() === selectedKeys.toString()) {
        result = item.title;
        return true;
      }
      if (item.children && item.children.length) {
        result = findDeptName(item.children, selectedKeys);
        return result;
      }
    });
    return result;
  };

  const handleSelect = selectedKeys => {
    const selectedDept = selectedKeys[0];
    if (!selectedDept) {
      return;
    }
    setState({
      selectedDept,
      selectedDeptName: findDeptName(state.treeData, selectedDept),
      searchParams: { current: 0, pageSize: 10 }
    });
  };

  const handleDeleteDepartment = (id: any) => {
    Modal.confirm({
      icon: (
        <Icon
          type="question-circle"
          theme="filled"
          style={{ color: '#var(--FunctionalError-500)' }}
          className={styles.ModalIcon}
        />
      ),
      title: '删除部门',
      content: (
        <span style={{ fontSize: 13, color: '#8C8C8C' }}>
          删除该部门的同时将会一并删除所有子部门，部门内有账号时无法删除，确定删除吗？
        </span>
      ),
      okText: '确认删除',
      maskClosable: true,
      okButtonProps: { style: { color: '#EA5B3C' }, type: 'default' },
      onOk: async () => {
        const {
          data: { success }
        } = await AuthorityConfigService.deleteDepartment({ id });
        if (success) {
          message.success('删除成功');
          setState({ depReload: !state.depReload });
        }
      }
    });
  };

  const renderTitle = ({ title, id }): React.ReactNode => {
    const renderContent = (): React.ReactNode => {
      return (
        <div
          style={{
            fontSize: 13,
            color: '#555555',
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_authorityConfig_3_update')}
          >
            <AddDepartmentModal
              onSuccess={() => setState({ depReload: !state.depReload })}
              treeData={state.treeData}
              id={id}
            />
          </AuthorityBtn>
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_authorityConfig_4_delete')}
          >
            <Divider style={{ margin: '16px 0' }} />
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => handleDeleteDepartment(id)}
            >
              删除部门
            </span>
          </AuthorityBtn>
        </div>
      );
    };
    return (
      <Row
        type="flex"
        gutter={24}
        onMouseEnter={() => setActivity(id)}
        onMouseLeave={() => setActivity(undefined)}
      >
        <Col>{title}</Col>
        <Col>
          <span
            style={{ opacity: activity === id ? '100%' : 0 }}
            onClick={e => e.stopPropagation()}
          >
            <Popover
              visible={openKey === id}
              overlayStyle={{ width: 160 }}
              placement="bottomLeft"
              content={renderContent()}
            >
              <Icon onClick={() => setOpenkey(id)} type="more" />
            </Popover>
          </span>
        </Col>
      </Row>
    );
  };

  const renderTreeNodes = data =>
    data &&
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={renderTitle(item)} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={renderTitle(item)} key={item.id} />;
    });
  return (
    <div className={styles.accountLeftWrap}>
      <Row
        align="middle"
        style={{ padding: '8px' }}
        type="flex"
        justify="space-between"
      >
        <Col>
          <span style={{ fontSize: 16, color: '#595959', fontWeight: 500 }}>
            部门列表
          </span>
        </Col>
        <Col>
          <AuthorityBtn
            isShow={MapBtnAuthority('configCenter_authorityConfig_2_create')}
          >
            <AddDepartmentModal
              onSuccess={() => setState({ depReload: !state.depReload })}
              treeData={state.treeData}
            />
          </AuthorityBtn>
        </Col>
      </Row>
      <Search
        style={{ marginBottom: 8, padding: 8 }}
        placeholder="搜索部门名称"
        onChange={handleChange}
        onSearch={handleSearch}
      />
      <div className={styles.departmentTree}>
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          // autoExpandParent={true}
          onSelect={handleSelect}
          selectedKeys={[state.selectedDept]}
        >
          {renderTreeNodes(state.treeData ? state.treeData : [])}
        </Tree>
      </div>
    </div>
  );
};
export default TreeSearch;
