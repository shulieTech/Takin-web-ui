/**
 * @name
 * @author MingShined
 */
import React from 'react';
interface Props {
  text?: string;
}
const EmptyNode: React.FC<Props> = props => {
  return (
    <div className="ft-ct">
      <div
        style={{
          width: 100,
          height: 100,
          background: '#ddd',
          borderRadius: '100%',
          margin: '24px auto'
        }}
      />
      <div>请先在右上角选择应用与进程，查看对应的分析数据</div>
    </div>
  );
};
export default EmptyNode;
