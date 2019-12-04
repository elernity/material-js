import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    View,
    Modal,
    TouchableWithoutFeedback,
    Easing,
    Dimensions,
    StyleSheet
} from 'react-native';
import Surface from '../Common/Surface';
import { withTheme } from '../../Library/themeContext';


// 三种状态： 隐藏 展示中 展示
const STATES = {
    HIDDEN: 'HIDDEN',
    WANT_SHOW: 'WANT_SHOW',
    ANIMATING: 'ANIMATING',
    SHOWN: 'SHOWN',
};

// 展示动画持续时间
const ANIMATION_DURATION = 300;
// 效果详见 https://cubic-bezier.com/#.4,0,.2,1
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
// 最小屏内间距
const SCREEN_INDENT = 8;

class Menu extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        anchor: PropTypes.node.isRequired,
        onDismiss: PropTypes.func,
        style: PropTypes.any,
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            // 菜单初始化状态
            menuState: STATES.HIDDEN,
            // 菜单位置参数
            top: 0,
            left: 0,
            // 菜单宽高
            menuWidth: 0,
            menuHeight: 0,
            // 用于弹出菜单的按钮宽高
            anchorWidth: 0,
            anchorHeight: 0,
            // 菜单弹出/回收动画
            scaleAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
            // 菜单淡入/淡出动画
            opacityAnimation: new Animated.Value(0),
            windowWidth: Dimensions.get('window').width,
            windowHeight: Dimensions.get('window').height,
        };

        this._onRotateScreen = this._onRotateScreen.bind(this);
    }

    // 监听横竖屏变化，重置状态，以防用户骚操作，加上为妙
    _onRotateScreen({window, screen}) {
        console.log(`Dimensions changed, width: ${window.width}, height: ${window.height}`);
        this._container.measureInWindow((x, y) => {
            const top = Math.max(SCREEN_INDENT, y);
            const left = Math.max(SCREEN_INDENT, x);
            let menuState = this.state.menuState;
            if (menuState === STATES.ANIMATING
                || menuState === STATES.SHOWN) {
                menuState = STATES.WANT_SHOW;
            }
            this.setState({
                menuState,
                top,
                left,
                menuWidth: 0,
                menuHeight: 0,
                scaleAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
                opacityAnimation: new Animated.Value(0),
                windowWidth: window.width,
                windowHeight: window.height,
            });
        });
    }

    componentWillMount() {
        Dimensions.addEventListener('change', this._onRotateScreen);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onRotateScreen);
    }

    _container = null;

    // 内部方法 设置容器的ref
    // 这里的容器内部只包含一个按钮 菜单显示在Modal上
    // 用以定位菜单需要展示的区域
    _setContainerRef = ref => {
        this._container = ref;
    };

    // 内部方法 保存按钮的宽高
    _onAnchorLayout = e => {
        const { width, height } = e.nativeEvent.layout;
        this.setState({
            anchorWidth: width,
            anchorHeight: height
        });
    };

    // 内部方法 菜单显示动画
    _onMenuLayout = e => {
        if (this.state.menuState === STATES.ANIMATING
            || this.state.menuState === STATES.SHOWN) {
            return;
        }
        // 获取显示菜单的宽高
        const { width, height } = e.nativeEvent.layout;
        // 设置菜单的状态及宽高
        this.setState(
            {
                menuState: STATES.ANIMATING,
                menuWidth: width,
                menuHeight: height,
            },
            // 开启动画: 伸展宽高 增加不透明度
            () => {
                Animated.parallel([
                    Animated.timing(this.state.scaleAnimation, {
                        toValue: { x: width, y: height },
                        duration: ANIMATION_DURATION,
                        easing: EASING,
                    }),
                    Animated.timing(this.state.opacityAnimation, {
                        toValue: 1,
                        duration: ANIMATION_DURATION,
                        easing: EASING,
                    }),
                ]).start(() => {
                    this.setState({
                        menuState: STATES.SHOWN,
                    });
                });
            },
        );
    };

    // 内部方法 显示菜单
    // 默认菜单左上角与容器左上角对齐 最小屏内间距为8
    _show = () => {
        this._container.measureInWindow((x, y) => {
            const top = Math.max(SCREEN_INDENT, y);
            const left = Math.max(SCREEN_INDENT, x);
            this.setState({
                menuState: STATES.WANT_SHOW,
                top,
                left,
            });
        });
    }

    // 内部方法 隐藏菜单
    _dismiss = () => {
        Animated.timing(this.state.opacityAnimation, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            easing: EASING,
        }).start(() => {
            // 动画结束后 重置菜单宽高 透明度
            this.setState(
                {
                    menuState: STATES.HIDDEN,
                    scaleAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
                    opacityAnimation: new Animated.Value(0),
                },
                () => {
                    // 重置结束后 回调onDismiss
                    this._onDismiss();
                },
            );
        });
    }

    // 内部方法 菜单隐藏回调
    _onDismiss = () => {
        const {
            onDismiss
        } = this.props;
        onDismiss && onDismiss();
    }

    show() {
        this._show();
    };

    dismiss() {
        this._dismiss();
    };

    render() {

        const {
            children,
            anchor,
            style,
            theme
        } = this.props;

        const {
            menuState,
            menuWidth,
            menuHeight,
            anchorWidth,
            anchorHeight,
            scaleAnimation,
            opacityAnimation,
        } = this.state;

        let {
            top,
            left,
            windowWidth,
            windowHeight,
        } = this.state;

        const borderRadius = theme.roundness;
        const menuBgColor = theme.popupWindow.bgColor;

        const menuSize = {
            width: scaleAnimation.x,
            height: scaleAnimation.y,
        };

        const transforms = [];

        // 如果按照当前显示策略会导致最后的屏内间距小于最小屏内间距
        // 则反转菜单伸展的x轴坐标 即将从左往右的伸展动画改为从右往左 菜单与按钮右上角对齐
        if (windowWidth - menuWidth - left < SCREEN_INDENT) {
            transforms.push({
                translateX: Animated.multiply(scaleAnimation.x, -1),
            });
            // 重置left值
            // 由于现在是从右往左伸展 故原来的left值实际为菜单伸展后的屏内右间距
            // 因此,left值应为 原left值+按钮宽度, 且不能小于 屏幕宽度-最小屏内间距
            // 也就是说, 最右边最少保留最小屏内间距的空间
            left = Math.min(windowWidth - SCREEN_INDENT, left + anchorWidth);
        }

        // 如果按照当前显示策略会导致最后的屏内间距小于最小屏内间距
        // 则反转菜单伸展的y轴坐标 即将从上往下的伸展动画改为从下往上 菜单与按钮左下角对齐
        if (windowHeight - menuHeight - top < SCREEN_INDENT) {
            transforms.push({
                translateY: Animated.multiply(scaleAnimation.y, -1),
            });
            // 重置top值
            // 由于现在是从下往上伸展 故原来的top值实际为菜单伸展后的屏内下间距
            // 因此,top值应为 原top值+按钮高度, 且不能小于 屏幕高度-最小屏内间距
            // 也就是说, 最下边最少保留最小屏内间距的空间
            top = Math.min(windowHeight - SCREEN_INDENT, top + anchorHeight);
        }

        // 菜单容器样式
        const menuContainerStyle = {
            opacity: opacityAnimation,
            transform: transforms,
            left,
            top,
        };

        const isAnimating = menuState === STATES.ANIMATING;
        const isHidden = menuState === STATES.HIDDEN;

        return (
            <View ref={this._setContainerRef} collapsable={false}>
                <View onLayout={this._onAnchorLayout}>
                    {anchor}
                </View>
                <Modal
                    transparent
                    visible={!isHidden}
                    onRequestClose={this._dismiss} // 返回键触发
                >
                    <TouchableWithoutFeedback
                        onPress={this._dismiss} // 点击空白区域触发
                    >
                        <View style={StyleSheet.absoluteFill}>
                            <Surface
                                onLayout={this._onMenuLayout} // 菜单容器
                                style={[
                                    styles.menuSurface,
                                    {
                                        borderRadius,
                                        backgroundColor: menuBgColor,
                                    },
                                    style,
                                    menuContainerStyle,
                                    isAnimating && menuSize // 在动画阶段 限制菜单宽高令其逐渐增长
                                ]}
                            >
                                {children}
                            </Surface>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuSurface: {
        position: 'absolute',
        overflow: 'hidden',
        elevation: 8,
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    }
});

export default withTheme(Menu);
