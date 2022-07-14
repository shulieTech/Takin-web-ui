/**
 * @name
 * @author MingShined
 */
import { Col, Row, Icon } from 'antd';
import { CommonForm, separateArrayToKey } from 'racc';
import React, { useContext } from 'react';
import ToolTipIcon from 'src/common/tooltip-icon';
import { SearchTableContext, getInitState } from '../context';
import { SearchTableProps } from '../type';

const SearchNode: React.FC<SearchTableProps> = props => {
  const { state, setState } = useContext(SearchTableContext);

  const handleSearch = (err, values) => {
    if (state.loading) {
      return;
    }
    let searchParams = {
      ...state.searchParams,
      ...values,
      current: 0
    };
    if (props.onTabSearch && !props.onTabSearch(searchParams)) {
      return;
    }
    if (props.datekeys) {
      searchParams = separateArrayToKey(searchParams, props.datekeys);
    }
    if (props.cascaderKeys) {
      searchParams = separateArrayToKey(searchParams, props.cascaderKeys);
    }
    setState({ searchParams });
  };
  const handleReset = () => {
    if (state.loading) {
      return;
    }
    if (!props.commonFormProps || !state.form) {
      return;
    }
    
    // 旧的重置逻辑 
    // const resetParams = {};
    // props.commonFormProps.formData.forEach(item => {
    //   resetParams[item.key] = undefined;
    // });
    // if (props.datekeys) {
    //   props.datekeys.forEach(item => {
    //     item.separateKey.forEach(key => {
    //       resetParams[key] = undefined;
    //     });
    //   });
    // }
    // if (props.cascaderKeys) {
    //   props.cascaderKeys.forEach(item => {
    //     item.separateKey.forEach(key => {
    //       resetParams[key] = undefined;
    //     });
    //   });
    // }
    // const searchParams = { ...state.searchParams, ...resetParams };
    // state.form.resetFields();
    // if (props.onTabReset) {
    //   props.onTabReset(searchParams);
    //   // return;
    // }
    // setState({ searchParams });

    // 新的重置逻辑
    const defaultSearchParams = getInitState().searchParams;
    if (props.onTabReset) {
      props.onTabReset(defaultSearchParams);
    } else {
      setState({ searchParams: defaultSearchParams });
    }
  };
  return (
    <Row
      type="flex"
      style={{ transform: `translateY(${props.filterData ? '13' : '8'}px)` }}
    >
      <Col
        style={{ width: 50, lineHeight: '40px' }}
        // className={props.theme === 'dark' && 'ft-white'}
      >
        搜索：
      </Col>
      <Col className="flex-1" style={{ minHeight: 40 }}>
        <CommonForm
          mode="shrink"
          btnProps={{
            place: 'start',
            submitText: '查询',
            resetBtnProps: {
              style: { marginLeft: -8 }
            },
            shrinkNode: (
              // <ToolTipIcon
              //   iconName="shrink_icon"
              //   imgStyle={{ ...shrinkIconStyle, transform: 'rotate(-180deg)' }}
              // />
              <Icon type="down" />
            ),
            expandNode: (
              // <ToolTipIcon iconName="shrink_icon" imgStyle={shrinkIconStyle} />
              <Icon type="down" rotate={180} />
            )
          }}
          {...props.commonFormProps}
          onSubmit={handleSearch}
          getForm={f => setState({ form: f })}
          onReset={handleReset}
        />
      </Col>
    </Row>
  );
};
export default SearchNode;

const shrinkIconStyle: React.CSSProperties = {
  width: 17,
  height: 17,
  marginLeft: -16
};
