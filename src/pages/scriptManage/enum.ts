export enum VersionHistoryEnum {
  ID = 'id',
  版本名 = 'scriptVersion',
  操作人 = 'createUserName',
  时间 = 'updateTime',
  脚本名称 = 'scriptName',
  关联业务 = 'relatedBusiness',
  脚本类型 = 'scriptType',
  文件名称 = 'fileName',
  文件类型 = 'fileType',
  文件数据量 = 'uploadedData',
  是否拆分 = 'isSplit',
  更新时间 = 'uploadTime'
}

export enum ScriptTypeEnum {
  JMeter
}

export enum FileTypeEnum {
  脚本文件,
  数据文件,
  脚本jar文件,
  'jmeter ext jar'
}
