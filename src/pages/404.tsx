import { Button, Col, Row } from 'antd';
import React, { Component } from 'react';
import router from 'umi/router';

export default class NotFound extends Component {
  render() {
    return (
      <div
        id="app-slave"
        style={{
          flexDirection: 'column',
          // padding: '16px',
          width: '100%',
          backgroundColor: '#fff',
          marginLeft: '8px',
          marginRight: '8px',
          marginTop: '8px',
          borderRadius: '4px 4px 0 0',
          overflow: 'scroll'
        }}
      />
    );
  }
}
