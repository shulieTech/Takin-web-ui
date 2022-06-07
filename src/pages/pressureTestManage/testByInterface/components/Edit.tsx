import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
  FormPath,
} from '@formily/antd';
import {
  Input,
  Select,
  FormBlock,
  Radio,
  ArrayTable,
  FormTextBox,
  Switch,
  DatePicker,
  FormTab,
  FormMegaLayout,
  FormSlot,
} from '@formily/antd-components';
import { Button, message, Spin, Icon, Modal } from 'antd';
import NumberPicker from '../../pressureTestSceneV2/components/NumberPicker';
import service from '../service';
import BaseTab from './BaseTab';
import PressConfigTab from './PressConfigTab';
import RadioCard from './RadioCard';
import LayoutBox from './LayoutBox';
import DebugResult from './DebugResult';
import Sider from './Sider';
import StartStatusModal from '../../pressureTestScene/modals/StartStatusModal';
import moment from 'moment';
import { SenceContext } from '../indexPage';
import { getTakinAuthority } from 'src/utils/utils';
import { debounce } from 'lodash';
import Guide from './Guide';

interface Props {
  currentSence: any;
}

const EditSence: React.FC<Props> = (props) => {
  const { currentSence } = props;
  const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [saving, setSaving] = useState(false);
  const {
    hasUnsaved,
    setHasUnsaved,
    listRefreshKey,
    setListRefreshKey,
    detailRefreshKey,
    editSaveKey,
    setEditSaveKey,
  } = useContext(SenceContext);
  const [pressStarted, setPressStarted] = useState(false);
  const [tabKey, setTabKey] = useState('tab-1');

  const getDetail = async (id) => {
    setDetailLoading(true);
    const {
      data: { success, data },
    } = await service.getSence({ id }).finally(() => {
      setDetailLoading(false);
    });
    if (success) {
      setDetail(data);
      actions.setFormState(state => state.values = data);
      // 非待启动状态时轮询
      if (data.status !== 0) {
        setTimeout(() => {
          getDetail(id);
        }, 5000);
      }
    }
  };

  const startTest = async () => {
    const { values } = await actions.submit();
    if (!values) {
      return;
    }

    if (hasUnsaved) {
      Modal.confirm({
        title: '提示',
        content: '您的场景有内容修改，是否保存并启动压测？',
        onOk: async () => {
          const success = await saveSence();
          if (success) {
            setPressStarted(true);
          }
        },
      });
    } else {
      setPressStarted(true);
    }
  };

  const saveSence = async () => {
    const { values } = await actions.submit();
    if (values) {
      setSaving(true);
      const {
        data: { success, data },
      } = await service[detail?.id ? 'updateSence' : 'addSence']({
        ...detail,
        ...values,
      }).finally(() => {
        setSaving(false);
      });
      if (success) {
        message.success('保存成功');
        setHasUnsaved(false);
        getDetail(data || detail.id);
        setListRefreshKey(listRefreshKey + 1);
        return success;
      }
    }
  };

  useEffect(() => {
    if (currentSence.id) {
      getDetail(currentSence.id);
      actions.clearErrors();
    } else {
      setDetail({});
      actions.reset({ validate: false });
    }
    setTabKey('tab-1');
  }, [currentSence?.id]);

  useEffect(() => {
    if (editSaveKey) {
      saveSence();
    }
  }, [editSaveKey]);

  useEffect(() => {
    if (detailRefreshKey && detail.id) {
      getDetail(detail.id);
    }
  }, [detailRefreshKey]);

  return (
    <Spin spinning={detailLoading} wrapperClassName="spin-full">
      <SchemaForm
        actions={actions}
        // initialValues={detail}
        validateFirst
        components={{
          Input,
          Select,
          NumberPicker,
          ArrayTable,
          FormBlock,
          FormTextBox,
          Radio,
          Switch,
          DatePicker,
          RadioCard,
          DebugResult,
          TextArea: Input.TextArea,
          RadioGroup: Radio.Group,
        }}
        effects={() => {
          onFieldInputChange$().subscribe((state) => {
            setHasUnsaved(true);
          });
          // 关联应用入口下拉框查询
          onFieldValueChange$('*(requestUrl,httpMethod)').subscribe(
            debounce(async () => {
              const {
                values: { requestUrl, httpMethod },
              } = await actions.getFormState();
              if (!(requestUrl?.trim() && httpMethod)) {
                return;
              }
              const {
                data: { success, data = [] },
              } = await service.searchEntrance({
                requestUrl,
                httpMethod,
                current: 0,
                pageSize: 20,
              });
              if (success) {
                const apps = data.map((x) => ({
                  ...x,
                  label: x.entranceAppName,
                  value: x.entranceAppName,
                }));
                actions.setFieldState('.entranceAppName', (state) => {
                  state.props.enum = apps;
                });
              }
            }, 500)
          );
          // 计算建议pod数
          if (getTakinAuthority() === 'true') {
            onFieldValueChange$(
              'pressureConfigRequest.threadConfig.threadNum'
            ).subscribe(
              debounce(async (fieldState) => {
                const { values } = await actions.getFormState();
                const {
                  data: { success, data },
                } = await service.querySuggestPodNum({
                  111: {
                    ...values?.pressureConfigRequest?.threadConfig,
                    tpsSum: values?.pressureConfigRequest?.targetGoal?.tps,
                  },
                });
                if (success) {
                  actions.setFieldState(
                    'pressureConfigRequest.threadConfig.podNum',
                    (podState) => {
                      podState.props['x-component-props'].addonAfter = (
                        <Button>
                          建议Pod数:
                          {data?.min !== data?.max
                            ? `${data?.min}-${data?.max}`
                            : data?.min || '-'}
                        </Button>
                      );
                    }
                  );
                }
              }, 500)
            );
          }
        }}
      >
        <LayoutBox
          x-component-props={{
            style: {
              padding: 16,
              paddingBottom: 0,
              borderBottom: '1px solid #EEF0F2',
            },
          }}
        >
          <FormMegaLayout inline flex>
            <Field
              name="name"
              type="string"
              x-component="Input"
              x-component-props={{
                id: 'guide-0',
                placeholder: '请输入压测场景名称',
                maxLength: 30,
                style: {
                  width: 320,
                },
              }}
              x-rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入压测场景名称',
                },
              ]}
              required
            />
            <FormSlot>
              <div style={{ float: 'right' }}>
                <Button
                  style={{ marginRight: 16 }}
                  onClick={saveSence}
                  loading={saving}
                >
                  保存场景
                </Button>
                <Button
                  type="primary"
                  onClick={startTest}
                  disabled={saving || [2].includes(detail.status)}
                >
                  <Icon type="play-circle" theme="filled" />
                  {
                    {
                      0: '启动压测',
                      2: '压测中',
                    }[detail.status || 0]
                  }
                </Button>
              </div>
            </FormSlot>
          </FormMegaLayout>
        </LayoutBox>
        <LayoutBox
          x-component-props={{
            style: {
              display: 'flex',
            },
          }}
        >
          <FormTab
            name="tabs-1"
            defaultActiveKey={'tab-1'}
            type="card"
            style={{ flex: 1, padding: 16, paddingBottom: 0 }}
            onTabClick={setTabKey}
          >
            <BaseTab
              actions={actions}
              detail={detail}
              isActive={tabKey === 'tab-1'}
            />
            <PressConfigTab actions={actions} />
          </FormTab>
          <FormSlot>
            <Sider detail={detail} />
          </FormSlot>
        </LayoutBox>
      </SchemaForm>
      {pressStarted && detail.bindSceneId && (
        <StartStatusModal
          visible
          onCancel={() => {
            setPressStarted(false);
          }}
          startedScence={{
            scenceInfo: {
              id: detail.bindSceneId,
              sceneName: detail.name,
            },
            triggerTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            // leakSqlEnable: state.missingDataSwitch,
            // continueRead: state.pressureStyle,
          }}
        />
      )}
      <Guide />
    </Spin>
  );
};

export default EditSence;
