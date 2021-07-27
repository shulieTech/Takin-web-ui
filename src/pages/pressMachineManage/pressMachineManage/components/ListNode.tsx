/**
 * @name
 * @author MingShined
 */
import {
  Badge,
  Button,
  Card,
  Icon,
  Input,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import {
  CommonSelect,
  defaultColumnProps,
  renderToolTipItem,
  useStateReducer
} from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useEffect } from 'react';
import BusinessSelect from 'src/components/business-select';
import SearchTable from 'src/components/search-table';
import { PressMachineManageEnum, StatusColorMap, StatusMap } from '../enum';
import EditModal from '../modals/EditModal';
import PressMachineManageService from '../service';
import { timerInterval } from '../utils';
import renderExpandRow from './RenderExpandRow';
interface Props {}
const ListNode: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    reload: false,
    searchParams: {},
    expandRowKeys: [],
    queryTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    chartDataMap: null
  });
  useEffect(() => {
    let timer = null;
    timer = setInterval(() => {
      setState({ reload: !state.reload });
    }, timerInterval);
    return () => clearInterval(timer);
  }, [state.reload]);
  useEffect(() => {
    let timer = null;
    if (!state.expandRowKeys.length) {
      clearInterval(timer);
      return;
    }
    getChartInfo();
    timer = setInterval(() => {
      getChartInfo();
    }, timerInterval);
    return () => clearInterval(timer);
  }, [state.expandRowKeys, state.queryTime]);
  const getChartInfo = async () => {
    if (!state.queryTime || !state.queryTime.length) {
      return;
    }
    const {
      data: { data, success }
    } = await PressMachineManageService.pressManchineLogChart({
      id: state.expandRowKeys[0],
      queryTime: state.queryTime
    });
    if (success) {
      setState({ chartDataMap: data });
    }
  };
  return (
    <Card title="压力机列表">
      <SearchTable
        commonFormProps={{ formData: getFormData(), rowNum: 6 }}
        commonTableProps={{
          columns: getColumns(state, setState),
          loading: false,
          expandedRowRender: () => renderExpandRow(state, setState),
          style: { border: 'none' },
          size: 'default',
          rowKey: 'id',
          expandedRowKeys: state.expandRowKeys,
          onExpand: (expand, row) => {
            setState({ expandRowKeys: expand ? [row.id] : [] });
          }
        }}
        ajaxProps={{ url: '/pressure/machine/list', method: 'GET' }}
        toggleRoload={state.reload}
        theme="light"
      />
    </Card>
  );
};
export default ListNode;

const getColumns = (state, setState): ColumnProps<any>[] => {
  const handleConfirm = async id => {
    const {
      data: { success }
    } = await PressMachineManageService.deletePressMachine({ id });
    if (success) {
      message.success('删除成功');
      setState({ reload: !state.reload });
    }
  };
  return [
    {
      title: '机器名称',
      dataIndex: PressMachineManageEnum.机器名称,
      ...defaultColumnProps,
      render: text => renderToolTipItem(text, 15)
    },
    {
      title: 'IP地址',
      dataIndex: PressMachineManageEnum.IP地址,
      ...defaultColumnProps
    },
    {
      title: '标签',
      dataIndex: PressMachineManageEnum.标签,
      ...defaultColumnProps,
      render: text => (text ? renderToolTipItem(text, 10) : '--')
    },
    {
      title: '机器水位',
      dataIndex: PressMachineManageEnum.机器水位,
      ...defaultColumnProps,
      render: text => (text ? `${text}%` : '--')
    },
    {
      title: 'CPU',
      dataIndex: PressMachineManageEnum.CPU,
      ...defaultColumnProps
    },
    {
      title: '内存',
      dataIndex: PressMachineManageEnum.内存,
      ...defaultColumnProps
    },
    {
      title: '磁盘',
      dataIndex: PressMachineManageEnum.磁盘,
      ...defaultColumnProps
    },
    {
      title: (
        <span>
          网络带宽
          <Tooltip title="请设置正确的网络带宽值，单位为Mbps，否则无法正确计算带宽使用率。">
            <Icon type="question-circle" />
          </Tooltip>
        </span>
      ),
      dataIndex: PressMachineManageEnum.网络带宽,
      ...defaultColumnProps,
      render: text =>
        text ? (
          `${text}Mbps`
        ) : (
          <span style={{ color: 'var(--FunctionalError-500)' }}>请配置网络带宽</span>
        )
    },
    {
      title: '状态',
      dataIndex: PressMachineManageEnum.状态,
      width: 95,
      ...defaultColumnProps,
      render: text => (
        <Badge color={StatusColorMap[text]} text={StatusMap[text]} />
      )
    },
    {
      title: '使用场景',
      dataIndex: PressMachineManageEnum.使用场景,
      ...defaultColumnProps,
      render: text => (text ? renderToolTipItem(text, 10) : '--')
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 140,
      render: (text, row) => (
        <Fragment>
          <EditModal {...state} setState={setState} data={row} />
          {row[PressMachineManageEnum.状态] === StatusMap.离线 && (
            <Popconfirm
              onConfirm={() => handleConfirm(row.id)}
              title="确定删除吗?"
            >
              <Button type="link" className="mg-l2x">
                移除
              </Button>
            </Popconfirm>
          )}
        </Fragment>
      )
    }
  ];
};

const getFormData = (): FormDataType[] => {
  return [
    {
      label: '',
      key: PressMachineManageEnum.机器名称,
      node: <Input placeholder="机器名称" />
    },
    {
      label: '',
      key: PressMachineManageEnum.IP地址,
      node: <Input placeholder="IP地址" />
    },
    {
      label: '',
      key: PressMachineManageEnum.标签,
      node: <Input placeholder="标签" />
    },
    {
      label: '',
      key: PressMachineManageEnum.状态,
      node: <BusinessSelect type="PRESSURE_MACHINE_STATUS" placeholder="状态" />
    },
    {
      label: '',
      key: 'order',
      node: (
        <CommonSelect
          dataSource={[
            { label: '升序', value: 1 },
            { label: '降序', value: -1 }
          ]}
          placeholder="机器水位排序"
        />
      )
    }
  ];
};
