import React, { useEffect, useState, Fragment } from 'react';
// import styles from './index.less';
import { getTakinAuthority } from 'src/utils/utils';
import TitleComponent from 'src/common/title';
import UserService from 'src/services/user';
import { Table } from 'antd';
import axios from 'axios';

interface EntryRuleProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

const SystemInfo: React.FC<EntryRuleProps> = (props) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    const { data: json } = await axios.get('./version.json');
    const {
      data: { success, data },
    } = await UserService.apiSys({
      version: json,
    });
    if (success) {
      setFileList(data.itemVos);
    }
  };

  return (
    <Fragment>
      <div style={{ padding: '10px 60px' }}>
        {fileList &&
          fileList.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display:
                    getTakinAuthority() === 'false' && item.title === '个人信息'
                      ? 'none'
                      : 'block',
                }}
              >
                <TitleComponent content={item.title} />
                <Table
                  showHeader={false}
                  pagination={false}
                  dataSource={Object.entries(item.dataMap).map(
                    ([key, val]) => ({ key, val })
                  )}
                  style={{ marginLeft: 60, marginRight: 60, maxWidth: 800 }}
                  columns={[
                    { dataIndex: 'key', width: 200 },
                    {
                      dataIndex: 'val',
                      render: (text) => (
                        <span style={{ wordBreak: 'break-all' }}>
                          {text || '-'}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};
export default SystemInfo;
