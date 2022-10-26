import React from 'react';

export default (props) => {
  const { url } = props.location.query;
  return (
    <iframe
      src={url}
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '4px 4px 0 0',
        overflow: 'auto',
        border: 'none',
      }}
    />
  );
};
