// import { Button, Col, Row } from 'antd';
// import React, { Component } from 'react';
// import router from 'umi/router';

// export default class NotFound extends Component {
//   render() {
//     return (
//       <div
//         id="app-slave"
//         style={{
//           flexDirection: 'column',
//           width: '100%',
//           height: '100%',
//           backgroundColor: '#fff',
//           borderRadius: '4px 4px 0 0',
//           overflow: 'scroll'
//         }}
//       />
//     );
//   }
// }

import React, { useState, useEffect } from 'react';
import { withRouter } from 'umi';

const NotFound = withRouter((props) => {
  const {
    location: { pathname },
  } = props;
  const [frameSrc, setFrameSrc] = useState('');

  const getFrameSrc = () => {
    if (pathname.startsWith('/pro')) {
      setFrameSrc(`/tro-pro/${window.location.hash}`);
    }
  };

  useEffect(() => {
    getFrameSrc();
  }, [pathname]);

  return (
    <iframe
      src={frameSrc}
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '4px 4px 0 0',
        overflow: 'scroll',
        border: 'none',
      }}
    />
  );
});

export default NotFound;
