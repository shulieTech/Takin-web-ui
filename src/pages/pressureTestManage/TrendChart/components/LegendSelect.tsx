import React, { useState, useEffect, CSSProperties, ReactNode } from 'react';
import { Dropdown, Input, Icon, Checkbox, Button } from 'antd';
import Echarts from 'echarts-for-react';

type Option = {
  name: string;
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
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Checkbox.Group value={seriesShowed} onChange={checkboxChangeHandle}>
        {allSeries.map((x) => {
          const isShow = searchText ? x.name.includes(searchText) : true;
          return (
            <div
              key={x.name}
              style={{
                lineHeight: '40px',
                padding: '0 16px',
                borderBottom: '1px solid #F7F8FA',
                display: isShow ? 'block' : 'none',
              }}
            >
              <Checkbox value={x.name}>
                <span
                  style={{
                    width: 16,
                    lineHeight: '16px',
                    display: 'inline-block',
                    verticalAlign: 'midldle',
                  }}
                />
                {x.name}
              </Checkbox>
            </div>
          );
        })}
      </Checkbox.Group>
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
