import { Button, Col, Modal, Row, Spin } from 'antd';
import { CommonSelect } from 'racc';
import React from 'react';
import EmptyNode from 'src/common/empty-node';
import { LinkDebugState } from '../indexPage';
import styles from './../index.less';
interface Props {
  state?: LinkDebugState;
  setState?: (value: any) => void;
}
const LinkDebugConfigList: React.FC<Props> = props => {
  const { state, setState } = props;
  const { linkDebugConfigList } = state;
  const { confirm } = Modal;

  const handleSelectConfig = id => {
    if (
      state.isChanged ||
      state.pageStatus === 'edit' ||
      state.pageStatus === 'clone'
    ) {
      showChangeConfirm(id);
      return;
    }
    if (state.form) {
      state.form.resetFields();
    }
    setState({
      selectedId: id,
      pageStatus: 'query'
    });
  };

  const initState = {
    isRedirect: true,
    headers: null,
    radio: 0,
    codingFormat: 'UTF-8',
    type: 'application/json',
    body: null,
    isChanged: false,
    selectedId: null,
    pageStatus: 'add',
    cookies: null,
    missingDataList: null
  };

  const handleAdd = () => {
    if (state.isChanged || (state.selectedId && state.pageStatus !== 'query')) {
      showAddConfirm();
      return;
    }
    state.form.resetFields();
    setState({
      ...initState
    });
  };

  const showAddConfirm = () => {
    confirm({
      icon: null,
      title: '新建调试',
      content:
        '当前「编辑区域」有未保存信息，新建编辑的的话将清空当前「编辑区域」内信息，是否继续进行确认新建？',
      okText: '确认新建',
      cancelText: '取消',
      onOk() {
        state.form.resetFields();
        setState({
          ...initState
        });
      }
    });
  };

  const showChangeConfirm = id => {
    confirm({
      icon: null,
      title: '查看配置',
      content:
        '当前「编辑区域」有未保存信息，换配置进行编辑的话将清空当前「编辑区域」内信息，是否继续进行？',
      okText: '继续',
      cancelText: '取消',
      onOk() {
        state.form.resetFields();
        setState({
          ...initState,
          selectedId: id,
          pageStatus: 'query'
        });
      }
    });
  };

  const handleSearchActvity = value => {
    setState({
      selectedId: null,
      current: 0,
      linkDebugConfigList: [],
      searchParams: value
    });
  };

  const handleScroll = e => {
    if (
      e.target.scrollHeight - e.target.scrollTop ===
        document.getElementById('listWrap').offsetHeight &&
      e.target.scrollTop !== 0
    ) {
      if (Math.ceil(state.total / 10) > state.current + 1) {
        setState({
          current: state.current + 1
        });
      }
    }
  };

  return (
    <div className={styles.linkDebugConfigWrap}>
      {state.listLoading && (
        <Spin
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '50%',
            left: 20
          }}
        />
      )}
      <Row
        justify="space-between"
        type="flex"
        align="middle"
        className={styles.topWrap}
      >
        <Col style={{ fontSize: '16px', fontWeight: 500 }}>历史配置</Col>
        <Col>
          <Button onClick={handleAdd}>新建</Button>
        </Col>
      </Row>
      <div
        id="listWrap"
        className={styles.listWrap}
        onScroll={e => handleScroll(e)}
      >
        <div style={{ padding: 16 }}>
          <CommonSelect
            onChange={handleSearchActvity}
            style={{ width: '100%' }}
            placeholder="搜索业务活动"
            value={state.searchParams}
            dataSource={state.bussinessActiveList || []}
            dropdownMatchSelectWidth={false}
            showSearch
            optionFilterProp="children"
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          />
        </div>
        <div>
          {linkDebugConfigList && linkDebugConfigList.length > 0
            ? linkDebugConfigList.map((item, k) => {
              return (
                  <div
                    key={k}
                    onClick={() => handleSelectConfig(item.id)}
                    className={`${styles.listCard} ${item.id ===
                      state.selectedId && styles.active}`}
                  >
                    <div className={styles.listInnerCard}>
                      <div className={styles.cardTitle}>{item.name}</div>
                      <div className={styles.cardDesc}>
                        {item.businessLinkVo && item.businessLinkVo.linkName}
                      </div>
                    </div>
                  </div>
              );
            })
            : !state.listLoading && (
                <div style={{ marginTop: 100 }}>
                  <EmptyNode
                    title="暂无历史配置"
                    desc={
                      <div style={{ width: 180, fontSize: '13px' }}>
                        您可以新建一条
                        <span style={{ color: '#454545' }}>「历史配置」</span>
                      </div>}
                  />
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
export default LinkDebugConfigList;
