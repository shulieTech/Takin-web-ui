/**
 * @name ToolTipIcon
 * @author chuxu
 */

import React from 'react';
import { Tooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import styles from './index.less';

interface ToolTipIconProps {
  isToolTip?: boolean;
  toolTipProps?: TooltipProps;
  iconName: string;
  imgStyle?: React.CSSProperties;
  title?: string | React.ReactNode;
}

const ToolTipIcon: React.FC<ToolTipIconProps> = props => {
  return props.isToolTip ? (
    <Tooltip title={props.title} {...props.toolTipProps}>
      <img
        className={!props.imgStyle && styles.actionIcon}
        style={{ ...props.imgStyle }}
        src={require(`../../assets/${props.iconName}.png`)}
      />
    </Tooltip>
  ) : (
    <img
      className={!props.imgStyle && styles.actionIcon}
      style={props.imgStyle}
      src={require(`../../assets/${props.iconName}.png`)}
    />
  );
};
export default ToolTipIcon;

ToolTipIcon.defaultProps = {
  isToolTip: true
};
