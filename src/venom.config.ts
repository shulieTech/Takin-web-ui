import { VenomBasicConfig } from './types/venom';

interface VenomConfigBean extends VenomBasicConfig {
  isTagRouter: 'product' | 'dev';
  defaultPageProps: { title: string; path: string; query: any };
}

const venomBasicConfig: VenomConfigBean = {
  title: '性能测试平台',
  headerHeight: 50,
  siderWidth: 160,
  contentBg: '#1D2530',
  footerBg: '#fff',
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
