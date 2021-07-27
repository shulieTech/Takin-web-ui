/**
 * @name
 * @author Xunhuan
 */
import React, { Fragment } from 'react';
import styles from '../index.less';

import { Menu, Icon, Button } from 'antd';
import Link from 'umi/link';

interface Props {
  itemData: {
    title: string;
    path: string;
  };
  itemIndex: number;
  navTabChecked: string;
  handlerClose?: (arg: string, idx: number) => void;
}

// const TabItem = (props): React.ReactNode => {
const TabItem: React.FC<Props> = props => {
  return (
    <div
      className={
        props.itemData && props.navTabChecked === props.itemData.path
          ? styles.tabItemSelected
          : styles.tabItem
      }
    >
      <Link to={props.itemData && props.itemData.path}>
        {props.itemData && props.itemData.title}
      </Link>
      {props.itemIndex !== 0 && (
        <Button
          className={styles.tabItemClose}
          type="link"
          onClick={() => {
            props.handlerClose(
              props.itemData && props.itemData.path,
              props.itemIndex
            );
          }}
        >
          <Icon type="close" />
        </Button>
      )}
    </div>
  );
};
export default TabItem;
