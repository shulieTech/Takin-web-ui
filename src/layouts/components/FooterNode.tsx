/**
 * @name 页脚
 */
import React from 'react';
import { Layout } from 'antd';
import venomBasicConfig from 'src/venom.config';
const { Footer } = Layout;

const FooterNode: React.FC = props => {
  return (
    <Footer
      id="footer"
      className="ft-ct"
      style={{ background: venomBasicConfig.footerBg }}
    >
      <p>Copyright@ {new Date().getFullYear()} 移动云</p>
    </Footer>
  );
};

export default FooterNode;
