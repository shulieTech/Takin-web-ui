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
      desc: (
        <span>
          1. 对压测API的组装，能满足一次请求的所有信息，目前仅支持http请求
          <br />
          2. 对串联/并行链路的组装，目前仅支持单接口 <br />
          3.
          若压测API使用了来自数据文件的参数，请使用参数管理上传文件，并进行参数关联
          <br />
        </span>
      ),
    },
    {
      title: '场景调试',
      desc: '场景配置完成后，需要先对场景进行调试来验证配置场景是否合理',
    },
    {
      title: '施压配置',
      desc: '在施压配置中，可以指定不同的压测目标、压测模式、压测策略，对压测配置进行个性化设置，由此来检验各业务活动的性能',
    },
    {
      title: '压测启动',
      desc: (
        <span>
          1. 压测启动前，将会对场景配置、剩余流量、压力机环境进行系列配置 <br />
          2. 启动成功后，可观测压测实况，以观测各业务活动的性能
        </span>
      ),
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
          paddingRight: 340,
        }}
      >
        <h1
          style={{
            color: 'var(--Netural-990, #25282A)',
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          Takin压测
        </h1>
        <div style={{ margin: '16px 0' }}>
          Takin自研压测场景，支持流程编排、场景的调试、并发模式的压测
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
