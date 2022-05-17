import React, { useState, useEffect } from 'react';

interface Props {
  service: (params: any) => Promise<any>;
  defaultQuery?: any;
  isQueryOnQueryChange?: boolean;
  afterSearchCallback?: (res: any) => void;
}

const useListService = (props: Props) => {
  const {
    service,
    defaultQuery = {},
    isQueryOnQueryChange = true,
    afterSearchCallback,
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
        setList(data.list);
        setTotal(totalCount || data.count);
      }
      if (typeof afterSearchCallback === 'function') {
        afterSearchCallback(res);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQueryOnQueryChange) {
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
