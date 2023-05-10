import G6 from '@antv/g6';
import { GRAPH_FILTER } from 'src/constants';

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (
  str: string = '',
  maxWidth: number,
  fontSize: number
) => {
  const ellipsis = '...';
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) {
      return;
    }
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};

export default () => {
  G6.registerNode('iconfont', {
    // @ts-ignore
    draw(cfg: ModelConfig, group: IGroup) {
      // @ts-ignore
      const {
        size,
        style,
        text,
        label,
        hideLabel = false,
        subLabel,
        labelCfg,
        subNodesCountMap = {},
        expanderTypeState = {},
        bottleneckMap = {},
      } = cfg || {};

      const expanderTypeCounts = Object.values(subNodesCountMap).filter(
        // @ts-ignore
        (x) => x?.count > 0
      ).length; // 有多少个折叠

      const w = Array.isArray(size) ? size[0] : size;
      const h = Array.isArray(size) ? size[1] : size;
      const totalWidth = w + (expanderTypeCounts > 0 ? 100 : 0);

      const keyShape = group.addShape('rect', {
        attrs: {
          x: -totalWidth / 2,
          y: -h / 2,
          width: totalWidth,
          height: h,
        },
        draggable: true,
        name: 'box-shape',
      });

      // 正方形外框
      const rectShape = group.addShape('rect', {
        attrs: {
          ...style,
          fill: '#fff',
          x: -totalWidth / 2,
          y: -h / 2,
          width: w,
          height: h,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
          shadowBlur: 8,
          shadowColor: 'rgba(177, 192, 192, 0.4)',
        },
        name: 'rect-shape',
      });

      // 背景方框
      group.addShape('rect', {
        attrs: {
          x: -totalWidth / 2 + w / 6,
          y: -h / 2 + h / 6,
          width: (w * 2) / 3,
          height: (h * 2) / 3,
          fill: style.fill,
          radius: 2,
          cursor: 'pointer',
        },
        draggable: true,
        name: 'bg-shape',
      });

      // iconfont
      group.addShape('text', {
        attrs: {
          text,
          x: -totalWidth / 2 + w / 2,
          y: -h / 2 + w / 2,
          fontFamily: 'iconfont',
          textAlign: 'center',
          textBaseline: 'middle',
          fontSize: w / 3,
          fill: '#fff',
          cursor: 'pointer',
        },
        draggable: true,
        name: 'text-shape',
      });

      // 下面标题
      const rectShapeBB = rectShape.getBBox();
      let titleShape = rectShape;
      if (label === '入口' || !hideLabel) {
        titleShape = group.addShape('text', {
          attrs: {
            x: -totalWidth / 2 + w / 2,
            y: rectShapeBB.y + rectShapeBB.height + 23,
            text: fittingString(label, w * 3, 13),
            // textBaseline: 'top',
            textAlign: 'center',
            fill: '#505C70',
            fontSize: 13,
            fontWeight: 500,
            ...labelCfg.style,
          },
          draggable: true,
          name: 'title-shape',
        });
      }

      // 下面TPS/RT
      // let subTitleShape = titleShape;
      // if (subLabel && label !== '入口') {
      //   const titleShapeBB = titleShape.getBBox();
      //   subTitleShape = group.addShape('text', {
      //     attrs: {
      //       x: -totalWidth / 2 + w / 2,
      //       y: titleShapeBB.y + titleShapeBB.height + 10,
      //       text: fittingString(subLabel, totalWidth * 2, 13),
      //       textBaseline: 'top',
      //       textAlign: 'center',
      //       fill: '#24282E',
      //       fontSize: 14,
      //       fontWeight: 'bold',
      //     },
      //     draggable: true,
      //     name: 'subtitle-shape',
      //   });
      // }

      // 下方瓶颈显示
      // if (bottleneckMap.showBottleneckBtn && bottleneckMap.count > 0) {
      //   const subTitleShapeBB = subTitleShape.getBBox();
      //   const bottleneckBtnShape = group.addShape('rect', {
      //     attrs: {
      //       x: rectShapeBB.x,
      //       y: subTitleShapeBB.y + subTitleShapeBB.height + 10,
      //       width: rectShapeBB.width,
      //       height: 24,
      //       fill: {
      //         1: '#FFA800',
      //         2: '#ED6047'
      //       }[bottleneckMap.type || '1'] ,
      //       radius: 12,
      //       cursor: 'pointer',
      //     },
      //     draggable: true,
      //     name: 'bottleneck-shape',
      //   });
      //   const bottleneckBtnShapeBB = bottleneckBtnShape.getBBox();
      //   group.addShape('text', {
      //     attrs: {
      //       x: -totalWidth / 2 + w / 2,
      //       y: bottleneckBtnShapeBB.y + 6,
      //       text: fittingString(`瓶颈 ${bottleneckMap.count}`, bottleneckBtnShapeBB.width, 12),
      //       textBaseline: 'top',
      //       textAlign: 'center',
      //       fill: '#fff',
      //       fontSize: 12,
      //       lineHeight: 24,
      //       cursor: 'pointer',
      //     },
      //     draggable: true,
      //     name: 'bottleneck-txt-shape',
      //   });
      // }

      const expanderBoxHeight = expanderTypeCounts * 16;
      let expanderTextY = 16 + (h - expanderBoxHeight) / 2;
      // 右侧折叠
      // @ts-ignore
      Object.entries(subNodesCountMap).forEach(([key, { count, bottleneckType }]) => {
        if (count > 0) {
          // 瓶颈状态
          if (bottleneckMap.showBottleneckBtn && bottleneckType) {
            const bottleneckTypeTextShape = group.addShape('rect', {
              attrs: {
                x: -totalWidth / 2 + w + 8,
                y: -h / 2 + expanderTextY - 12,
                width: 8,
                height: 8,
                fill: {
                  1: '#FFA800',
                  2: '#ED6047'
                }[bottleneckType || '1'],
                radius: 4,
              },
              name: `expander-bottleneck-${key}`
            });
          }

          const str = `${GRAPH_FILTER[key]?.title}-${count}`;
          const expanderTextShape = group.addShape('text', {
            attrs: {
              x: -totalWidth / 2 + w + (bottleneckType ? 20 : 8),
              y: -h / 2 + expanderTextY,
              text: str,
              fill: '#3D485A',
              fontSize: 14,
              fontWeight: 'bold',
              cursor: 'pointer',
            },
            name: `expander-text-${key}`,
          });
          const bbox = expanderTextShape.getBBox(); // 获取文本的包围盒
          const isExpanded = !!expanderTypeState[key];

          group.addShape('text', {
            attrs: {
              x: bbox.x + bbox.width + 8, // 根据前面文本的宽度计算icon的位置
              y: -h / 2 + expanderTextY,
              text: isExpanded ? `\ue620` : `\ue61f`,
              fill: isExpanded ? '#FFA629' : '#00D683',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'iconfont',
              cursor: 'pointer',
            },
            name: `expander-icon-${key}`,
          });
          expanderTextY += 16;
        }
      });
      return keyShape;
    },
    setState(name, value, item: any) {
      const group = item.getContainer();
      const shape = group.get('children')?.[1]; // 顺序根据 draw 时确定
      if (!shape) {
        return;
      }
      if (name === 'hover') {
        if (value) {
          shape.attr({
            shadowOffsetX: 0,
            shadowOffsetY: 7,
            shadowBlur: 18,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          });
        } else {
          shape.attr({
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(177, 192, 192, 0.4)',
          });
        }
      }
      if (name === 'click') {
        if (value) {
          shape.attr('stroke', '#00D77D');
        } else {
          shape.attr('stroke', 'transparent');
        }
      }
      if (name === 'fade') {
        if (value) {
          group.attr('opacity', 0.2);
        } else {
          group.attr('opacity', undefined);
        }
      }
      if (name === 'focus') {
        if (value) {
          shape.animate(ratio => {
            let stroke = 'red';
            switch (true) {
              case ratio < 0.25:
                stroke = 'red';
                break;
              case ratio < 0.5:
                stroke = '#e8e8e8';
                break;
              case ratio < 0.75:
                stroke = 'red';
                break;
              default:
                stroke = '#e8e8e8';
            }
            return {
              stroke,
              lineWidth: 2,
            };
          }, {
            repeat: false,
            duration: 2000,
            easing: 'easeCubic',
          });
        } else {
          shape.stopAnimate();
          shape.attr({
            stroke: item.hasState('click') ? '#00D77D' : '#E8E8E8',
            lineWidth: 1,
          });
        }
      }
    },
  });
};
