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
    (option) =>
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
    ...requestOption,
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
      maxCount: 1,
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
  Object.keys(values).map((item) => {
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
export const filterOptions = (inputValue, path) => {
  return path.some(
    (option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
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
export const flatten = (arr) => {
  return [].concat(
    ...arr.map((item) => {
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
/**
 * @name 查找树子节点的全部父节点
 */
export const treeFindPath = (tree, func, path = []) => {
  if (!tree) {
    return [];
  }
  for (const data of tree) {
    // 这里按照你的需求来存放最后返回的内容吧
    path.push(data.path);
    if (func(data)) {
      return path;
    }
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) {
        return findChildren;
      }
    }
    path.pop();
  }
  return [];
};

/**
 * @name 去掉表单对象前后空格
 */
export const trimObj = (obj) => {
  let newObj = {};
  // tslint:disable-next-line:forin
  for (const i in obj) {
    newObj = {
      ...newObj,
      [i]: typeof obj[i] === 'string' ? obj[i].trim() : obj[i],
    };
  }
  return newObj;
};

/**
 * @name 判断去掉表单对象前后空格后是否为空，为空返回true，否则false
 */
export const objEachResultIsEmpty = (obj) => {
  // tslint:disable-next-line:forin
  for (const i in obj) {
    if (!obj[i]) {
      return true;
    }
  }
  return false;
};

/**
 * @name 设置全局message
 */
message.config({
  maxCount: 1,
});

/**
 * 判读菜单是否存在
 * @param path 菜单对应路径
 * @returns
 */
export const checkMenuByPath = (path: string): boolean => {
  const menus = JSON.parse(localStorage.trowebUserMenu);
  // 平铺tree数组
  const flatedMenus = [];
  const flatMenu = (arr) => {
    if (arr?.length > 0) {
      arr.forEach((x) => {
        flatedMenus.push(x);
        flatMenu(x.children);
      });
    }
  };
  flatMenu(menus);
  return flatedMenus.some((x) => x.path === path);
};

/**
 * 查找treeData中符合条件的节点
 * @param treeData
 * @param filter
 * @param isFirst 是否只查询第一个符合条件的节点
 */
export const filterInTreeData = (params: {
  treeData: any[];
  filter: (item: any) => boolean;
  isFirst?: boolean;
  childrenName?: string;
}) => {
  const {
    treeData,
    isFirst = false,
    childrenName = 'children',
    filter,
  } = params;
  const result = [];

  const find = (arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((item) => {
        if (filter(item)) {
          result.push(item);
          if (isFirst) {
            return;
          }
        }
        if (Array.isArray(item[childrenName])) {
          find(item[childrenName]);
        }
      });
    }
  };

  find(treeData);

  return result;
};

export const getSortConfig = (
  query: Object = {},
  sortKey: string,
  sortFieldName = 'sortField',
  sortOrderName = 'sortType'
) => {
  return {
    sorter: true,
    sortOrder:
      query[sortFieldName] === sortKey && query[sortOrderName]
        ? { desc: 'descend', asc: 'ascend' }[query[sortOrderName]]
        : '',
  };
};

export const getTableSortQuery = (sorter) => {
  return {
    current: 0,
    sortField: sorter.order ? sorter.field : undefined,
    sortType: {
      ascend: 'asc',
      descend: 'desc',
    }[sorter.order],
  };
};

export function getUrlParams(url) {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }

  const params = {};
  const queryParams = queryString.split('&');

  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return params;
}
