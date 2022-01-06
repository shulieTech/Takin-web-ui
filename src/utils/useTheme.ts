import { useEffect } from 'react';

declare var window;

export default () => {
  if (!window.less) {
    return {};
  }
  const emptyConfig = {
    antVars: {}, // antd主题变量
    cssVars: {}, // css 主题变量
    logo: '',
    loginPic: '', // 登录页图片
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

  const rootEle = document.querySelector('[id^=root-]');

  const loadThemeConfig = ({
    antVars = getThemeConfig().antVars || {},
    cssVars = getThemeConfig().cssVars || {},
  } = {}) => {
    window.less.modifyVars(antVars);
    Object.entries(cssVars).forEach(([k, v]) => {
      rootEle?.style?.setProperty(k, v);
    });
  };

  const setThemeVars = (option: { antVars?: object, cssVars?: object }) => {
    const oldConfig = getThemeConfig();
    const config = {
      ...oldConfig,
      antVars: {
        ...oldConfig.antVars,
        ...(option.antVars || {}),
      },
      cssVars: {
        ...oldConfig.cssVars,
        ...(option.cssVars || {}),
      },
    };
    loadThemeConfig(config);
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
    localStorage['takin-theme'] = JSON.stringify(emptyConfig);
    rootEle?.style = '';
    loadThemeConfig();
  };

  return {
    loadThemeConfig,
    setThemeVars,
    getThemeByKeyName,
    setThemeByKeyName,
    resetTheme,
  };
};

// import useTheme from 'src/utils/useTheme';

// const { setThemeVars, resetTheme, loadThemeConfig } = useTheme();

// useEffect(() => {
//   loadThemeConfig();
// }, []);

// const setTheme = () => {
//   setThemeVars({
//     antVars: {
//       'primary-color': 'red',
//     },
//     cssVars: {
//       '--BrandPrimary-500': 'red',
//       '--BrandPrimary-600': 'dark',
//     },
//   });
// };

// <span onClick={setTheme}>changeTheme</span>
// <span onClick={resetTheme}>resetTheme</span>