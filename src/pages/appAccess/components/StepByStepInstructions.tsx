import React, { Fragment } from 'react';
import styles from './../index.less';
import StepLineInfo from './StepLineInfo';

interface Props {
  agentVersionInfo?: any;
}
const StepByStepInstructions: React.FC<Props> = props => {
  return (
    <div
      className={styles.scriptBorder}
      style={{ padding: '32px 24px ', marginTop: 16 }}
    >
      <p
        style={{
          fontSize: '20px',
          color: 'var(--Netural-14)',
          fontWeight: 600,
          marginBottom: 48
        }}
      >
        步骤说明
      </p>
      <StepLineInfo agentVersionInfo={props.agentVersionInfo}/>
    </div>
  );
};
export default StepByStepInstructions;
