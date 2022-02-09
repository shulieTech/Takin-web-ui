import request from 'src/utils/request';

declare var window;

export default async (filePath, fileName) => {
  const { data, status, headers } = await request({
    url: `${window.serverUrl}/file/download?filePath=${filePath}`,
    responseType: 'blob',
    headers: {
      'x-token': localStorage.getItem('full-link-token'),
      'Auth-Cookie': localStorage.getItem('auth-cookie'),
      'tenant-code': localStorage.getItem('tenant-code'),
      'env-code': localStorage.getItem('env-code'),
    },
  });
  const blob = new Blob([data], { type: `` });

  // 获取heads中的filename文件名
  const downloadElement = document.createElement('a');
  // 创建下载的链接
  const href = window.URL.createObjectURL(blob);

  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
  return Promise.resolve('');
};