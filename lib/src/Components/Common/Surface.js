import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated
} from 'react-native';
import shadow from '../../Library/resource/shadow';

class Surface extends React.Component {
  static propTypes = {
      style: PropTypes.any,
  };
  render() {
    const {
      style,
      ...rest
    } = this.props;
    const flattenedStyles =
      StyleSheet.flatten([styles.surface, style]);
    const { elevation } = flattenedStyles;
    return (
      <Animated.View
        {...rest}
        style={[
          shadow(elevation),
          flattenedStyles,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 3,
  },
});

export default Surface;
