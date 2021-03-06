/**
 * @name 通用表达卡
 * @author
 */
import React, { useEffect, Fragment } from 'react';
import { FormCardMultipleProps } from './type';
import { Row, Col, Form } from 'antd';
import { CommonForm } from 'racc';
import TitleComponent from 'src/common/title';
import { FormCardProps } from '../form-card/type';

const FormCardMultiple: React.FC<FormCardMultipleProps> = props => {
  useEffect(() => {
    if (props.getForm) {
      props.getForm(props.form);
    }
  }, []);

  return (
    <div>
      {props.dataSource.map((item, index) => {
        return (
          <div key={index} style={{ display: item.hide ? 'none' : 'block' }}>
            <div>
              {(item.title || item.titleSub) && (
                <TitleComponent content={item.title} extra={item.titleSub} />
              )}
            </div>
            <Row type="flex" justify="start">
              <Col key={index} span={item.span || 24}>
                <CommonForm
                  formItemProps={{
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 }
                  }}
                  rowNum={item.rowNum || 2}
                  {...props.commonFormProps}
                  btnProps={{ isResetBtn: false, isSubmitBtn: false }}
                  form={props.form}
                  formData={item.formData}
                />
              </Col>
            </Row>
            <div>{item.extra}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Form.create<FormCardProps>()(FormCardMultiple);
