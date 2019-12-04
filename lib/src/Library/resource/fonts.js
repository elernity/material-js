import {
  Platform
} from 'react-native';
/**
 * 支持的字体集，按平台分类
 */
const fonts = Platform.select({
  ios: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    light: 'HelveticaNeue-Light',
    thin: 'HelveticaNeue-Thin',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    light: 'sans-serif-light',
    thin: 'sans-serif-thin',
  },
});

export default fonts;
