/**
 * @name
 * @author MingShined
 */
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from '../../whitelistSwitch/index.less';
import GlobalConfigService from '../service';
interface Props {}
const DumpMemery: React.FC<Props> = props => {
  const [path, setPath] = useState(undefined);
  useEffect(() => {
    getInfo();
  }, []);
  const getInfo = async () => {
    const { data } = (await GlobalConfigService.getDumpThread({
      configCode: 'DUMP_MEMORY_FILE_PATH'
    })) as any;
    if (data.code === 200) {
      setPath(data.data.configValue);
    }
  };
  const handleSave = async () => {
    const { data } = (await GlobalConfigService.saveDumpThread({
      configCode: 'DUMP_MEMORY_FILE_PATH',
      configValue: path
    })) as any;
    if (data.code === 200) {
      message.success('保存成功');
    }
  };
  return (
    <div style={{ padding: '16px 24px' }}>
      <div className={styles.title}>Dump 内存文件路径配置</div>
      <div className="mg-t4x">
        <Input
          value={path}
          onChange={e => setPath(e.target.value)}
          style={{ width: 400 }}
        />
        <Button onClick={handleSave} className="mg-l2x" type="primary">
          保存
        </Button>
      </div>
      <div style={{ color: 'red', marginTop: 16 }}>
        重要提示：需要提前创建当前路径的文件夹，否则无法执行dump操作。
      </div>
    </div>
  );
};
export default DumpMemery;
