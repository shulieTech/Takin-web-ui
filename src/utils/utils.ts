import { message } from 'antd';
import { AxiosRequestConfig } from 'axios';
import download from 'downloadjs';
import request from './request';

export function tryToParseJson(jsonString: string): any | undefined {
  let json;
  try {
    json = JSON.parse(jsonString);
  } catch (e) {
    // 不是正常的 JSON 字符串，不做任何事。
  }
  return json;
}

/**
 * @name  Cascader的搜索
 */
export function filterCascaderOptions(inputValue, path) {
  return path.some(
    option =>
      option.label
        .toLowerCase()
        .indexOf(inputValue && inputValue.toLowerCase()) > -1
  );
}

/**
 * @name 下载excel
 */
export async function downloadRequest(
  url,
  title?,
  requestOption?: AxiosRequestConfig
) {
  const { data, status, headers } = await request({
    url,
    responseType: 'blob',
    withCredentials: true,
    ...requestOption
  });
  const mTitle =
    decodeURIComponent(headers['content-file-original-name'] || '') ||
    (headers['content-disposition'] || '').replace(
      'attachment;filename=',
      ''
    ) ||
    title;
  if (status === 200) {
    download(data, mTitle);
    return true;
  }
  const reader = new FileReader();
  reader.onload = ({ target: { result } }: any) => {
    const res = tryToParseJson(result);
    message.config({
      maxCount: 1
    });
    message.error(res.message);
  };
  // reader.readAsText(data);
}

/**
 * @name 处理搜索条件非空
 * @param values 数据源
 */
export function filterSearchParams(values) {
  delete values.total;
  Object.keys(values).map(item => {
    if (values[item] !== 0 && !values[item]) {
      delete values[item];
    }
  });
  return values;
}

/** @name 获取用户权限 */
export const MapUserAuthority = (key: string) => {
  const authority = JSON.parse(localStorage.getItem('trowebUserResource'));
  return authority && authority[key];
};

/** @name 获取权限 */
export const MapBtnAuthority = (key: string) => {
  const authority = JSON.parse(localStorage.getItem('trowebBtnResource'));
  return authority && authority[key];
};

/** @name 获取登录token */
export const getLoginToken = () => {
  return localStorage.getItem('full-link-token');
};

/** @name 下拉模糊搜索 */
export const filter = (inputValue, path) => {
  return path.some(
    option =>
      option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};

/** @name 判断是否为空 */
export const isEmpty = (obj: any) => {
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true;
  }
  return false;
};

 /** @name 数组平铺 */
export const flatten = arr => {
  return [].concat(
      ...arr.map(item => {
        return item.children
          ? [].concat(item, ...flatten(item.children))
          : [].concat(item);
      })
    );
};

/** @name 获取是否需要权限 */
export const getTakinAuthority = () => {
  return localStorage.getItem('takinAuthority');
};

export const getTakinTenantAuthority = () => {
  return localStorage.getItem('takinTenantAuthority');
};
