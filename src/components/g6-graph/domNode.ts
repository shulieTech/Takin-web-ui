import G6 from '@antv/g6';

/**
 * html渲染节点，仅在g6 svg模式下使用, 会将jsx这个配置项转换成dom
 */

export default () => {
  G6.registerNode(
    'dom-node',
    {
      // @ts-ignore
      draw(cfg: ModelConfig, group: IGroup) {
        const { html, size } = cfg;

        const keyShape = group.addShape('dom', {
          attrs: {
            html, // 传入 DOM 的 html
            width: size[0],
            height: size[1],
          },
          draggable: true,
          name: 'dom-shape'
        });

        group.addShape('rect', {
          attrs: {
            fill: 'transparent',
            width: size[0],
            height: size[1],
          },
          draggable: true,
          name: 'box-shape',
        });
        
        return keyShape;
      }
    },
    'rect'
  );
};
