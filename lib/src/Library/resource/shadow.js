import {
  Animated
} from 'react-native';
/**
 * 阴影属性配置（iOS专用）
 * ps.安卓使用elevation即可
 */
// 这些是固定值 不允许改变
const SHADOW_COLOR = 'black';
const SHADOW_OPACITY = 0.24;
const SHADOW_WIDTH = 0;
// 这些是动态值 根据传参变化 这里仅提供默认值
const SHADOW_HEIGHT = 0;
const SHADOW_RADIUS = 0;

function shadow(elevation = 0) {
  let height = SHADOW_HEIGHT;
  let radius = SHADOW_RADIUS;

  if (elevation instanceof Animated.Value) {
    // 如果是动态值 使用插值映射
    height = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.5, 0.75, 2, 7, 23],
    });
    radius = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.75, 1.5, 3, 8, 24],
    });
  } else {
    // 否则 分情况处理
    switch (elevation) {
      case 1:
        height = 0.5;
        radius = 0.75;
        break;
      case 2:
        height = 0.75;
        radius = 1.5;
        break;
      default:
        height = elevation - 1;
        radius = elevation;
    }
  }
  return {
    shadowColor: SHADOW_COLOR, // 阴影颜色
    shadowOpacity: SHADOW_OPACITY, // 阴影透明度
    shadowOffset: { // 阴影偏移值
      width: SHADOW_WIDTH,
      height: height,
    },
    shadowRadius: radius, // 阴影圆角
  };
}
export default shadow;
