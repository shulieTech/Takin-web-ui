import React, { useState, useEffect, useContext } from 'react';
import { Button, Icon } from 'antd';
import { PrepareContext } from '../indexPage';
import Help from './Help';
import img1 from 'src/assets/data-isolate-1.png';
import img2 from 'src/assets/data-isolate-2.png';
import img3 from 'src/assets/data-isolate-3.png';
import img4 from 'src/assets/data-isolate-4.png';

interface Props {
  setIsolatePlan: () => void;
}

export default (props) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
        }}
      >
        <div style={{ flex: 1 }} />
        <div>
          隔离方式：影子库
          <a style={{ marginLeft: 16 }} onClick={props.setIsolatePlan}>
            设置
          </a>
        </div>
      </div>
      <div style={{ flex: 1, padding: '64px 90px' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: 24,
            color: 'var(--Netural-900, #303336)',
            fontWeight: 600,
            marginBottom: 64,
          }}
        >
          数据隔离指引
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              padding: 16,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 8,
              width: 187,
              height: 262,
              textAlign: 'center',
            }}
          >
            <img
              src={img1}
              alt="guide-1"
              style={{ maxWidth: '100%', marginBottom: 24 }}
            />
            <div>
              <div
                style={{
                  color: 'var(--Netural-900, #303336)',
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                1、设置隔离方式
              </div>
              <div
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  fontSize: 12,
                  marginBottom: 24,
                }}
              >
                与团队沟通后，需先进行影子库、影子表的选择
              </div>
              <div>
                <Button type="primary" ghost onClick={props.setIsolatePlan}>
                  立即设置
                </Button>
              </div>
            </div>
          </div>
          <Icon
            type="right"
            style={{
              fontSize: 16,
              color: 'var(--Netural-400, #BFC3C8)',
              margin: '56px 24px',
            }}
          />
          <div
            style={{
              padding: 16,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 8,
              width: 187,
              height: 262,
              textAlign: 'center',
            }}
          >
            <img
              src={img2}
              alt="guide-1"
              style={{ maxWidth: '100%', marginBottom: 24 }}
            />
            <div>
              <div
                style={{
                  color: 'var(--Netural-900, #303336)',
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                2、导出隔离数据
              </div>
              <div
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  fontSize: 12,
                  marginBottom: 24,
                }}
              >
                修改好配置后，将配置导出成Excel文件，并发送至DBA
              </div>
            </div>
          </div>
          <Icon
            type="right"
            style={{
              fontSize: 16,
              color: 'var(--Netural-400, #BFC3C8)',
              margin: '56px 24px',
            }}
          />
          <div
            style={{
              padding: 16,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 8,
              width: 187,
              height: 262,
              textAlign: 'center',
            }}
          >
            <img
              src={img3}
              alt="guide-3"
              style={{ maxWidth: '100%', marginBottom: 24 }}
            />
            <div>
              <div
                style={{
                  color: 'var(--Netural-900, #303336)',
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                3、DBA线下设置隔离数据
              </div>
              <div
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  fontSize: 12,
                  marginBottom: 24,
                }}
              >
                DBA根据Takin导出的隔离配置信息进行数据配置
              </div>
            </div>
          </div>
          <Icon
            type="right"
            style={{
              fontSize: 16,
              color: 'var(--Netural-400, #BFC3C8)',
              margin: '56px 24px',
            }}
          />
          <div
            style={{
              padding: 16,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 8,
              width: 187,
              height: 262,
              textAlign: 'center',
            }}
          >
            <img
              src={img4}
              alt="guide-4"
              style={{ maxWidth: '100%', marginBottom: 24 }}
            />
            <div>
              <div
                style={{
                  color: 'var(--Netural-900, #303336)',
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                4、查看Takin检测结果
              </div>
              <div
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  fontSize: 12,
                  marginBottom: 24,
                }}
              >
                Takin每10分钟检测一次 数据源是否创建
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '8px 32px',
          borderTop: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <Help showBanner={false} />
          <span>暂无数据源</span>
        </div>
        <div>
          <span style={{ marginLeft: 40 }}>负责人：朱七七</span>
        </div>
      </div>
    </div>
  );
};
