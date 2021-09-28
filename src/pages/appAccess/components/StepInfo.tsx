import { Button, Icon, message, Steps } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import { AppAccessContext } from '../indexPage';

import styles from './../index.less';
import FirstContent from './FirstContent';
import SecondContent from './SecondContent';
import ThirdContent from './ThirdContent';
interface Props {
  state: any;
  setState: (value: any) => void;
}
const StepInfo: React.FC<Props> = props => {
  const { state, setState } = props;
  const { currentStep } = state;
  const { Step } = Steps;
  const steps = [
    {
      title: '选择版本与应用',
      content: <FirstContent state={state} setState={setState} />
    },
    {
      title: '下载安装脚本并执行',
      content: <SecondContent state={state} setState={setState} />
    },
    {
      title: '验证结果',
      content: <ThirdContent state={state} setState={setState} />
    }
  ];
  useEffect(() => {
    stepIsDisabled();
  }, [state.appName]);

  useEffect(() => {
    stepIsDisabled();
  }, [state.currentStep, state.downloadTime]);

  const next = () => {
    const current = state.currentStep + 1;
    setState({ currentStep: current });
  };

  const prev = () => {
    const current = state.currentStep - 1;
    setState({ currentStep: current });
  };

  const stepIsDisabled = () => {
    switch (currentStep) {
      case 0:
        !state.appName || !state.agentVersionInfo
          ? setState({
            stepIsDisabled: true
          })
          : setState({
            stepIsDisabled: false
          });
        break;
      case 1:
        !state.downloadTime
          ? setState({
            stepIsDisabled: true
          })
          : setState({
            stepIsDisabled: false
          });
        break;
      default:
        setState({
          stepIsDisabled: true
        });
        break;
    }
  };

  return (
    <div className={styles.stepsWrap}>
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={styles.stepsContent}>{steps[currentStep].content}</div>
      <div className={styles.stepsButton}>
        <Button
          style={{ float: 'left' }}
          onClick={() => {
            setState({
              accessModal: true
            });
          }}
        >
          <Icon type="question-circle" style={{ marginRight: 8 }} />
          接入说明
        </Button>
        {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={() => prev()}>
            上一步
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            disabled={state.stepIsDisabled}
            type="primary"
            onClick={() => next()}
          >
            下一步
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepInfo;
