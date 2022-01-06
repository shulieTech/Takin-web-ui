import { useEffect } from 'react';

declare var window;

export default () => {
  if (!window.less) {
    return {};
  }
  const emptyConfig = {
    vars: {},
    logo: '',
    loginPic: '',
  };
  const getThemeConfig = () => {
    let config = emptyConfig;
    try {
      config = JSON.parse(localStorage['takin-theme']);
    } catch (error) {
      // console.log('获取主题设置失败'); 
    }
    return config;
  };

  const loadThemeConfig = (vars = getThemeConfig().vars) => {
    window.less.modifyVars(vars);
  };

  const setThemeVars = (option) => {
    const config = getThemeConfig();
    config.vars = {
      ...config.vars,
      ...option,
    };
    loadThemeConfig(config.vars);
    localStorage['takin-theme'] = JSON.stringify(config);
  };

  const getThemeByKeyName = (keyName: 'logo' | 'loginPic') => {
    const config = getThemeConfig();
    return config[keyName];
  };

  const setThemeByKeyName = (keyName: 'logo' | 'loginPic', value: any) => {
    const config = getThemeConfig();
    config[keyName] = value;
    localStorage['takin-theme'] = JSON.stringify(config);
  };

  const resetTheme = () => {
    loadThemeConfig({});
    localStorage['takin-theme'] = JSON.stringify(emptyConfig);
  };

  return {
    loadThemeConfig,
    setThemeVars,
    getThemeByKeyName,
    setThemeByKeyName,
    resetTheme,
  };
};
