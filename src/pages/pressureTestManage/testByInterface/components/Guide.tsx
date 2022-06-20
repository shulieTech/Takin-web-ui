import React, { useState, useEffect, CSSProperties } from 'react';
import { Tooltip, Button, Icon } from 'antd';

const Guide = () => {
  const [step, setStep] = useState(-1);
  const [shadowTargetStyle, setShadowTargetStyle] = useState<CSSProperties>({});

  const guideList = [
    {
      title: '编辑场景名称',
      content: (
        <span>
          -新建场景。可以在编辑页面头部这里进行名称编辑哦～
          <br />
          -后续的名称修改也可以在这里编辑呢～
        </span>
      ),
      placement: 'bottomLeft',
    },
    {
      title: '编辑场景URL',
      content: <span>-场景新建保存之前需要填写URL哦～</span>,
      placement: 'bottomLeft',
    },
    {
      title: 'URL调试',
      content: (
        <span>
          -填写好URL就尝试点击「 调试 」按钮调试一下吧
          <br />
          -「 响应结果 」将在底部的「 响应结果
          」面板呈现哦，你可以点击「响应结果
          」右侧的展开按钮进行快速展开和查看哦
        </span>
      ),
      placement: 'bottomRight',
    },
    {
      title: '参数编辑',
      content: (
        <span>
          -点击这里的按钮可以进「 参数编辑 」<br />
          <span style={{ color: '#00BCD4' }}>
            -TIPS：进行参数管理之前需要先编辑URL内容哦，否则「 参数编辑
            」会不可用的～
          </span>
        </span>
      ),
      placement: 'leftTop',
    },
  ];

  const skipGuide = () => {
    setStep(-1);
    localStorage.setItem('guide-5.7.0', '1');
  };

  useEffect(() => {
    if (step > -1) {
      const targetDom = document.querySelector(`#guide-${step}`);
      if (targetDom) {
        const targetDomRect = targetDom.getBoundingClientRect();
        setShadowTargetStyle({
          position: 'absolute',
          left: targetDomRect.x,
          top: targetDomRect.y,
          width: targetDomRect.width,
          height: targetDomRect.height,
        });
      } else {
        skipGuide();
      }
    }
  }, [step]);

  useEffect(() => {
    if (!localStorage.getItem('guide-5.7.0')) {
      setStep(0);
    }
  }, []);

  return (
    step > -1 && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        {guideList.map((x, index, arr) => {
          return (
            <Tooltip
              key={x.title}
              visible={step === index}
              placement={x.placement}
              overlayStyle={{ minWidth: 370 }}
              title={
                <div
                  style={{
                    color: '#fff',
                    padding: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    type="close"
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 0,
                      cursor: 'pointer',
                    }}
                    onClick={skipGuide}
                  />
                  <div
                    style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}
                  >
                    {x.title}
                  </div>
                  <div style={{ marginBottom: 16 }}>{x.content}</div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                      {index + 1} / {arr.length}
                    </div>
                    <span>
                      <Button
                        size="small"
                        ghost
                        onClick={skipGuide}
                      >
                        退出引导
                      </Button>
                      {index < arr.length - 1 && (
                        <Button
                          size="small"
                          style={{ marginLeft: 16 }}
                          onClick={() => {
                            setStep(index + 1);
                          }}
                        >
                          下一步
                        </Button>
                      )}
                    </span>
                  </div>
                </div>
              }
            >
              <div
                style={step === index ? shadowTargetStyle : { display: 'none' }}
              />
            </Tooltip>
          );
        })}
      </div>
    )
  );
};
export default Guide;
