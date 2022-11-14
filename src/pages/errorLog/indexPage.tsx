/**
 * @author chuxu
 */
import React, { Fragment } from 'react';
import CustomDetailHeader from 'src/common/custom-detail-header';
import { MainPageLayout } from 'src/components/page-layout';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { useCreateContext, useStateReducer } from 'racc';
import ErrorLogSearchAndTable from './components/ErrorLogSearchAndTable';
import moment from 'moment';
import commonsStyles from './../../custom.less';
import { Modal } from 'antd';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';

const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  searchInputValue: undefined, // 应用搜索
  loading: false,
  total: 0,
  dataSource: null,
  agentIdValue: null, // agentID搜索
  logValue: null, // 异常日志搜索
  startTime: moment().subtract(7, 'days'),
  endTime: moment().subtract(0, 'days'),
  disabledStartTime: moment().subtract(7, 'days'),
  errorMsg: null,
  isShow: false
});
export const ErrorLogContext = useCreateContext<ErrorLogState>();
export type ErrorLogState = ReturnType<typeof getInitState>;
interface Props {}
const ErrorLog: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const ErrorModal = text => {
    return (
      <Modal
        onCancel={() => {
          setState({
            isShow: false,
            errorMsg: null
          });
        }}
        width={960}
        title="异常日志"
        visible={state.isShow}
        footer={null}
      >
        <CodeMirrorWrapper
          onChange={() => true}
          value={text}
          restProps={{ readOnly: 'nocursor' }}
        />
      </Modal>
    );
  };
  return (
    <ErrorLogContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <div className={commonsStyles.listHeaderBorders}>
          <CustomDetailHeader
            title="探针异常日志"
            img={
              <CustomIcon
                imgWidth={28}
                color="var(--BrandPrimary-500)"
                imgName="redis_icon"
                iconWidth={64}
              />
            }
            // description="探针异常日志说明"
          />
        </div>
        <ErrorLogSearchAndTable />
        {ErrorModal(state.errorMsg)}
      </MainPageLayout>
    </ErrorLogContext.Provider>
  );
};
export default ErrorLog;
