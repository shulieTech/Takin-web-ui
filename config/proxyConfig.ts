const devPath = 'http://192.168.1.243:8004/';
export default {
  '/api/': {
    target: devPath,
    changeOrigin: false
  }
};
