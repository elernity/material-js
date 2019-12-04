import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet
} from 'react-native';
import Icon from '../Common/Icon';

export default class ListIcon extends React.Component {

    static propTypes = {
        icon: PropTypes.string.isRequired,
        color: PropTypes.string,
    };

    static defaultProps = {
        color: 'black',
    };

    render() {
        const {
            icon,
            color
        } = this.props;

        return (
        <View style={styles.item}>
            <Icon source={icon} color={color} size={24} />
        </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        margin: 8,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
