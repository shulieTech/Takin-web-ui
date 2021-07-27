/**
 * @name
 * @author MingShined
 */
import { Graph } from '@antv/g6';
import { Icon, message } from 'antd';
import { CommonForm, CommonModal, useStateReducer, useCreateContext } from 'racc';
import React, { useEffect } from 'react';
import { NodeBean } from '../enum';
import { CommonModelState } from 'src/models/common';
import GraphNode from '../components/GraphNode';
import NodeInfoDrawer from '../components/NodeInfoDrawer';
// import MissionManageService from '../service';
import BusinessActivityService from '../../businessActivity/service';

interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  activityId?: string;
  row: any;
}
const getInitState = () => ({
  infoBarVisible: true,
  nodeVisible: false,
  nodeInfo: null as NodeBean,
  details: null,
  graph: null as Graph,
  node: null as HTMLElement,
  reload: false,
  providerService: null
});
type State = ReturnType<typeof getInitState>;
export const BusinessActivityDetailsContext = useCreateContext<State>();

const ServiceLinkModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>(getInitState());

  const getDetails = async () => {
    const msg = message.loading('获取数据中', 0);
    const {
      data: { data, success }
    } = await BusinessActivityService.getBusinessActivityDetails({
      id: props.activityId
    });
    msg();
    if (success && data) {
      setState({ details: data, nodeVisible: false, });
    }
  };
  return (
    <CommonModal
      modalProps={{ title: '业务链路详情', width: 1200, destroyOnClose: true, footer: null }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={getDetails}
    >
      <BusinessActivityDetailsContext.Provider value={{ state, setState }}>
        <div
          style={{
            background: '#F8F9FA',
            height: '580px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        ><GraphNode id={props.id} />
          <NodeInfoDrawer row={props.row} />
        </div>
      </BusinessActivityDetailsContext.Provider>
    </CommonModal>
  );
};
export default (ServiceLinkModal);
