import { VenomBasicConfig } from './types/venom';

interface VenomConfigBean extends VenomBasicConfig {
  isTagRouter: 'product' | 'dev';
  defaultPageProps: { title: string; path: string; query: any };
}

const venomBasicConfig: VenomConfigBean = {
  title: '全链路压测平台',
  headerHeight: 50,
  siderWidth: 160,
  contentBg: '#EEF0F2',
  footerBg: '#EEF0F2',
  theme: 'dark',
  layout: 'sider',
  siderMultiple: true,
  fixHeader: true,
  fixSider: true,
  headerBg: '#354153',
  contentWidthMode: 'fluid',
  headerColor: '#7d8da6'
};

export default venomBasicConfig;
