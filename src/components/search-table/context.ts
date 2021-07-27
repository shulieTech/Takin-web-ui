import { useCreateContext } from 'racc';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export const getInitState = () => ({
  searchParams: { current: 0, pageSize: 10, tabKey: '' } as {
    current: number;
    pageSize: number;
    tabKey: string;
  },
  total: 0,
  dataSource: [],
  checkedKeys: [],
  checkedRows: [],
  loading: true,
  form: null as WrappedFormUtils,
  flag: false,
  toggleRoload: false
});

export type State = ReturnType<typeof getInitState>;

export const SearchTableContext = useCreateContext<State>();
