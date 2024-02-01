import {
    Button,
    message,
  } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import Loading from 'src/common/loading';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { router } from 'umi';
import moment from 'moment';
import styles from './../index.less';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PressureTestReportService from '../service';
import './../../../../global.less';
  
interface Props {
  btnText?: string | React.ReactNode;
  activityName?: string;
  datas?: any;
  reportIds?: any;
  startTime?: any;
  traceId?: any;
  activityId: any;
  sceneId: any;
}

interface State {
  isReload?: boolean;
  data: any;
  loading: boolean;
  originData: any[];
  reportIds: any;
}
const CompareNodeModal: React.FC<Props> = props => {
  const { reportIds , activityId, sceneId } = props;
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    data: null,
    originData: null,
    loading: false,
    reportIds: []
  });
  const { activityName } = props;
  const handleClick = () => {
    if (reportIds?.length > 1) {
      queryRequestDetail({
        sceneId,
        reportIds,
        activityId
      });
    }
  };

  const exportPDF = () => {
    const input = document.getElementById('compare-to-export'); // 获取需要导出的内容的DOM节点
    
    html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // 创建一个新的PDF文档，设置纸张大小为A4
    
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // 将图片添加到PDF文档中
          pdf.save(`${activityName}-报告${state?.reportIds?.[0]}-报告${state?.reportIds?.[1]}`); // 保存并下载PDF文档
        })
        .catch((err) => {
          console.error('Error exporting PDF:', err);
        });
  };

  /**
   * @name 获取节点对比
   */
  const queryRequestDetail = async value => {
    setState({
      data: null,
      loading: true
    });
    const {
      data: { success, data }
    } = await PressureTestReportService.queryNodeCompare({
      ...value
    });
    if (success) {
      if (data) {
        setState({
          data: data?.node,
          reportIds: data?.reportIds,
          loading: false
        });
      } else {
        setState({
          data: null,
          loading: false
        });
      }
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    const columns: ColumnProps<any>[] = [
      {
        ...customColumnProps,
        title: '方法名/服务名',
        dataIndex: 'service',
      },
      {
        ...customColumnProps,
        title: '应用名/中间件名',
        dataIndex: 'label',
      },
    ];
  
    // 动态添加报告列
    state.reportIds.forEach((reportId, index) => {
      columns.push({
        ...customColumnProps,
        title: `报告${reportId}（平均RT/ms）`,
        dataIndex: `service${index + 1}Rt`,
      });
    });
  
    return columns;
  };

  return (
    <CommonModal
      modalProps={{
        width: 'calc(100% - 100px)',
        footer: null,
        maskClosable: false,
        centered: true,
        title: (
          <p style={{ fontSize: 16 }}>
            {activityName}
            <Button style={{ float: 'right', marginRight: 20 }} onClick={exportPDF}>导出节点对比</Button>
          </p>
        ),
        // getContainer: () => window.parent.document.body,
      }}
      btnProps={{}}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <div
        style={{ height: document.body.clientHeight - 200, overflow: 'auto' }}
      >
        {state.loading ? <Loading /> : (
          <div id="compare-to-export" className={styles.detailTable}>

            {reportIds?.length > 1 ? <CustomTable
              rowKey="id"
              columns={getColumns()}
              size="small"
              dataSource={[state.data]}
              defaultExpandAllRows={true}
              childrenColumnName="nodes"
            /> : <div>请先选择报告对比</div>}
          </div>
        )   
        }
      </div>
    </CommonModal>
  );
};
export default CompareNodeModal;
