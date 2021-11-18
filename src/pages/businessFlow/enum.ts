export enum BusinessFlowBean {
  业务活动名称 = 'sceneName',
  ID = 'id',
  状态 = 'status',
  来源 = 'type',
  总计 = 'totalNodeNum',
  已完成 = 'linkRelateNum',
  负责人 = 'userName',
  最后更新时间 = 'updateTime'
}

/**
 * @name 业务流程匹配颜色
 */
export const businessFlowStatusColorMap = {
  1: 'var(--BrandPrimary-500)',
  0: 'var(--FunctionalError-500)'
};

/**
 * @name 业务流程匹配名
 */
export const businessFlowStatusMap = {
  0: '未匹配',
  1: '已匹配'
};

/**
 * @name 变更状态
 */
export const ChangeStatus = {
  0: 'var(--BrandPrimary-500)',
  1: 'var(--FunctionalError-500)'
};

/**
 * @name 业务流程文件类型
 */
export const fileTypeMap = {
  0: '脚本文件',
  1: '数据文件',
  2: '附件'
};

export const StepdColumnsData = [
  {
    label: 'Step1基本信息配置',
    value: 'step1'
  },
  {
    label: 'Step2业务活动配置',
    value: 'step2'
  }
];
