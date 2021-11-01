/**
 * @name
 * @author MingShined
 */
import { Col, message, Modal, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonModal, useStateReducer } from 'racc';
import React from 'react';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { getEntranceInfo } from '../addEditPage';
import AddEditForm from '../components/AddEditForm';
import AddEditGraph from '../components/AddEditGraph';
import BusinessActivityService from '../service';
import styles from './../index.less';
interface Props {
  id?: string;
  isVirtual?: boolean; // 是否是虚拟业务活动
  onSuccess: () => void;
}
const getInitState = () => ({
  systemName: undefined,
  service: undefined,
  serviceName: undefined,
  serviceType: undefined,
  app: undefined,
  appName: undefined,
  serviceList: [],
  loading: true,
  isCore: undefined,
  link_level: undefined,
  businessDomain: undefined,
  form: null as WrappedFormUtils,
  showModal: false,
  virtualEntrance: null
});
const { confirm } = Modal;
export type AddEditActivityModalState = ReturnType<typeof getInitState>;
const AddEditActivityModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<AddEditActivityModalState>(
    getInitState()
  );
  const { id, isVirtual } = props;
  const queryDetails = async () => {
    if (!id) {
      setState(getInitState());
      return;
    }
    const {
      data: { data, success }
    } = await BusinessActivityService.querySystemProcess({
      activityId: id,
    });
    if (success) {
      setState({
        systemName: data.activityName,
        app: data.applicationName,
        serviceType: data.type,
        service: data.linkId,
        isCore: data.isCore,
        link_level: data.link_level,
        businessDomain: data.businessDomain,
        virtualEntrance: data.virtualEntrance
      });
    }
  };
  const handleSubmit = async () => {
    return new Promise(async resolve => {
      state.form.validateFields((err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const result = id ? handleUpdate(values) : handleCreate(values);
        resolve(result);
      });
    });
  };

  const handleVirSubmit = async () => {
    return new Promise(async resolve => {
      state.form.validateFields((err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const result = id
          ? handleVirtualUpdate(values)
          : handleVirtualCreate(values);
        resolve(result);
      });
    });
  };

  const handleVirtualCreate = async values => {
    const {
      data: { success }
    } = await BusinessActivityService.addVirtualBusinessActivity({
      ...values
    });
    if (success) {
      message.success('成功新增虚拟业务活动');
      props.onSuccess();
      return true;
    }
  };

  const handleVirtualUpdate = async values => {
    const {
      data: { success }
    } = await BusinessActivityService.editVirtualBusinessActivity({
      activityId: props.id,
      ...values
    });
    if (success) {
      message.success('成功修改虚拟业务活动');
      Modal.destroyAll();
      props.onSuccess();
      return true;
    }
  };

  const handleCreate = async values => {
    const {
      data: { success }
    } = await BusinessActivityService.createSystemProcess({
      activityName: state.systemName,
      applicationName: state.appName,
      entranceName: state.serviceName,
      linkId: state.service,
      type: state.serviceType,
      ...values,
      ...getEntranceInfo(state.serviceList, state.service)
    });
    if (success) {
      message.success('成功新增业务活动');
      props.onSuccess();
      return true;
    }
  };
  const handleUpdate = async values => {
    const {
      data: { success }
    } = await BusinessActivityService.updateSystemProcess({
      activityName: state.systemName,
      applicationId: state.app,
      applicationName: state.appName,
      entranceName: state.serviceName,
      linkId: state.service,
      type: state.serviceType,
      activityId: props.id,
      isCore: state.isCore,
      link_level: state.link_level,
      businessDomain: state.businessDomain,
      ...values,
      ...getEntranceInfo(state.serviceList, state.service)
    });
    if (success) {
      message.success('成功修改业务活动');
      props.onSuccess();
      return true;
    }
  };

  const showConfirm = () => {
    confirm({
      title: (
        <div>
          <CustomIcon color="#ED6047" imgName="warning_icon" />
          <span className={styles.modalTitle}>新增虚拟业务活动</span>
        </div>
      ),
      icon: null,
      content:
        '请确保虚拟入口的安全性，若有写入操作，请确保进行过代码改造，否则会出现数据泄露，影响生产业务环境。',
      okType: 'danger',
      okText: '确认新增',
      onOk() {
        handleVirSubmit();
        setState({
          showModal: false
        });
      },
      onCancel() {
        setState({
          showModal: false
        });
      }
    });
  };

  const handleVirtualSubmit = async () => {
    // setState({ showModal: true });
  };
  return (
    <CommonModal
      btnProps={{ type: id ? 'link' : 'primary' }}
      modalProps={{
        title: `${id ? '编辑' : '新增'}${isVirtual ? '虚拟' : ''}业务活动`,
        width: '95%',
        centered: true,
        bodyStyle: { minHeight: 500, overflow: 'scroll' },
        style: { top: 15 },
        destroyOnClose: true
      }}
      btnText={id ? '编辑' : `新增${isVirtual ? '虚拟' : ''}业务活动`}
      onClick={queryDetails}
      beforeOk={props.isVirtual ? handleVirSubmit : handleSubmit}
    >
      {state.showModal && showConfirm()}
      {isVirtual && (
        <CustomAlert
          style={{ marginBottom: 8 }}
          showIcon={true}
          types="warning"
          message
          content="新增虚拟业务活动说明：请确保虚拟入口的安全性，若有写入操作，请确保进行过代码改造，否则会出现数据泄漏，影响生产业务环境"
        />
      )}
      <Row type="flex">
        <Col style={{ width: 400 }}>
          <AddEditForm {...state} setState={setState} isVirtual={isVirtual} />
        </Col>
        <Col style={{ width: 'calc(100% - 400px)' }}>
          <AddEditGraph {...state} />
        </Col>
      </Row>
    </CommonModal>
  );
};
export default AddEditActivityModal;
