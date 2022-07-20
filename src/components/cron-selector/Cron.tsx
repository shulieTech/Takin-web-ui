import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import Button from 'antd/lib/button';

import { CronProps, PeriodType } from './types';
import Period from './fields/Period';
import MonthDays from './fields/MonthDays';
import Months from './fields/Months';
import Hours from './fields/Hours';
import Minutes from './fields/Minutes';
import WeekDays from './fields/WeekDays';
import { classNames, setError, usePrevious } from './utils';
import { DEFAULT_LOCALE_EN } from './locale';
import { setValuesFromCronString, getCronStringFromValues } from './converter';
import './styles.less';

const Cron = (props: CronProps) => {
  const {
    clearButton = true,
    clearButtonProps = {},
    clearButtonAction = 'fill-with-every',
    locale = DEFAULT_LOCALE_EN,
    value = '',
    setValue,
    displayError = true,
    onError,
    className,
    defaultPeriod = 'day',
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = [
      '@yearly',
      '@annually',
      '@monthly',
      '@weekly',
      '@daily',
      '@midnight',
      '@hourly',
    ],
    clockFormat,
    periodicityOnDoubleClick = true,
    mode = 'multiple',
    allowedDropdowns = [
      'period',
      'months',
      'month-days',
      'week-days',
      'hours',
      'minutes',
    ],
    allowedPeriods = [
      'year',
      'month',
      'week',
      'day',
      'hour',
      'minute',
      'reboot',
    ],
  } = props;
  const internalValueRef = useRef<string>(value);
  const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);
  const [period, setPeriod] = useState<PeriodType | undefined>();
  const [monthDays, setMonthDays] = useState<number[] | undefined>();
  const [months, setMonths] = useState<number[] | undefined>();
  const [weekDays, setWeekDays] = useState<number[] | undefined>();
  const [hours, setHours] = useState<number[] | undefined>();
  const [minutes, setMinutes] = useState<number[] | undefined>();
  const [error, setInternalError] = useState<boolean>(false);
  const [valueCleared, setValueCleared] = useState<boolean>(false);
  const previousValueCleared = usePrevious(valueCleared);
  const localeJSON = JSON.stringify(locale);

  useEffect(
    () => {
      setValuesFromCronString(
        value,
        setInternalError,
        onError,
        allowEmpty,
        internalValueRef,
        true,
        locale,
        shortcuts,
        setMinutes,
        setHours,
        setMonthDays,
        setMonths,
        setWeekDays,
        setPeriod
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (value !== internalValueRef.current) {
        setValuesFromCronString(
          value,
          setInternalError,
          onError,
          allowEmpty,
          internalValueRef,
          false,
          locale,
          shortcuts,
          setMinutes,
          setHours,
          setMonthDays,
          setMonths,
          setWeekDays,
          setPeriod
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, internalValueRef, localeJSON, allowEmpty, shortcuts]
  );

  useEffect(
    () => {
      // Only change the value if a user touched a field
      // and if the user didn't use the clear button
      if (
        (period || minutes || months || monthDays || weekDays || hours) &&
        !valueCleared &&
        !previousValueCleared
      ) {
        const selectedPeriod = period || defaultPeriodRef.current;
        const cron = getCronStringFromValues(
          selectedPeriod,
          months,
          monthDays,
          weekDays,
          hours,
          minutes,
          humanizeValue
        );

        setValue(cron, { selectedPeriod });
        internalValueRef.current = cron;
        if (onError) {
          onError(undefined);
        }
        setInternalError(false);
      } else if (valueCleared) {
        setValueCleared(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      period,
      monthDays,
      months,
      weekDays,
      hours,
      minutes,
      humanizeValue,
      valueCleared,
    ]
  );

  const handleClear = useCallback(
    () => {
      setMonthDays(undefined);
      setMonths(undefined);
      setWeekDays(undefined);
      setHours(undefined);
      setMinutes(undefined);

      // When clearButtonAction is 'empty'
      let newValue = '';

      const newPeriod =
        period !== 'reboot' && period ? period : defaultPeriodRef.current;

      if (newPeriod !== period) {
        setPeriod(newPeriod);
      }

      // When clearButtonAction is 'fill-with-every'
      if (clearButtonAction === 'fill-with-every') {
        const cron = getCronStringFromValues(
          newPeriod,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );

        newValue = cron;
      }

      setValue(newValue, { selectedPeriod: newPeriod });
      internalValueRef.current = newValue;

      setValueCleared(true);

      if (allowEmpty === 'never' && clearButtonAction === 'empty') {
        setInternalError(true);
        setError(onError, locale);
      } else {
        if (onError) {
          onError(undefined);
        }
        setInternalError(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, setValue, onError, clearButtonAction]
  );

  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron': true,
        'react-js-cron-error': error && displayError,
        'react-js-cron-disabled': disabled,
        'react-js-cron-read-only': readOnly,
        [`${className}`]: !!className,
        [`${className}-error`]: error && displayError && !!className,
        [`${className}-disabled`]: disabled && !!className,
        [`${className}-read-only`]: readOnly && !!className,
      }),
    [className, error, displayError, disabled, readOnly]
  );

  const { className: clearButtonClassNameProp, ...otherClearButtonProps } =
    clearButtonProps;
  const clearButtonClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-clear-button': true,
        [`${className}-clear-button`]: !!className,
        [`${clearButtonClassNameProp}`]: !!clearButtonClassNameProp,
      }),
    [className, clearButtonClassNameProp]
  );

  const otherClearButtonPropsJSON = JSON.stringify(otherClearButtonProps);
  const clearButtonNode = useMemo(
    () => {
      if (clearButton && !readOnly) {
        return (
          <span>
            {''}
            <Button
              className={clearButtonClassName}
              type="primary"
              disabled={disabled}
              {...otherClearButtonProps}
              onClick={handleClear}
            >
              {locale.clearButtonText || DEFAULT_LOCALE_EN.clearButtonText}
            </Button>
          </span>
        );
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clearButton,
      readOnly,
      localeJSON,
      clearButtonClassName,
      disabled,
      otherClearButtonPropsJSON,
      handleClear,
    ]
  );

  const periodForRender = period || defaultPeriodRef.current;

  return (
    <div className={internalClassName}>
      {allowedDropdowns.includes('period') && (
        <Period
          value={periodForRender}
          setValue={setPeriod}
          locale={locale}
          className={className}
          disabled={disabled}
          readOnly={readOnly}
          shortcuts={shortcuts}
          allowedPeriods={allowedPeriods}
        />
      )}

      {periodForRender === 'reboot' ? (
        clearButtonNode
      ) : (
        <>
          {periodForRender === 'year' &&
            allowedDropdowns.includes('months') && (
              <Months
                value={months}
                setValue={setMonths}
                locale={locale}
                className={className}
                humanizeLabels={humanizeLabels}
                disabled={disabled}
                readOnly={readOnly}
                period={periodForRender}
                periodicityOnDoubleClick={periodicityOnDoubleClick}
                mode={mode}
              />
            )}

          {(periodForRender === 'year' || periodForRender === 'month') &&
            allowedDropdowns.includes('month-days') && (
              <MonthDays
                value={monthDays}
                setValue={setMonthDays}
                locale={locale}
                className={className}
                weekDays={weekDays}
                disabled={disabled}
                readOnly={readOnly}
                leadingZero={leadingZero}
                period={periodForRender}
                periodicityOnDoubleClick={periodicityOnDoubleClick}
                mode={mode}
              />
            )}

          {(periodForRender === 'year' ||
            periodForRender === 'month' ||
            periodForRender === 'week') &&
            allowedDropdowns.includes('week-days') && (
              <WeekDays
                value={weekDays}
                setValue={setWeekDays}
                locale={locale}
                className={className}
                humanizeLabels={humanizeLabels}
                monthDays={monthDays}
                disabled={disabled}
                readOnly={readOnly}
                period={periodForRender}
                periodicityOnDoubleClick={periodicityOnDoubleClick}
                mode={mode}
              />
            )}

          <div>
            {periodForRender !== 'minute' &&
              periodForRender !== 'hour' &&
              allowedDropdowns.includes('hours') && (
                <Hours
                  value={hours}
                  setValue={setHours}
                  locale={locale}
                  className={className}
                  disabled={disabled}
                  readOnly={readOnly}
                  leadingZero={leadingZero}
                  clockFormat={clockFormat}
                  period={periodForRender}
                  periodicityOnDoubleClick={periodicityOnDoubleClick}
                  mode={mode}
                />
              )}

            {periodForRender !== 'minute' &&
              allowedDropdowns.includes('minutes') && (
                <Minutes
                  value={minutes}
                  setValue={setMinutes}
                  locale={locale}
                  period={periodForRender}
                  className={className}
                  disabled={disabled}
                  readOnly={readOnly}
                  leadingZero={leadingZero}
                  clockFormat={clockFormat}
                  periodicityOnDoubleClick={periodicityOnDoubleClick}
                  mode={mode}
                />
              )}

            {clearButtonNode}
          </div>
        </>
      )}
    </div>
  );
};

export default Cron;
