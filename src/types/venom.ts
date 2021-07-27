import { SiderTheme } from 'antd/lib/layout/Sider';

declare const layoutOptions: ['header', 'sider'];
type LayouProps = (typeof layoutOptions)[number];
declare const contentWidthModeOptions: ['fixed', 'fluid'];
type ContentWidthMode = (typeof contentWidthModeOptions)[number];
export interface VenomBasicConfig {
    /** document title 页面标题 */
  title: string;
  /** 头部高度 */
  headerHeight: number;
  /** 侧栏宽度 */
  siderWidth: number;
  /** 定宽模式下，内容宽度 */
  contentWidthMode: ContentWidthMode;
  /** 内容背景色 */
  contentBg: string;
  /** 页脚背景色 */
  footerBg: string;
  /** 页头背景色 */
  headerBg: string;
  /** 页头文字颜色 */
  headerColor: string;
  /** 主题 */
  theme: SiderTheme;
  /** 布局模式 {头部布局} || {侧栏布局} */
  layout: LayouProps;
  /** 侧栏布局时，是否可以展开多菜单 */
  siderMultiple: boolean;
  /** 是否固定头部 */
  fixHeader: boolean;
  /** 是否固定侧栏 */
  fixSider: boolean;
}
