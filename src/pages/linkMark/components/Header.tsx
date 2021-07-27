import React from 'react';

import styles from './../index.less';

interface Props {
  title?: string;
}

const Header: React.FC<Props> = props => {
  return <div className={styles.header}>{props.title}</div>;
};
export default Header;
