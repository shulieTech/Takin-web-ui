import { useEffect } from 'react';

declare var window;
interface ThemmeConfig {
  antVars?: object;
  cssVars?: object;
  loginPic?: string;
  logo?: string;
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

/**
 * 登录页用的class写的，所以这个方法没有放到hooks里
 */
export const getThemeByKeyName = (keyName: 'logo' | 'loginPic') => {
  const config = getThemeConfig();
  return config[keyName];
};

export default () => {
  if (!window.less) {
    return {};
  }

  const rootEle = document.body;

  const loadThemeConfig = ({
    antVars = getThemeConfig().antVars || {},
    cssVars = getThemeConfig().cssVars || {},
  } = {}) => {
    window.less.modifyVars(antVars);
    Object.entries(cssVars).forEach(([k, v]) => {
      rootEle?.style?.setProperty(k, v as string);
    });
  };

  const setTheme = ({ antVars, cssVars, ...rest }: ThemmeConfig = {}) => {
    const oldConfig = getThemeConfig();
    const config = {
      ...oldConfig,
      antVars: {
        ...oldConfig.antVars,
        ...(antVars || {}),
      },
      cssVars: {
        ...oldConfig.cssVars,
        ...(cssVars || {}),
      },
      ...rest,
    };
    loadThemeConfig(config);
    localStorage['takin-theme'] = JSON.stringify(config);
  };

  const resetTheme = () => {
    localStorage['takin-theme'] = JSON.stringify(emptyConfig);
    rootEle?.style = '';
    loadThemeConfig();
  };

  return {
    loadThemeConfig,
    setTheme,
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
