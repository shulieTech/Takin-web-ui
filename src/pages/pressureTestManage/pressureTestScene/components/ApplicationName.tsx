/**
 * @name
 * @author chuxu
 */
import { Icon, Tooltip } from 'antd';
import { CommonSelect, CommonTable } from 'racc';
import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import TitleComponent from 'src/common/title';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestSceneService from '../service';
interface Props {
  state?: any;
  setState?: any;
  id: any;
  excludedApplicationIds?: any;
}
const applicationName: React.FC<Props> = props => {
  const [datas, setDatas] = useState([]);
  const [serviceNameList, setserviceNameList] = useState([]);
  const [service, setService] = useState(undefined);
  const [key, setKey] = useState(0);
  useEffect(() => {
    applicationList();
  }, [service]);
  const applicationList = async () => {
    const {
      data: { success, data }
    } = await PressureTestSceneService.applicationList({
      businessActivityIds: props.id?.join(','),
      applicationName: service
    });
    if (success) {
      const arr = [];
      data.map((item, k) => {
        props.excludedApplicationIds.map(ite => {
          if (_.includes(item, ite)) {
            item.status = true;
            return item;
          }
          item.status = false;
          return item;
        });
        arr.push(item);
      });
      setDatas(arr);
      setserviceNameList(
        data &&
        data.map((item, k) => {
          return {
            label: item.applicationName,
            value: item.applicationName
          };
        }),
      );
    }
  };
  const cancel = (value) => {
    const index = _.findIndex(datas, ['applicationName', value]);
    datas[index].status = false;
    setDatas(datas);
    setKey(key + 1);
    const data = _.cloneDeep(datas);
    const evens = _.remove(data, (n) => {
      return n.status !== false;
    });
    const excludedApplicationIds = evens.map((ite) => {
      return ite.applicationId;
    });
    props.setState({
      excludedApplicationIds
    });
  };
  const ignore = (value) => {
    const index = _.findIndex(datas, ['applicationName', value]);
    datas[index].status = true;
    setDatas(datas);
    setKey(key + 1);
    const data = _.cloneDeep(datas);
    const evens = _.remove(data, (n) => {
      return n.status !== false;
    });
    const excludedApplicationIds = evens.map((ite) => {
      return ite.applicationId;
    });
    props.setState({
      excludedApplicationIds
    });
  };
  const serviceNameChange = (value) => {
    setService(value);
  };
  const getColumns = () => {
    return [
      {
        ...customColumnProps,
        title: '??????',
        dataIndex: 'applicationName',
        width: 300
      },
      {
        ...customColumnProps,
        title: '??????',
        dataIndex: 'status',
        render: (text, row) => {
          if (text) {
            return (
              <a onClick={() => cancel(row.applicationName)}>????????????</a>
            );
          }
          return (
            <a onClick={() => ignore(row.applicationName)}>??????</a>
          );
        }
      },
    ];
  };
  return (
    <Fragment>
      <div>
        <TitleComponent
          content={
            <span style={{ fontSize: 16 }}>
              ??????????????????
              <Tooltip
                title="?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                placement="right"
                trigger="click"
              >
                <Icon type="question-circle" style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>}
        />
        <div style={{ marginTop: 20 }} />
        <CommonSelect
          placeholder="??????"
          style={{ width: '25%' }}
          allowClear
          optionFilterProp="children"
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          onChange={serviceNameChange}
          dataSource={serviceNameList}
        />
        <div style={{ marginTop: 20 }} />
        <CommonTable
          key={key}
          columns={getColumns()}
          size="small"
          style={{
            width: '50%'
          }}
          dataSource={datas}
        />
      </div>
    </Fragment>
  );
};
export default applicationName;