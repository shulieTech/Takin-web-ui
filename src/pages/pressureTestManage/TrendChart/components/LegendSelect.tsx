import React, { useState, useEffect, CSSProperties, ReactNode } from 'react';
import { Dropdown, Input, Icon, Checkbox, Button, Table } from 'antd';
import Echarts from 'echarts-for-react';
import styles from '../../pressureTestReport/index.less';

type Option = {
  name: string;
};

export const getSeryColorByNameOrIndex = (options: {
  list?: { name: string }[];
  name?: string;
  index?: number;
}) => {
  const colors = [
    '#6CBEDC',
    '#79D193',
    '#66BCDB',
    '#ECBB35',
    '#DF7672',
    '#5A97E0',
    '#90CDAC',
    '#6462B9',
  ];
  const { list, name, index } = options;
  if (typeof index === 'number') {
    return colors[index % colors.length];
  }
  return colors[list.findIndex((x) => x.name === name) % colors.length];
};

interface Props {
  label?: string | ReactNode;
  searchPlaceholder?: string;
  seriesShowed?: string[];
  onChangeShowedSeries?: (value: string[]) => void;
  allSeries?: Option[];
  renderOption?: (item: Option, value, echartInstance) => React.ReactNode;
  echartInstance?: Echarts;
  style?: CSSProperties;
  seriesSelected?: string[];
  onChangeSelectedSeries?: (value: string[]) => void;
}

const LegendSelect: React.FC<Props> = (props) => {
  const {
    label,
    searchPlaceholder = '搜索应用',
    seriesShowed = props.allSeries.slice(5).map((item) => item.name),
    onChangeShowedSeries,
    allSeries,
    echartInstance,
    style,
  } = props;
  const [searchText, setSearchText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [seriesSelected, setSeriesSelected] = useState(seriesShowed);

  const toggleSelectSery = (val: string) => {
    const _seriesSelected = seriesSelected.concat();
    const index = seriesSelected.indexOf(val);
    if (index > -1) {
      _seriesSelected.splice(index, 1);
    } else {
      _seriesSelected.push(val);
    }
    setSeriesSelected(_seriesSelected);
  };

  const checkboxChangeHandle = (val = []) => {
    if (onChangeShowedSeries) {
      onChangeShowedSeries(val);
    }
    setSeriesSelected(seriesSelected.filter((x) => val.includes(x)));
  };

  useEffect(() => {
    // TODO 初始化时无法取到echartInstance， 待处理
    if (echartInstance) {
      allSeries.forEach((x) => {
        echartInstance.dispatchAction({
          type:
            seriesSelected.includes(x.name) && seriesShowed.includes(x.name)
              ? 'legendSelect'
              : 'legendUnSelect',
          name: x.name,
        });
      });
    }
  }, [echartInstance, seriesSelected, seriesShowed]);

  const dropdownContent = (
    <div
      style={{
        width: 320,
        backgroundColor: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
        borderRadius: 4,
      }}
    >
      <div style={{ padding: 8 }}>
        <Input
          allowClear
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        className={styles['table-no-border']}
        size="small"
        pagination={false}
        showHeader={false}
        dataSource={allSeries}
        rowKey="name"
        rowClassName={(record) => {
          if (!searchText) {
            return '';
          }
          return record?.name.includes(searchText) ? '' : 'hidden';
        }}
        columns={[
          {
            dataIndex: 'name',
            render: (text, record, index) => {
              return (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      borderRadius: 2,
                      marginRight: 4,
                      backgroundColor: getSeryColorByNameOrIndex({
                        index,
                      }),
                    }}
                  />
                  {text}
                </>
              );
            },
          },
        ]}
        rowSelection={{
          columnWidth: 20,
          selectedRowKeys: seriesShowed,
          onChange: checkboxChangeHandle,
          onSelect: (record, selected, selectedRows, nativeEvent) => {
            if (selected && !seriesSelected.includes(record.name)) {
              setSeriesSelected([...seriesSelected, record.name]);
            }
          },
        }}
        footer={(currentPageData) => (
          <div>
            <Checkbox>全选</Checkbox>
          </div>
        )}
      />
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 16,
        border: '1px solid #EEF0F2',
        borderRadius: 4,
        backgroundColor: '#fff',
        ...style,
      }}
    >
      <span>{label}</span>

      <div
        style={{
          display: 'flex',
          gap: 16,
          flex: 1,
          padding: '0 16px',
        }}
      >
        {seriesShowed.map((x) => {
          const selected = (seriesSelected || []).includes(x);
          return (
            <div
              key={x}
              style={{
                opacity: selected ? 1 : 0.5,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                toggleSelectSery(x);
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  borderRadius: 2,
                  marginRight: 4,
                  backgroundColor: getSeryColorByNameOrIndex({
                    list: allSeries,
                    name: x,
                  }),
                }}
              />
              {x}
            </div>
          );
        })}
      </div>
      <Dropdown overlay={dropdownContent} visible={dropdownVisible}>
        <Button
          onClick={() => setDropdownVisible(!dropdownVisible)}
          style={{
            width: 20,
            lineHeight: '20px',
            height: 20,
            padding: 0,
            textAlign: 'center',
          }}
        >
          <Icon type="caret-down" />
        </Button>
      </Dropdown>
    </div>
  );
};

export default LegendSelect;
