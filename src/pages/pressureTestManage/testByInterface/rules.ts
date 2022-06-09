// 文本格式如果是双{}包裹，会被认为是formily的特殊语法，回显时会引起页面crash
export const textRule = {
  validator: val => {
    if (typeof val === 'string' && /^{{.*}}$/.test(val)) {
      return '文本格式非法';
    }
    return '';
  }
};