import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import { getTakinAuthority } from 'src/utils/utils';
import TitleComponent from 'src/common/title';
import UserService from 'src/services/user';

interface EntryRuleProps {
  location?: { query?: any };
  dictionaryMap?: any;
}

const systemInfo: React.FC<EntryRuleProps> = props => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    const {
      data: { success, data }
    } = await UserService.apiSys({});
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
                  display: getTakinAuthority() === 'false'
                    && item.title === '个人信息' ? 'none' : 'block'
                }}
              >
                <TitleComponent content={item.title} />
                {Object.keys(item.dataMap).map((ite, ind) => {
                  return (
                    <div
                      className={
                        ite === 'AMDB版本' ||
                          ite === 'tro地址' ||
                          ite === '用户user-app-key'
                          ? styles.lineDivs
                          : styles.lineDiv
                      }
                      key={ind}
                    >
                      <span
                        style={{
                          float: 'left',
                          color: '#888',
                          marginLeft: '10px',
                          width: '300px'
                        }}
                      >
                        {ite}
                      </span>
                      <span>{item.dataMap[ite]}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};
export default systemInfo;
