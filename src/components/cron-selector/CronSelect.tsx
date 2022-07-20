import React from 'react';
import { DefaultLocale } from './types';
import Cron from './Cron';
import { connect } from '@formily/antd';

interface CronSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

// cron选择器，官方版本不兼容antd 3.x，这里用官方2.1.0源码做了魔改，交互上有一定差异
// 汉化参考 https://github.com/xrutayisire/react-js-cron/blob/master/src/locale.ts
const LOCALE_ZH_CN: DefaultLocale = {
  everyText: '每',
  emptyMonths: '每月',
  emptyMonthDays: '每日',
  emptyMonthDaysShort: '每日',
  emptyWeekDays: '每天',
  emptyWeekDaysShort: '每天',
  emptyHours: '每时',
  emptyMinutes: '每分',
  emptyMinutesForHourPeriod: '每',
  yearOption: '年',
  monthOption: '月',
  weekOption: '周',
  dayOption: '天',
  hourOption: '小时',
  minuteOption: '分钟',
  rebootOption: '重启',
  prefixPeriod: '每',
  prefixMonths: '的',
  prefixMonthDays: '的',
  prefixWeekDays: '的',
  prefixWeekDaysForMonthAndYearPeriod: (
    <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>并且</span>
  ),
  prefixHours: '的',
  prefixMinutes: ':',
  prefixMinutesForHourPeriod: '的',
  suffixMinutesForHourPeriod: '分',
  errorInvalidCron: '无效的cron语句',
  clearButtonText: '清空',
  weekDays: [
    // Order is important, the index will be used as value
    '周日', // Sunday must always be first, it's "0"
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
  ],
  months: [
    // Order is important, the index will be used as value
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  // Order is important, the index will be used as value
  altWeekDays: [
    '周日', // Sunday must always be first, it's "0"
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
  ],
  // Order is important, the index will be used as value
  altMonths: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
};

const CronSelect: React.FC<CronSelectProps> = ({
  value,
  onChange,
  ...rest
}) => {
  return (
    <Cron
      value={value}
      setValue={onChange}
      locale={LOCALE_ZH_CN}
      clearButtonProps={{
        ghost: true,
      }}
      {...rest}
    />
  );
};

export const CronSelctComponent = connect()(CronSelect);

export default CronSelect;
