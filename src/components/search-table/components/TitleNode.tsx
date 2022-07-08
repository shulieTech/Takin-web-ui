/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import RadioGroup from 'antd/lib/radio/group';
import { CommonSelect } from 'racc';
import React, { useContext } from 'react';
import { getInitState, SearchTableContext } from '../context';
import styles from '../index.less';
import { FilterDataProps, SearchTableProps } from '../type';

const TitleNode: React.FC<SearchTableProps> = props => {
  const { state, setState } = useContext(SearchTableContext);
  const handleChange = (v, item) => {
    // 旧的onChange逻辑
    // const originParams = {};
    // let value = v;
    // const isArray = Array.isArray(v);
    // if (isArray) {
    //   const lastItem = [...v].pop();
    //   if (lastItem) {
    //     value = v.filter(k => k);
    //   } else {
    //     value = '';
    //   }
    // }
    // Object.keys(state.searchParams).forEach(key => {
    //   if (props.filterData.find(i => i.key === key)) {
    //     originParams[key] = state.searchParams[key];
    //   }
    // });
    // const searchParams = {
    //   ...getInitState().searchParams,
    //   ...originParams,
    //   [item.key]: value
    // };
    // setState({
    //   searchParams
    // });
    // if (state.form) {
    //   state.form.resetFields();
    // }
    // if (props.onTabReset) {
    //   props.onTabReset(searchParams);
    // }
    
    // 新的逻辑
    setState({
      searchParams: {
        ...state.searchParams,
        [item.key]: v,
      },
    });
  };
  const getRenderNode = (item: FilterDataProps): React.ReactNode => {
    if (item.renderNode) {
      return item.renderNode({
        value: state.searchParams[item.key],
        onChange: v => handleChange(v, item)
      });
    }
    let node: React.ReactNode = null;
    if (!item.dataSource) {
      return null;
    }
    const dataSource = [...item.dataSource];
    if (!item.hideAllOption) {
      dataSource.unshift({
        label: '全部',
        value: ''
      });
    }
    switch (item.type) {
      case 'checkbox':
        node = (
          <CheckboxGroup
            className={`mg-r2x ${styles['brand-checkbox']}`}
            value={
              state.searchParams[item.key] || item.dataSource.map(i => i.value)
            }
            onChange={v => handleChange(v, item)}
            {...item.checkboxGroupProps}
            options={item.dataSource}
          />
        );
        break;
      case 'radio':
        node = (
          <RadioGroup
            value={state.searchParams[item.key] || ''}
            className="mg-r2x"
            // defaultValue=""
            onChange={e => handleChange(e.target.value, item)}
            {...item.radioGroupProps}
            options={dataSource}
          />
        );
        break;
      default:
        node = (
          <CommonSelect
            value={state.searchParams[item.key] || ['']}
            showArrow={false}
            className={styles.filterSelect}
            onChange={v => handleChange(v, item)}
            allowClear={false}
            {...item.commonSelectProps}
            dataSource={dataSource}
            showSearch={true}
            dropdownMatchSelectWidth={false}
          />
        );
        break;
    }
    return node;
  };
  return (
    <Row
      className={`${styles.titleNode}`}
      type="flex"
      align="middle"
      justify="start"
    >
      <Col className={styles.filterWrap}>
        {props.extra ||
          (props.filterData &&
            props.filterData.map((item, index) => (
              <span
                // className={`${item.type !== 'checkbox' && styles.filterItem}`}
                className={styles.filterItem}
                key={index}
              >
                <span className={styles.label}>{item.label}：</span>
                {getRenderNode(item)}
              </span>
            )))}
      </Col>
    </Row>
  );
};
export default TitleNode;
