import * as React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 副标题
class Subheading extends React.Component {
    render() {
        const {
            style,
            theme,
            ...rest
        } = this.props;
        return (
            <Text
                {...rest}
                style={[
                    styles.subheading,
                    theme.textSubheading,
                    style,
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    subheading: {
        textAlign: 'left',
        lineHeight: 24,
        marginVertical: 2,
    },
});

export default withTheme(Subheading);
