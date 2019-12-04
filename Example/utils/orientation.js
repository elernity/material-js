import { Dimensions } from 'react-native';

export const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
}

export const isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
}
