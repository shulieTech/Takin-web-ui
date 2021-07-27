/**
 * @name
 * @author MingShined
 */
import React, { Fragment, useContext } from 'react';
import { SearchTableProps } from '../type';
import styles from '../index.less';
import { Row, Col, Pagination } from 'antd';
import { SearchTableContext } from '../context';

const FooterNode: React.FC<SearchTableProps> = props => {
  const { state, setState } = useContext(SearchTableContext);
  const handleChange = (page, size) => {
    setState({
      searchParams: {
        ...state.searchParams,
        current: page - 1,
        pageSize: size
      },
      checkedKeys: []
    });
  };
  return (
    <div className={styles.footer}>
      <Row align="middle" type="flex" justify="space-between">
        <Col>{props.footerAction ? props.footerAction : <span />}</Col>
        <Col>
          <Pagination
            current={state.searchParams.current + 1}
            total={state.total}
            showTotal={(t, range) =>
              `共 ${state.total} 条数据 第${state.searchParams.current +
                1}页 / 共 ${Math.ceil(
                state.total / (state.searchParams.pageSize || 10)
              )}页`
            }
            pageSize={state.searchParams.pageSize}
            showQuickJumper
            showSizeChanger
            onChange={handleChange}
            onShowSizeChange={handleChange}
          />
        </Col>
      </Row>
    </div>
  );
};
export default FooterNode;
