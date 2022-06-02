import React, { useState, useEffect } from 'react';
import { get, isArray } from 'lodash';

interface Props {
  service: (params: any) => Promise<any>;
  defaultQuery?: any;
  isQueryOnMount?: boolean;
  afterSearchCallback?: (res: any) => void;
  dataListPath?: string;
}

const useListService = (props: Props) => {
  const {
    service,
    defaultQuery = {},
    isQueryOnMount = true,
    afterSearchCallback,
    dataListPath,
  } = props;

  const [query, setQuery] = useState(defaultQuery);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetList = () => {
    return getList(defaultQuery);
  };

  const getList = async (params = {}) => {
    setLoading(true);
    const newQuery = { ...query, ...params };
    try {
      const res = await service(newQuery);
      const {
        data: { success, data },
        headers: { 'x-total-count': totalCount },
      } = res;

      if (success) {
        setQuery(newQuery);
        if (dataListPath && Array.isArray(get(data, dataListPath))) {
          setList(get(data, dataListPath));
        } else if (Array.isArray(data.list)) {
          setList(data.list);
        } else if (Array.isArray(data)) {
          setList(data);
        }
        setTotal(totalCount || data.count);
      }
      if (typeof afterSearchCallback === 'function') {
        afterSearchCallback(res);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQueryOnMount) {
      getList(query);
    }
  }, []);

  return {
    query,
    setQuery,
    list,
    getList,
    resetList,
    total,
    loading,
  };
};

export default useListService;
