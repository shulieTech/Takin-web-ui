import React from 'react';
import { Button } from 'antd';
import bg from 'src/assets/interface-test-bg.png';

interface Props {
  onCreate: () => void;
}

const IntroduceSence: React.FC<Props> = (props) => {
  const infoList = [
    {
      title: '场景编辑',
      desc: '业务流程是压测配置的必填项',
    },
    {
      title: '接口调试',
      desc: '业务流程是压测配置的必填项',
    },
    {
      title: '压测编辑',
      desc: '业务流程是压测配置的必填项',
    },
    {
      title: '压测启动',
      desc: '业务流程是压测配置的必填项',
    },
  ];
  return (
    <div style={{ margin: 32 }}>
      <div
        style={{
          backgroundImage: `url(${bg}), linear-gradient(90deg, #F3F6F7 0%, #FAFCFC 102.75%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right',
          padding: 32,
        }}
      >
        <h1
          style={{
            color: 'var(--Netural-990, #25282A)',
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          接口测试
        </h1>
        <div style={{ margin: '16px 0' }}>
          测试环境单接口压测功能模块简介测试环境单接口压测功能模块简介测试环境单接口压试着创建一个压测场景吧～
        </div>
        <Button type="primary" onClick={props.onCreate}>
          创建压测场景
        </Button>
      </div>
      <div>
        {infoList.map((x, i, arr) => (
          <div
            key={x.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '24px 0',
              borderBottom:
                i !== arr.length - 1
                  ? '1px solid var(--Netural-100, #EEF0F2)'
                  : '',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--Netural-200, #E5E8EC)',
                borderRadius: '100%',
                marginRight: 32,
                fontSize: 24,
                color: 'var(--Netural-900, #303336)',
              }}
            >
              {i + 1}
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  color: 'var(--Netural-990, #25282A)',
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                {x.title}
              </div>
              <div
                style={{
                  color: 'var(--Netural-800, #5A5E62)',
                }}
              >
                {x.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroduceSence;
