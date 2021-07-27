export interface DescriptCardProps {
  columns: DescriptCardColumnsBean[];
  dataSource: Object;
  emptyNode?: string | React.ReactNode;
}

export interface DescriptCardColumnsBean {
  header?: string | React.ReactNode;
  columns: {
    title: string | React.ReactNode;
    dataIndex: string;
    isCombine?: boolean;
    render?: (text: any, datasource: any, index: number) => React.ReactNode;
  }[];
  span?: number;
  isAlignSelf?: boolean;
  labelStyle?: React.CSSProperties;
  extra?: React.ReactNode;
}

export interface DescriptCardItemProps {
  header: string | React.ReactNode;
  columns: {
    title: string | React.ReactNode;
    dataIndex: string;
    render?: (item: any, index: number) => React.ReactNode;
  }[];
  extra?: React.ReactNode;
  dataSource?: any;
  emptyNode?: React.ReactNode;
}
