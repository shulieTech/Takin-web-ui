/**
 * @name
 * @author MingShined
 */
import { Button, Col, Icon, Input, Modal, Row, Spin } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';
import { useStateReducer } from 'racc';
import React, { useEffect, useRef } from 'react';
import { ThreadInitStateProps } from '.';
import CardItem from '../../common/CardItem';
import { AnalysisEnum, tipColor } from '../../enum';
import AnalysisService from '../../service';

interface Props extends ThreadInitStateProps {
  setThreadState: (state: Partial<ThreadInitStateProps>) => void;
}

const initState = {
  threadList: [],
  threadName: null,
  threadStatus: null,
  statusList: [],
  keyword: '',
  loading: false
};

type State = typeof initState;

interface ChildrenProps extends State {
  setState: (state: Partial<State>) => void;
}

const ThreadList: React.FC<Props> = props => {
  const { threadCpuData, time, setThreadState } = props;
  const title = `线程选择 - ${time}`;
  if (!time) {
    return (
      <CardItem title={title}>
        {/* <div>暂无数据</div> */}
        <div style={{ color: tipColor }}>
        请先在上方趋势图中进行节点选择
        </div>
      </CardItem>
    );
  }
  const baseId = threadCpuData.find(item => item.time === time).baseId;
  const [state, setState] = useStateReducer(initState);
  const InputRef = useRef(null);
  useEffect(() => {
    if (time) {
      const params = { threadName: null, threadStatus: null };
      InputRef.current.state.value = null;
      queryThreadList(params);
    }
  }, [time]);
  const queryThreadList = async (params = {} as any) => {
    setState({ loading: true });
    const {
      data: { data, success }
    } = await AnalysisService.queryThreadList({
      baseId,
      // threadName: state.threadName,
      // threadStatus: state.threadStatus,
      ...params
    });
    if (success) {
      const threadList = handleFilter(data.details, params.threadStatus);
      setState({
        threadList,
        statusList: data.status,
        loading: false,
        ...params
      });
    }
  };
  const handleFilter = (list, threadStatus) => {
    let result = [...list];
    const keyword = InputRef.current.state.value;
    if (keyword) {
      result = result.filter(
        item =>
          item[AnalysisEnum.线程名称]
            .toLowerCase()
            .indexOf(keyword.toLowerCase()) !== -1
      );
    }
    if (threadStatus) {
      result = result.filter(item => item.threadStatus === threadStatus);
    }
    return result;
  };
  return (
    <CardItem title={title}>
      <Spin spinning={state.loading}>
        <RadioNode
          queryThreadList={queryThreadList}
          {...state}
          setState={setState}
        />
        <Input
          placeholder="请输入"
          className="mg-t2x mg-b2x"
          ref={InputRef}
          suffix={<Icon type="search" />}
          onPressEnter={() => {
            queryThreadList({
              threadName: InputRef.current.state.value || null,
              threadStatus: state.threadStatus
            });
          }}
        />
        <ListNode {...props} {...state} setState={setState} />
      </Spin>
    </CardItem>
  );
};
export default ThreadList;

/** @name radio搜索 */
const RadioNode: React.FC<ChildrenProps & { queryThreadList: any }> = props => {
  return (
    <RadioGroup
      value={props.threadStatus || ''}
      onChange={e =>
        props.queryThreadList({ threadStatus: e.target.value || null })
      }
    >
      {props.statusList.map(item => (
        <RadioButton key={item.status} value={item.status}>
          {/* <Badge style={{ top: -6, right: -15 }} text={item.status} count={item.count}> </Badge> */}
          {item.status || '全部'}
          <span>({item.count})</span>
        </RadioButton>
      ))}
    </RadioGroup>
  );
};

const ListNode: React.FC<ChildrenProps & Props> = props => {
  const [state, setState] = useStateReducer({
    visible: false,
    threadName: undefined,
    threadStack: null
  });
  const getMethodStack = async info => {
    setState({ visible: true, threadName: info[AnalysisEnum.线程名称] });
    const {
      data: { data, success }
    } = await AnalysisService.getMethodStack({
      link: info.threadStackLink
    });
    if (success) {
      setState({ threadStack: data.threadStack });
    } else {
      setState({ threadStack: null });
    }
  };
  return (
    <div style={{ border: '1px solid #ddd', height: 305, overflow: 'auto' }}>
      {props.threadList.map((item, index) => (
        <Row
          className="pd-2x"
          style={{
            borderTop: index && '1px solid #ddd',
            cursor: 'pointer',
            background:
              props.threadStackLink === item.threadStackLink && '#e1e1e1'
          }}
          type="flex"
          justify="space-between"
          align="middle"
          key={index}
          onClick={() =>
            props.setThreadState({
              threadStackLink: item.threadStackLink,
              selectThreadName: item[AnalysisEnum.线程名称]
            })
          }
        >
          <Col className="flex-1">
            <div style={{ wordBreak: 'break-all' }}>
              {item[AnalysisEnum.线程名称]}
            </div>
            <div>CPU利用率：{item[AnalysisEnum.cpu利用率]}%</div>
          </Col>
          <Col style={{ width: 74 }}>
            <Button
              onClick={e => {
                e.stopPropagation();
                getMethodStack(item);
              }}
              type="link"
            >
              方法栈
            </Button>
          </Col>
        </Row>
      ))}
      <Modal
        onCancel={() => setState({ visible: false })}
        title={`线程名称：${state.threadName}`}
        visible={state.visible}
        footer={null}
        bodyStyle={{ maxHeight: 450, overflow: 'auto' }}
      >
        {state.threadStack || '暂无数据'}
      </Modal>
    </div>
  );
};
