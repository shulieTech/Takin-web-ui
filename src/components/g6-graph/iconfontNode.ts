import G6 from '@antv/g6';

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = '...';
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) { return; }
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
  G6.registerNode(
    'iconfont',
    {
      // @ts-ignore
      draw(cfg: ModelConfig, group: IGroup) {
        // @ts-ignore
        const { size, style, text, label, _label, labelCfg, img } = cfg || {};

        const w = Array.isArray(size) ? size[0] : size;
        const h = Array.isArray(size) ? size[1] : size;

        const keyShape = group.addShape('rect', {
          attrs: {
            ...style,
            fill: '#fff',
            x: -w / 2,
            y: -h / 3,
            width: w,
            height: h,
          },
          draggable: true,
          name: 'box-shape'
        });

        group.addShape('rect', {
          attrs: {
            x: -w / 3,
            y: -h / 6,
            width: w * 2 / 3,
            height: h * 2 / 3,
            fill: style.fill,
            radius: 2,
            cursor: 'pointer',
          },
          draggable: true,
          name: 'bg-shape'
        });

        group.addShape('text', {
          attrs: {
            text,
            x: 0,
            y: h / 6,
            fontFamily: 'iconfont',
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: w / 3,
            fill: '#fff',
            cursor: 'pointer',
          },
          draggable: true,
          name: 'text-shape'
        });

        group.addShape('text', {
          attrs: {
            textAlign: 'center',
            textBaseline: 'middle',
            x: 0,
            y: h * 1.25,
            text: fittingString(label, w + 40, labelCfg?.style?.fontSize || 14),
            ...labelCfg.style,
          },
          draggable: true,
          name: 'label-shape'
        });

        return keyShape;
      },
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get('children')?.[0]; // 顺序根据 draw 时确定
        if (!shape) {
          return;
        }
        if (name === 'hover') {
          if (value) {
            shape.attr({
              shadowOffsetX: 2,
              shadowOffsetY: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(177, 192, 192, 0.4)',
            });
          } else {
            shape.attr({
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 0,
              shadowColor: 'rgba(177, 192, 192, 0.4)',
            });
          }
        }
        if (name === 'click') {
          if (value) {
            shape.attr('stroke', '#11BBD5');
          } else {
            shape.attr('stroke', '#E8E8E8');
          }
        }
      },
    },
  );
};
