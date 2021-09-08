/**
 * @name 影子消费者
 * @author MingShined
 */
import {
  Badge,
  Button,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Switch,
  Tooltip
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment, useEffect } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import TableTitle from 'src/common/table-title/TableTitle';
import { customColumnProps } from 'src/components/custom-table/utils';
import SearchTable from 'src/components/search-table';
import { CommonModelState } from 'src/models/common';
import { MapBtnAuthority } from 'src/utils/utils';
import { ShadowConsumerBean } from '../enum';
import styles from '../index.less';
import AddEditConsumerModal from '../modals/AddEditConsumerModal';
import AppManageService from '../service';
interface Props extends CommonModelState {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
}
const getInitState = () => ({
  isReload: false,
  checkedRows: [],
  MQType: [],
  MQPlan: []
});
type State = ReturnType<typeof getInitState>;
const ShadowConsumer: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>(getInitState());
  useEffect(() => {
    // queryMQType();
    // queryMQPlan();
  }, []);
  /**
   * @name 获取MQ类型
   */
  const queryMQType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMQType({});
    if (success) {
      setState({
        MQType: data
      });
    }
  };

  /**
   * @name 获取mq隔离方案
   */
  const queryMQPlan = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMQPlan({});
    if (success) {
      setState({
        MQPlan: data
      });
    }
  };
  return (
    <div style={{ paddingBottom: 184 }}>
      <TableTitle
        title="影子消费者"
        tip={
          <Tooltip
            placement="bottomLeft"
            trigger="click"
            title={
              <span style={{ lineHeight: '30px', fontSize: 13 }}>
                影子消费者配置可控制当前应用中的消费组是否消费对应的影子消息，以此来实现应用在不同链路中对影子消息的消费管理。若设置了某些消费组不消费影子消息可能导致影子消息队列堆积，请注意及时清理队列中堆积的影子消息。
              </span>}
          >
            <Icon className="mg-l2x" type="question-circle" />
          </Tooltip>
        }
      />
      <SearchTable
        commonTableProps={{
          checkable: true,
          columns: getColumns(state, setState, props),
          className: styles.consumerTable,
          bodyStyle: {
            height: document.body.offsetHeight - 300,
            overflow: 'scroll',
            paddingBottom: 84
          }
        }}
        onCheck={(checkedKeys, checkedRows) => setState({ checkedRows })}
        theme="light"
        commonFormProps={{
          formData: getFormData(state, setState, props),
          rowNum: 6
        }}
        ajaxProps={{
          url: `/consumers/page?applicationId=${props.id}`,
          method: 'GET'
        }}
        toggleRoload={state.isReload}
        // searchParams={{ applicationId: props.id }}
        tableCardProps={{
          style: { background: 'none', border: 'none' }
        }}
        tableAction={
          <AuthorityBtn isShow={MapBtnAuthority('appManage_2_create')}>
            <AddEditConsumerModal
              btnText="添加影子消费者"
              applicationId={props.id}
              onSuccess={() => setState({ isReload: !state.isReload })}
            />
          </AuthorityBtn>}
        footerAction={
          <FooterAction id={props.id} {...state} setState={setState} />}
      />
    </div>
  );
};
export default connect(({ common }) => ({ ...common }))(ShadowConsumer);

