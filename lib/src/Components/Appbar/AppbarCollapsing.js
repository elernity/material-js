import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    View,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';
import ActionItem from './AppbarActionItem';
import { withTheme } from '../../Library/themeContext';

class AppbarCollapsing extends React.Component {

    static propTypes = {
        autoScroll: PropTypes.bool,
        overlayColor: PropTypes.string,
        color: PropTypes.string,
        bgImg: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        navigationItem: PropTypes.node,
        actionItems: PropTypes.node,
        title: PropTypes.string,
        titleColor: PropTypes.string,
        titleRender: PropTypes.func,
        extraRender: PropTypes.func,
        appbarMaxHeight: PropTypes.number,
        appbarMinHeight: PropTypes.number,
        childrenMinHeight: PropTypes.number,
        children: PropTypes.node.isRequired,
    }

    static defaultProps = {
        autoScroll: false,
        title: '',
        appbarMaxHeight: 200,
        appbarMinHeight: 55,
        childrenMinHeight: 700,
    }

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            windowWidth: Dimensions.get('window').width,
        };
        this._onRotateScreen = this._onRotateScreen.bind(this);
    }

    _onRotateScreen({window, screen}) {
        this.setState({
            windowWidth: window.width,
        })
    }

    componentWillMount() {
        // 动态监听滑动值
        // 该监听用于获取实时滑动位移 在用户拖动结束时 根据位移判断复原方向
        this.state.scrollY.addListener(({value}) => this._scrollY = value);
        // 监听横竖屏切换
        Dimensions.addEventListener('change', this._onRotateScreen);
    }

    componentWillUnmount() {
        // 移除监听
        this.state.scrollY.removeAllListeners();
        // 移除横竖屏切换监听
        Dimensions.removeEventListener('change', this._onRotateScreen);
    }

    render() {
        const {
            autoScroll,
            overlayColor,
            color,
            bgImg,
            navigationItem,
            actionItems,
            title,
            titleColor,
            titleRender,
            extraRender,
            appbarMaxHeight,
            appbarMinHeight,
            childrenMinHeight,
            children,
            theme
        } = this.props;

        const bgColor = color || theme.appbar.bgColor;
        const realTitleColor = titleColor || theme.appbar.titleColor;
        const titleFontFamily = theme.appbar.titleFontFamily;

        const titleStyle = {
            fontSize: 20,
            color: realTitleColor,
            fontFamily: titleFontFamily,
        };

        // 导航栏压缩距离
        const scrollDistance = appbarMaxHeight - appbarMinHeight;

        // 导航栏压缩动画
        const appbarTranslate = this.state.scrollY.interpolate({
            inputRange: [0, scrollDistance],
            outputRange: [0, -scrollDistance],
            extrapolate: 'clamp',
        });

        // 导航栏淡入淡出动画
        const barOpacity = this.state.scrollY.interpolate({
            inputRange: [0, scrollDistance / 2, scrollDistance],
            outputRange: [0, 0, 0.6],
            extrapolate: 'clamp',
        });

        // 背景图淡入淡出动画
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, scrollDistance / 2, scrollDistance],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });

        // 背景图移动动画
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, scrollDistance],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        // 标题缩放动画
        const titleScale = this.state.scrollY.interpolate({
            inputRange: [0, scrollDistance / 2, scrollDistance],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });

        // 子节点（即Appbar下部内容）最小高度（期望值）
        const expectChildrenMinHeight =
            Dimensions.get('window').height - appbarMaxHeight + scrollDistance;
        // 子节点最小高度（真实值）不允许用户设置的最小高度小于期望值
        const realChildrenMinHeight = Math.max(childrenMinHeight, expectChildrenMinHeight);

        // 滑动监听 建立位移值y与scrollY的映射
        const onScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
        );

        // 滑动终止监听
        // 因为最后状态的形成可能是用户终止操作或惯性滑动 因此这两个事件均会触发此监听
        // 当autoScroll标志位为真时有效 以滑动距离的一半为界
        const onScrollEnd = () => {
            // autoScroll为false时不处理
            if (!autoScroll) {
                return;
            }
            // 只处理滑动中间态 即 0 < scrollY < scrollDistance
            if (this._scrollY < 0 || this._scrollY > scrollDistance) {
                return;
            }
            const targetY = this._scrollY > scrollDistance / 2
                ? scrollDistance // 滑至底部
                : 0; // 滑至顶部
            this._scrollView.getNode().scrollTo({
                x: 0,
                y: targetY,
                animated: true,
            });
        };

        return (
            <View style={styles.fill}>
                {/* 除导航栏外的其他部分 */}
                <Animated.ScrollView
                    style={styles.fill}
                    onScroll={onScroll}
                    onScrollEndDrag={onScrollEnd}
                    onMomentumScrollEnd={onScrollEnd}
                    ref={ref => {this._scrollView = ref}}
                    scrollEventThrottle={1}
                >
                    <View style={{
                        marginTop: appbarMaxHeight,
                        minHeight: realChildrenMinHeight,
                    }}>
                        {children}
                    </View>
                </Animated.ScrollView>
                {/* 上部导航栏遮罩部分 一般当背景色透明时才使用 后续可能会删除 */}
                {overlayColor && (
                    <Animated.View
                        style={[
                            styles.bar,
                            {
                                backgroundColor: overlayColor,
                                opacity: barOpacity,
                            }
                        ]}
                    />
                )}
                {/* 导航栏除点击图标外的部分 */}
                <Animated.View
                    style={[
                        styles.appbar,
                        {
                            width: this.state.windowWidth,
                            height: appbarMaxHeight,
                            backgroundColor: bgColor,
                            transform: [{ translateY: appbarTranslate }],
                        },
                    ]}
                >
                    {/* 背景图 */}
                    {bgImg && (
                        <Animated.Image
                            source={bgImg}
                            style={[
                                styles.backgroundImage,
                                {
                                    width: this.state.windowWidth,
                                    height: appbarMaxHeight,
                                    opacity: imageOpacity,
                                    transform: [{ translateY: imageTranslate }],
                                },
                            ]}
                        />
                    )}
                    {/* 标题 */}
                    { titleRender ?
                        titleRender(this.state.scrollY, scrollDistance) :
                        (
                            <Animated.View
                                style={[
                                    styles.titleContainer,
                                    { transform: [{ scale: titleScale }] },
                                ]}
                            >
                                <Text style={titleStyle}>
                                    {title}
                                </Text>
                            </Animated.View>
                        )
                    }
                    {/* 其他视图 */}
                    { extraRender && extraRender(this.state.scrollY, scrollDistance) }
                </Animated.View>
                {/* 上部导航栏 */}
                <View style={styles.bar}>
                    <View style={styles.navigationItem}>{navigationItem}</View>
                    <View style={styles.actionItems}>
                        {
                            React.Children.toArray(actionItems.props.children)
                                .map((child, i, childrenArr) => {
                                    if (!React.isValidElement(child)) {
                                        return child;
                                    }
                                    const props = {};
                                    if (child.type === ActionItem) {
                                        let marginRight = 24;
                                        if (i === childrenArr.length - 1) {
                                            marginRight = 0;
                                        }
                                        props._style = [
                                            { marginRight },
                                            child.props.style
                                        ];
                                    }
                                    return React.cloneElement(child, props);
                                })
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    bar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    appbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover',
    },
    titleContainer: {
        position: 'absolute',
        left: 45,
        bottom: 14,
    },
    navigationItem: {
        flexDirection: "row",
        marginLeft: 16,
    },
    actionItems: {
        flexDirection: "row",
        marginRight: 16,
    },
});

export default withTheme(AppbarCollapsing);
