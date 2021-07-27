import { ColumnProps } from 'antd/lib/table';

/**
 * @name 表格默认属性
 */
export const customColumnProps: ColumnProps<any> = {
  align: 'left',
  render: text => (text || text === 0 ? text : '-')
};
