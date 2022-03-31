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
    const res = await service(newQuery);
    const {
      data: { success, data },
      headers: { 'x-total-count': totalCount },
    } = res;
    setLoading(false);
    if (success) {
      setQuery(newQuery);
      setList(data?.list || data);
      setTotal(parseInt(totalCount || data?.count, 10) || 0);
    }
    if (typeof afterSearchCallback === 'function') {
      afterSearchCallback(res);
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
