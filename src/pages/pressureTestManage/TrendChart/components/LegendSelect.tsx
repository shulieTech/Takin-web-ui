import React, { useState, useEffect, CSSProperties, ReactNode } from 'react';
import { Dropdown, Input, Icon, Checkbox, Button, Table, Tooltip } from 'antd';
// import Echarts from 'echarts-for-react';
import styles from '../../pressureTestReport/index.less';
import { ColumnProps } from 'antd/lib/table';

type Option = {
  name: string;
};

export const getSeryColorByNameOrIndex = (options: {
  list?: { name: string }[];
  name?: string;
  index?: number;
}) => {
  const colors = [
    '#79D193',
    '#66BCDB',
    '#ECBB35',
    '#DF7672',
    '#5A97E0',
    '#90CDAC',
    '#6462B9',
    '#DCE7FD',
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
  onChangeShowedSeries?: (value: string[], values: Option[]) => void;
  allSeries?: Option[];
  renderOption?: (item: Option, value, echartInstance) => React.ReactNode;
  // echartInstance?: Echarts;
  echartRef?: any;
  style?: CSSProperties;
  seriesSelected?: string[];
  onChangeSelectedSeries?: (value: string[]) => void;
  extraColumns?: ColumnProps<any>[];
  overlayStyle?: CSSProperties;
}

const LegendSelect: React.FC<Props> = (props) => {
  const {
    label,
    searchPlaceholder = '搜索应用',
    seriesShowed = props.allSeries.slice(0, 5).map((item) => item.name),
    onChangeShowedSeries,
    allSeries,
    echartRef,
    style,
    extraColumns = [],
    overlayStyle,
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
      onChangeShowedSeries(val, allSeries.filter(x => val.includes(x.name)));
    }
    setSeriesSelected(seriesSelected.filter((x) => val.includes(x)));
  };

  const echartInstance = echartRef?.getEchartsInstance();

  useEffect(() => {
    setSeriesSelected(allSeries.slice(0, 5).map((x) => x.name));
  }, [JSON.stringify(allSeries)]);

  useEffect(() => {
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

  useEffect(() => {
    const hideDropdownContent = () => setDropdownVisible(false);
    document.body.addEventListener('click', hideDropdownContent);
    return () =>
      document.body.removeEventListener('click', hideDropdownContent);
  }, []);

  const dropdownContent = (
    <div
      style={{
        width: 320,
        backgroundColor: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
        borderRadius: 4,
        ...overlayStyle,
      }}
      onClick={(e) => {
        e.stopPropagation();
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
            ellipsis: true,
            render: (text, record, index) => {
              return (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      display: 'inline-block',
                      verticalAlign: -3,
                      borderRadius: 2,
                      marginLeft: 6,
                      marginRight: 8,
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
          ...extraColumns,
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
        onRow={(record) => {
          return {
            onClick: (e) => {
              const selectedIndex = seriesSelected.indexOf(record.name);
              const _seriesSelected = seriesSelected.concat();
              if (selectedIndex > -1) {
                _seriesSelected.splice(selectedIndex, 1);
              } else {
                _seriesSelected.push(record.name);
              }
              checkboxChangeHandle(_seriesSelected);
              setSeriesSelected(_seriesSelected);
            },
          };
        }}
        footer={(currentPageData) => (
          <div>
            <Checkbox
              checked={seriesShowed.length === allSeries.length}
              style={{
                padding: '0 8px',
              }}
              indeterminate={
                seriesShowed.length > 0 &&
                seriesShowed.length < allSeries.length
              }
              onChange={(e) => {
                const resultNames = e.target.checked
                  ? allSeries.map((x) => x.name)
                  : [];
                checkboxChangeHandle(resultNames);
                setSeriesSelected(resultNames);
              }}
            >
              全选
            </Checkbox>
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
          flexWrap: 'wrap',
          overflow: 'hidden',
        }}
      >
        {!(seriesShowed.length > 0) && (
          <span style={{ color: '#ddd' }}>请选择{label}</span>
        )}
        {seriesShowed.map((x) => {
          const selected = (seriesSelected || []).includes(x);
          return (
            <Tooltip key={x} title={x} placement="bottomLeft">
              <div
                style={{
                  opacity: selected ? 1 : 0.5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // maxWidth: 200,
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
            </Tooltip>
          );
        })}
      </div>
      <Dropdown overlay={dropdownContent} visible={dropdownVisible}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setDropdownVisible(!dropdownVisible);
          }}
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