const getColumns = (
  state: State,
  setState: (state: Partial<State>) => void,
  props: Props
): ColumnProps<any>[] => {
  const handleDelete = async (id: string) => {
    const {
      data: { success }
    } = await AppManageService.deleteConsumer({
      ids: [id]
    });
    if (success) {
      setState({ isReload: !state.isReload });
      message.success(`删除成功`);
    }
  };
  const handleChangeStatus = async (enable: boolean, row) => {
    const {
      data: { success }
    } = await AppManageService.batchSetConsumer({
      enable,
      applicationId: props.id,
      requests: [row]
    });
    if (success) {
      setState({ isReload: !state.isReload });
      message.success(`设置成功${!enable ? ',需要重启应用后生效' : ''}`);
    }
  };
  return [
    {
      ...customColumnProps,
      title: '业务的topic#业务的消费组',
      dataIndex: ShadowConsumerBean.groupId
    },
    {
      ...customColumnProps,
      title: 'MQ类型',
      dataIndex: ShadowConsumerBean.MQ类型
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: ShadowConsumerBean.状态,
      render: (checked, row) => (
        <Fragment>
          {MapBtnAuthority('appManage_6_enable_disable') ? (
            <Switch
              checkedChildren="可消费"
              onChange={value => handleChangeStatus(value, row)}
              unCheckedChildren="不消费"
              checked={checked}
            />
          ) : (
            <Badge
              text={checked ? '可消费' : '不消费'}
              status={checked ? 'success' : 'default'}
            />
          )}
        </Fragment>
      )
    },
    {
      ...customColumnProps,
      title: '最后修改时间',
      dataIndex: ShadowConsumerBean.最后修改时间
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'actions',
      render: (text, row) => {
        return (
          <Fragment>
            <AuthorityBtn
              isShow={MapBtnAuthority('appManage_3_update') && row.canEdit}
            >
              <AddEditConsumerModal
                id={row.id}
                btnText="编辑"
                onSuccess={() => setState({ isReload: !state.isReload })}
                applicationId={props.id}
              />
            </AuthorityBtn>
            <AuthorityBtn
              isShow={MapBtnAuthority('appManage_4_delete') && row.canRemove}
            >
              <Popconfirm
                onConfirm={() => handleDelete(row.id)}
                title="确认删除吗?"
              >
                <Button className="mg-l1x" type="link">
                  删除
                </Button>
              </Popconfirm>
            </AuthorityBtn>
          </Fragment>
        );
      }
    }
  ];
};

const getFormData = (
  state: State,
  setState: (state: Partial<State>) => void,
  props: Props
): FormDataType[] => {
  return [
    {
      key: ShadowConsumerBean.MQ类型,
      label: '',
      node: (
        <CommonSelect
          dataSource={props.dictionaryMap.SHADOW_CONSUMER}
          placeholder="MQ类型"
        />
      )
    },
    {
      key: ShadowConsumerBean.状态,
      label: '',
      node: (
        <CommonSelect
          dataSource={[
            { label: '可消费', value: true },
            { label: '不消费', value: false }
          ]}
          placeholder="状态"
        />
      )
    },
    {
      key: ShadowConsumerBean.groupId,
      label: '',
      node: <Input placeholder="业务的topic#业务的消费组" />
    }
  ];
};

interface FooterActionProps extends State {
  setState: (state: Partial<State>) => void;
  id: string;
}

const FooterAction: React.FC<FooterActionProps> = props => {
  enum ConsumerType {
    不消费,
    消费
  }
  const handleConfirm = (status: ConsumerType) => {
    Modal.confirm({
      title: `确认批量设置为${ConsumerType[status]}吗?`,
      icon: ' ',
      onOk: async () => {
        const {
          data: { success }
        } = await AppManageService.batchSetConsumer({
          enable: !!status,
          applicationId: props.id,
          requests: props.checkedRows
        });
        if (success) {
          message.success('设置成功');
          props.setState({ isReload: !props.isReload });
        }
      }
    });
  };
  const disabled = !props.checkedRows.length;
  return (
    <Fragment>
      <AuthorityBtn isShow={MapBtnAuthority('appManage_6_enable_disable')}>
        <Button
          onClick={() => handleConfirm(ConsumerType.消费)}
          disabled={disabled}
          type="primary"
        >
          批量设置为消费
        </Button>
      </AuthorityBtn>
      <AuthorityBtn isShow={MapBtnAuthority('appManage_6_enable_disable')}>
        <Button
          onClick={() => handleConfirm(ConsumerType.不消费)}
          disabled={disabled}
          type="primary"
          style={{ marginLeft: 8 }}
        >
          批量设置为不消费
        </Button>
      </AuthorityBtn>
    </Fragment>
  );
};
