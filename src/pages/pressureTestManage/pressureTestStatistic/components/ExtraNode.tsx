/**
 * @name
 * @author MingShined
 */
import moment from 'moment';
import { DatePick } from 'racc';
import React, { Fragment } from 'react';
import { PressureTestStatisticChildrenProps } from '../indexPage';

const ExtraNode: React.FC<PressureTestStatisticChildrenProps> = props => {
  return (
    <Fragment>
      <DatePick
        rangePickerProps={{
          ranges: {
            '7天内': [moment().subtract('day', 7), moment()],
            '30天内': [moment().subtract('day', 30), moment()]
          },
          disabledDate: current => current < moment().subtract('day', 90) || current > moment()
        }}
        onChange={date => props.setState({ date })}
        value={props.date}
        type="range"
      />
    </Fragment>
  );
};
export default ExtraNode;
