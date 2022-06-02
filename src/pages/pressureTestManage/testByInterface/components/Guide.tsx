import React, { useState, useEffect } from 'react';
import { Tooltip, Button } from 'antd';

const Guide = () => {
  const [step, setStep] = useState(0);

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
      targetDom: '',
      placement: 'bottomLeft ',
    },
    {
      title: '编辑场景URL',
      content: <span>-场景新建保存之前需要填写URL哦～</span>,
      targetDom: '',
      placement: 'bottomLeft ',
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
      targetDom: '',
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
      targetDom: '',
      placement: 'topLeft',
    },
  ];

  // useEffect(() => {}, []);

  return (
    step > -1 && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        {guideList.map((x, index, arr) => {
          return (
            <Tooltip
              key={x.title}
              visible={step === index}
              placement={x.placement}
              title={
                <div
                  style={{
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{x.title}</div>
                  <div>{x.content}</div>
                  <div>
                    {index + 1} / {arr.length}
                    <span>
                      <Button
                        ghost
                        onClick={() => {
                          setStep(-1);
                        }}
                      >
                        退出引导
                      </Button>
                      {index < arr.length - 1 && (
                        <Button
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
              <span>1111</span>
            </Tooltip>
          );
        })}
      </div>
    )
  );
};
export default Guide;
