import { Button, Col, Row } from 'antd';
import React, { Component } from 'react';
import router from 'umi/router';

export default class NotFound extends Component {
  componentDidMount() {
    window.location.reload();
  }
  render() {
    return (
      <div
        id="app-slave"
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '4px 4px 0 0',
          overflow: 'scroll'
        }}
      />
    );
  }
}
