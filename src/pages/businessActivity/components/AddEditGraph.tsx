import React, { useEffect, useState } from 'react';
import { getEntranceInfo } from '../addEditPage';
import { AddEditActivityModalState } from '../modals/AddEditActivityModal';
import BusinessActivityService from '../service';
import GraphNode from 'src/components/g6-graph/GraphNode';

interface Props extends AddEditActivityModalState {}
const AddEditGraph: React.FC<Props> = (props) => {
  const [grapData, setGraphData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.service && props.serviceList) {
      queryChartInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.service, props.serviceList]);

  const queryChartInfo = async () => {
    setLoading(true);
    const {
      data: { data, success },
    } = await BusinessActivityService.queryChartInfo({
      ...getEntranceInfo(props.serviceList, props.service),
      applicationName: props.app,
      linkId: props.service,
      type: props.serviceType,
    });
    setLoading(false);
    if (success && data.nodes) {
      setGraphData(data);
    }
  };

  const height = document.body.offsetHeight - 220;

  return (
    <div style={{ background: '#F8F9FA', height: height < 500 ? 500 : height }}>
      <GraphNode graphData={grapData} graphKey={grapData?.nodes?.length}/>
    </div>
  );
};
export default AddEditGraph;
