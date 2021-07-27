/**
 * @name
 * @author MingShined
 */
import { Icon, Input, Popover, Tag } from 'antd';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
interface TagEditorProps {
  dataSource: string[];
  max?: number;
  allowAdd?: boolean;
  emptyNode?: string | React.ReactNode;
  onSubmit?: (dataSource: string[]) => Promise<any> | boolean;
}
const TagEditor: React.FC<TagEditorProps> = props => {
  const [state, setState] = useStateReducer({
    dataSource: [],
    keyword: undefined
  });
  useEffect(() => {
    setState({ dataSource: props.dataSource || [] });
  }, [props.dataSource]);
  const renderContent = () => {
    const dataSource = [...state.dataSource].slice(props.max);
    return (
      <Fragment>
        {dataSource.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </Fragment>
    );
  };
  const handleClose = (index: number) => {
    const dataSource = [...state.dataSource];
    dataSource.splice(index, 1);
    setState({ dataSource });
  };
  const handleAdd = () => {
    const dataSource = [...state.dataSource];
    dataSource.push(state.keyword);
    setState({ dataSource, keyword: undefined });
  };
  return (
    <Fragment>
      {state.dataSource.length
        ? state.dataSource.map((item, index) => {
          if (index < props.max) {
            return <Tag key={index}>{item}</Tag>;
          }
        })
        : props.emptyNode}
      {state.dataSource.length > props.max && (
        <Popover placement="bottomLeft" content={renderContent()} title="标签">
          <Tag>...</Tag>
        </Popover>
      )}
      {props.allowAdd && (
        <CommonModal
          modalProps={{ title: '添加标签' }}
          btnText={<Icon type="plus-circle" />}
          btnProps={{ type: 'link' }}
          beforeOk={() => props.onSubmit(state.dataSource)}
        >
          {state.dataSource.map((item, index) => (
            <Tag closable onClose={() => handleClose(index)} key={item}>
              {item}
            </Tag>
          ))}
          <Input
            value={state.keyword}
            style={{ marginTop: 16 }}
            placeholder="请输入标签名，按下回车确认"
            onChange={e => setState({ keyword: e.target.value })}
            onPressEnter={handleAdd}
          />
        </CommonModal>
      )}
    </Fragment>
  );
};
export default TagEditor;

TagEditor.defaultProps = {
  max: 1,
  allowAdd: true,
  emptyNode: '--'
};
