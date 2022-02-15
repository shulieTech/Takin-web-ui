/**
 * @name
 * @author MingShined
 */
import Select, { SelectProps } from 'antd/lib/select';
import { CommonSelect, renderToolTipItem } from 'racc';
import React, { useContext, useEffect, useState } from 'react';
import CustomSelect from '../common/CustomSelect';
import { ThreadContext } from '../context';
import styles from '../index.less';
import AnalysisService from '../service';
import { AnalysisProps } from '../types';

interface Props extends AnalysisProps {}

const AnalysisExtra: React.FC<Props> = props => {
  const { state, setState } = useContext(ThreadContext);
  const [processList, setProcessList] = useState([]);
  useEffect(() => {
    if (state.appName) {
      queryProcessList();
    }
  }, [state.appName]);
  const queryProcessList = async () => {
    const {
      data: { data, success }
    } = await AnalysisService.queryProcessList({
      appName: state.appName,
      reportId: props.query.reportId
    });
    if (success && data && data.length) {
      setProcessList(data);
      setState({ processName: data[0].value });
    }
  };
  const selectProps: SelectProps = {
    style: {
      width: 200,
      marginLeft: 16
    }
  };
  const renderOptions = item => (
    <Select.Option key={item.value} value={item.value}>
      {renderToolTipItem(item.label, 20)}
    </Select.Option>
  );
  return (
    <div className={styles.extra}>
      <CustomSelect
        placeholder="请选择应用"
        url="/thread/application"
        params={{ reportId: props.query.reportId }}
        value={state.appName}
        onSuccess={data =>
          setState({ appName: data?.[0]?.value })
        }
        onChange={value => setState({ appName: value, processName: undefined })}
        {...selectProps}
        onRender={renderOptions}
      />
      <CommonSelect
        dataSource={processList}
        placeholder="请选择进程"
        value={state.processName}
        onChange={value => setState({ processName: value })}
        {...selectProps}
        onRender={renderOptions}
      />
    </div>
  );
};
export default AnalysisExtra;
