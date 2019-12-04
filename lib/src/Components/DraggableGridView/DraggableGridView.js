import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    Animated,
    Easing,
    PanResponder,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Surface from '../Common/Surface';
import TouchableRipple from '../Common/TouchableRipple';
import { alpha } from '../../Library/util';
import { withTheme } from '../../Library/themeContext';

// 未抬升时的海拔高度
const ELEVATION_LOW = 2;
// 抬升后的海拔高度
const ELEVATION_HEIGHT = 8;
// 滑动动画持续时间
const DURATION_SLIDE = 300;
// 外部ScrollView滚动动画持续时间
const DURATION_SCROLL = 300;
// 拖拽越界定时任务间隔时间
const INTERVAL_OVERSTEP = 500;
// 拖拽结束定时任务间隔时间 因为我们是长按触发拖拽 所以间隔时间要小于默认的长按触发时间(500ms)
const INTERVAL_ENDSLIDE = 300;
// 移动速度的默认阈值
const DEFAULT_THROTTLE = 2;

class DraggableGridView extends Component {

    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        parentWidth: PropTypes.number,
        childrenHeight: PropTypes.number.isRequired,
        childrenWidth: PropTypes.number.isRequired,
        scrollViewRef: PropTypes.object,
        scrollViewHeight: PropTypes.number,
        scrollViewOffset: PropTypes.number,
        AnimatedThrottle: PropTypes.number,

        marginChildrenTop: PropTypes.number,
        marginChildrenBottom: PropTypes.number,
        marginChildrenLeft: PropTypes.number,
        marginChildrenRight: PropTypes.number,
        rippleColor: PropTypes.string,

        renderItem: PropTypes.func.isRequired,
        onClickItem: PropTypes.func,
        onLongPress: PropTypes.func,
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func,
        onOverStepTop: PropTypes.func,
        onOverStepBottom: PropTypes.func,
        fixedItems: PropTypes.array,
        keyExtractor: PropTypes.func,
    }

    static defaultProps = {
        marginChildrenTop: 0,
        marginChildrenBottom: 0,
        marginChildrenLeft: 0,
        marginChildrenRight: 0,
        fixedItems: [],
    }

    constructor(props) {
        super(props);
        // 子项的实例集合
        this.itemRefs = new Map();
        this.rowNum = 1;
        this.marginLeft = 0;
        this.scrollViewHeight = props.scrollViewHeight;
        this.scrollViewOffset = props.scrollViewOffset;
        // 计算宽度，item宽度=宽度+左边距+右边距
        this.itemWidth = props.childrenWidth
            + props.marginChildrenLeft
            + props.marginChildrenRight;
        // 计算高度，item高度=高度+上边距+下边距
        this.itemHeight = props.childrenHeight
            + props.marginChildrenTop
            + props.marginChildrenBottom;
        // 固定项索引最大值 用于约束删除方法
        this.maxIndexOfFixedItem = Math.max(...props.fixedItems);
        // DraggableGridView顶部相对于ScrollView顶部的距离
        // 因为ScrollView可能不仅仅包含DraggableGridView，因此需要这个距离配合ScrollOffset做越界判断
        // 注意，区别于curTopRelativeToScrollView，那是经过计算的子项顶部相对于ScrollView顶部的距离
        this.topRelativeToScrollView = 0;
        // 是否移动过
        // 可能用户仅仅是长按子项，没有任何移动动作。这种情况下手势管理器无法监听到释放操作，
        // 因此需要这个标志位来判断：在这种情况下，通过onPressOut来做收尾处理（比如放低子项）
        this.hasCalledOnSlide = false;
        // 用来记录越界状态下累计的ScrollViewOffset
        // 由于scrollTo存在延迟，无法与拖动块同步，所以添加这个变量来保证scrollTo位置最新
        this.aggregateScrollViewOffset = props.scrollViewOffset;
        // 初始化state
        this._reComplexDataSource(props);
        this._onRotateScreen = this._onRotateScreen.bind(this);
    }

    // todo: 横竖屏处理优化
    // 监听横竖屏变化 一旦变化 重新计算子项布局
    _onRotateScreen({window, screen}) {
        console.log(`width: ${window.width}, height: ${window.height}`);
        // 如果当前的拖拽项还未做收尾处理 手动调用endSlide收尾
        if (!!this.touchCurItem) {
            this.endSlide(null);
        }
        this._reComplexDataSource(this.props);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onRotateScreen);
        this._clearIntervalForOverStep();
        this._clearIntervalForEndSlide();
    }

    componentWillMount() {
        Dimensions.addEventListener('change', this._onRotateScreen);
        // 手指滑动操作必须用PanResponder处理，作用于item
        this._panResponder = PanResponder.create({
            // 是否拦截触摸开始事件，false表示不拦截意味着允许子视图响应触摸开始事件
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                // isMovePanResponder为false，则由子视图响应触摸滑动事件，本视图不作为触摸滑动事件的响应者，这是为了让子视图能够响应点击/长按事件
                // 在长按（表示将要拖动）监听触发后，此项置为true，开始由本视图响应触摸滑动，带动整体滑动
                this.isMovePanResponder = false;
                return false;
            },
            // 是否拦截触摸滑动事件
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.isMovePanResponder,
            // 是否成为触摸开始事件的响应者
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // 是否成为触摸滑动事件的响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => this.isMovePanResponder,
            // 触摸开始响应监听
            onPanResponderGrant: (evt, gestureState) => {},
            // 触摸滑动响应监听
            onPanResponderMove: (evt, gestureState) => this.onSlide(evt, gestureState),
            // 触摸结束响应监听
            onPanResponderRelease: (evt, gestureState) => this.endSlide(evt),
            // 不允许其他视图响应触摸
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            // 有其他组件请求接替其成为响应者
            // 添加这个监听以解决scrollview下触摸结束监听不响应问题
            // issue: https://github.com/facebook/react-native/issues/9447
            onPanResponderTerminate: (evt, gestureState) => {
                if (!!this.props.scrollViewRef) {
                    this.endSlide(evt);
                }
            },
            // 允许原生组件响应触摸事件（仅Android支持）
            onShouldBlockNativeResponder: (evt, gestureState) => false,
        });
    }

    /**
     * 滑动开始（由长按事件触发）：
     *  配置当前触摸项信息
     * @param {number} touchIndex 当前响应触摸事件的子项索引
     */
    startSlide(touchIndex) {
        // fixedItems数组中定义的项，不允许拖动。默认为空数组
        if (this._isFixedItem(touchIndex)) {
            return;
        }
        // 子项实例集合中存在当前索引对应的实例 =>
        // 创建touchCurItem，塞入实例、初始索引、初始位置、目的位置索引
        if (this.itemRefs.has(touchIndex)) {
            if (!!this.props.onDragStart) {
                this.props.onDragStart(touchIndex);
            }
            this.touchCurItem = {
                ref: this.itemRefs.get(touchIndex),
                index: touchIndex,
                originLeft: this.state.dataSource[touchIndex].originLeft,
                originTop: this.state.dataSource[touchIndex].originTop,
                moveToIndex: touchIndex,
                // 额外的y轴移动 由于拖拽项到顶部/底部时 scrollview自动滚动 当前拖拽项也需要附加位移值以便跟上手指
                extraDy: 0,
                // 拖拽项自拖拽开始到现在的位移
                dx: 0,
                dy: 0,
            };
            // 即将开始滑动，无需响应点击事件，允许父视图成为触摸滑动响应者
            this.isMovePanResponder = true;
            // 抬升滑动块
            Animated.timing(this.state.dataSource[touchIndex].elevation, {
                toValue: ELEVATION_HEIGHT,
                duration: 200,
            }).start();
        }
    }

    componentWillReceiveProps(nextProps) {
        // 实时获取当前的scrollview高度和偏移值
        this.scrollViewHeight = nextProps.scrollViewHeight;
        this.scrollViewOffset = nextProps.scrollViewOffset;
    }

    /**
     * 移动item至position处。如果超出边界会修正目标位置
     * @param {obj} item 移动项
     * @param {{x, y}} position 目标位置
     * @param {boolean} animated 是否需要动画效果
     */
    _moveTo(item, position, animated) {
        // 每行个数
        const rowNum = this.rowNum;
        // 子项left最大值=容器宽度-子项宽度
        const maxLeft = this.state.parentWidth - this.itemWidth;
        // 子项top最大值=容器高度-子项高度
        const maxTop = this.state.parentHeight - this.itemHeight;
        // 如果出界，修正目标位置
        if (position.x < 0) {
            position.x = 0;
        } else if (position.x > maxLeft) {
            position.x = maxLeft;
        }
        if (position.y < 0) {
            position.y = 0;
        } else if (position.y > maxTop) {
            position.y = maxTop;
        }
        if (!!animated) {
            Animated.timing(
                item.position,
                {
                    toValue: {
                        x: position.x,
                        y: position.y,
                    },
                    duration: DURATION_SLIDE,
                    easing: Easing.out(Easing.quad),
                }
            ).start();
        } else {
            item.position.setValue({
                x: position.x,
                y: position.y,
            });
        }
    }

    /**
     * 根据index换算当前的位置
     * @param {number} index 子项索引
     */
    _index2Position(index) {
        const rowNum = this.rowNum;
        const marginLeft = this.marginLeft;
        const itemWidth = this.itemWidth;
        const itemHeight = this.itemHeight;
        // 左位置=(索引%每行个数)*item宽度
        const left = (index % rowNum) * itemWidth + marginLeft;
        // 上位置=(索引/每行个数)*item高度
        const top = parseInt((index / rowNum)) * itemHeight;
        return {
            x: left,
            y: top,
        };
    }

    /**
     * 根据位置换算当前的index
     * @param {{x, y}} position 子项位置
     */
    _position2Index(position) {
        const rowNum = this.rowNum;
        const marginLeft = this.marginLeft;
        const itemWidth = this.itemWidth;
        const itemHeight = this.itemHeight;
        let left = position.x;
        let top = position.y;
        if (left > marginLeft) {
            left -= marginLeft;
        }
        // 第几行
        const rowIndex = parseInt(top / itemHeight + 0.5);
        // 第几列
        const columnIndex = parseInt(left / itemWidth + 0.5);
        const targetIndex = Math.max(0, columnIndex + rowIndex * rowNum);
        return targetIndex;
    }


    _isOverStepTop() {
        if (!this.props.scrollViewRef) {
            return false;
        }
        const touchItem = this.touchCurItem;
        // 相对于ScrollView 当前拖动项的top线位置
        const curTopRelativeToScrollView =
            touchItem.originTop + touchItem.dy + touchItem.extraDy - (this.scrollViewOffset - this.topRelativeToScrollView);
        return curTopRelativeToScrollView < 0;
    }

    _isOverStepBottom() {
        if (!this.props.scrollViewRef) {
            return false;
        }
        const touchItem = this.touchCurItem;
        // 相对于ScrollView 当前拖动项的bottom线位置
        const curBottomRelativeToScrollView =
            touchItem.originTop + touchItem.dy + touchItem.extraDy - (this.scrollViewOffset - this.topRelativeToScrollView) + this.itemHeight;
        return this.scrollViewHeight < curBottomRelativeToScrollView;
    }

    _clearIntervalForOverStep() {
        if (!this._timerForOverStep) {
            return;
        }
        clearInterval(this._timerForOverStep);
        this._timerForOverStep = null;
    }

    _clearIntervalForEndSlide() {
        if (!this._timerForEndSlide) {
            return;
        }
        clearInterval(this._timerForEndSlide);
        this._timerForEndSlide = null;
    }

    /**
     * 如果拖拽越界，滚动scrollview并移动当前拖拽项
     */
    _scrollAndMoveIfOverStep() {
        // 首次越界 设置重复定时器
        if (!this._timerForOverStep) {
            this.aggregateScrollViewOffset = this.scrollViewOffset;
            this._timerForOverStep = setInterval(() => {
                const scrRef = this.props.scrollViewRef;
                // 没有scrollview实例、没有拖拽项，清空定时器
                if (!scrRef || !this.touchCurItem) {
                    this._clearIntervalForOverStep();
                    return;
                }
                // this.state.dataSource 太长了，缩写一下
                const ds = this.state.dataSource;
                const touchItem = this.touchCurItem;
                const dx = touchItem.dx;
                const dy = touchItem.dy;
                // 单次滚动距离
                let unitDistance = this.itemHeight / 2;
                // scrollview将要滚动到何处
                let posScrollTo = this.aggregateScrollViewOffset;
                // 最小偏移值即ScrollView滚动到DraggableGridView顶部时的偏移值
                // 需要考虑DraggableGridView与ScrollView的Top未对齐的情况
                const minPosScrollTo = this.topRelativeToScrollView;
                // 最大偏移值即ScrollView滚动到DraggableGridView底部时的偏移值
                // 需要考虑DraggableGridView与ScrollView的Top未对齐的情况
                const maxPosScrollTo = this.state.parentHeight + this.topRelativeToScrollView - this.scrollViewHeight;
                // 拖动项将要移到何处
                let left = touchItem.originLeft + dx;
                let top = touchItem.originTop + dy + touchItem.extraDy;
                if (this._isOverStepBottom()) {
                    // 如果scrollview将要滚动的距离超过了最大值，修正滚动距离
                    if (posScrollTo + unitDistance > maxPosScrollTo) {
                        unitDistance = maxPosScrollTo - posScrollTo;
                    }
                    // 拖动触底(Bottom线不可见)
                    posScrollTo += unitDistance;
                    touchItem.extraDy += unitDistance;
                    top += unitDistance;
                    if (!!this.props.onOverStepBottom) {
                        this.props.onOverStepBottom();
                    }
                } else if (this._isOverStepTop()) {
                    // 如果scrollview将要滚动的距离小于最小值，修正滚动距离
                    if (posScrollTo - unitDistance < minPosScrollTo) {
                        unitDistance = posScrollTo - minPosScrollTo;
                    }
                    // 拖动触顶（top线不可见）
                    posScrollTo -= unitDistance;
                    touchItem.extraDy -= unitDistance;
                    top -= unitDistance;
                    if (!!this.props.onOverStepTop) {
                        this.props.onOverStepTop();
                    }
                } else {
                    // 没有越界，不作任何操作
                    return;
                }
                this.aggregateScrollViewOffset = posScrollTo;
                scrRef.scrollTo({
                    y: posScrollTo,
                    animated: true,
                    duration: DURATION_SCROLL,
                });
                this._moveTo(ds[touchItem.index], {
                    x: left,
                    y: top,
                }, true);
            }, INTERVAL_OVERSTEP);
        }
    }

    /**
     * 滑动中（由响应器触发）：
     *  实时计算并更新触摸项位置
     *  计算触摸项相对于原位置的横纵位移单位，计算目标位置索引
     *  计算当前状态下，其余子项预期位置：
     *      介于移动范围内的子项：向前/后移动一位
     *      范围外的子项：除触摸项外，位置不变
     * @param {*} nativeEvent 
     * @param {*} gestureState 
     */
    onSlide (nativeEvent, gestureState) {
        this.hasCalledOnSlide = true;
        if (!!this.touchCurItem) {
            // this.state.dataSource 太长了，缩写一下
            const ds = this.state.dataSource;
            // 横向移动距离
            let dx = gestureState.dx;
            // 纵向移动距离
            let dy = gestureState.dy;

            // 计算实际位置
            let left = this.touchCurItem.originLeft + dx;
            let top = this.touchCurItem.originTop + dy + this.touchCurItem.extraDy;

            // 在_scrollAndMoveIfOverStep之前一定要先更新dx\dy值
            this.touchCurItem.dx = dx;
            this.touchCurItem.dy = dy;
            if (this._isOverStepTop() || this._isOverStepBottom()) {
                this._scrollAndMoveIfOverStep();
            } else {
                this._moveTo(ds[this.touchCurItem.index], {
                    x: left,
                    y: top,
                }, false);
            }

            // 计算目标索引。即如果在此处松手，应该放置于哪个索引处
            // 如果拖动失败（如拖动到固定子项的位置），则弹回到原位
            let moveToIndex = this._position2Index({x: left, y: top});
            // 目标索引大于最大索引，取最大值
            if (moveToIndex > ds.length - 1) {
                moveToIndex = ds.length - 1;
            }
            // 当前moveToIndex未更新
            if (this.touchCurItem.moveToIndex !== moveToIndex) {
                // 拖动到固定子项上时，不修改目标索引，弹回到原位
                if (this._isFixedItem(moveToIndex)) {
                    return;
                }

                // 更新目标索引
                this.touchCurItem.moveToIndex = moveToIndex;

                // 手指速度阈值
                const throttle = this.props.AnimatedThrottle || DEFAULT_THROTTLE;
                // 水平/垂直方向的位移速度只要有一个大于阈值(移动过快)，都不排列其他子项
                if (Math.abs(gestureState.vx) > throttle
                    || Math.abs(gestureState.vy) > throttle) {
                    return;
                }
                // 遍历子项集合 移动每个子项 计算子项当下将要移动到的位置
                // 这里的处理手段是：当A将要移动到B处时，将B的位置信息赋予A
                ds.forEach((item, index) => {
                    // 本身是固定项，不做处理
                    if (this._isFixedItem(index)) {
                        return;
                    }
                    let toItem = null;
                    // 当前向后拖动子项 且 index介于初始值和目标值之间 => index向前一位
                    if (this.touchCurItem.index < index && index <= moveToIndex) {
                        const lastIndex = this._getLastIndex(index);
                        toItem = ds[lastIndex];
                    // 当前向前拖动子项 且 index介于初始值和目标值之间 => index向后一位
                    } else if (index >= moveToIndex && index < this.touchCurItem.index) {
                        const nextIndex = this._getNextIndex(index);
                        toItem = ds[nextIndex];
                    // index非拖动项 且 当前的位置不在原位置上(拖动造成) => 移动回原位
                    // 这种过程适用于如下情况：当拖动块A被拖动到第一位，在未松手的情况下继续拖动到中间部分，则原处于第一位的子项应该复位
                    } else if (index !== this.touchCurItem.index &&
                        (item.position.x._value !== item.originLeft ||
                            item.position.y._value !== item.originTop)) {
                        toItem = ds[index];
                    }
                    if (toItem != null) {
                        this._moveTo(item, {
                            x: parseInt(toItem.originLeft + 0.5),
                            y: parseInt(toItem.originTop + 0.5)
                        }, true);
                    }
                });
            }
        }
    }

    /**
     * 滑动结束（由响应器触发）：
     *  对齐子项到网格
     *  更新state
     * @param {*} nativeEvent 
     */
    endSlide (nativeEvent) {
        // 重置计时器
        this._clearIntervalForOverStep();
        this._clearIntervalForEndSlide();
        if (!!this.touchCurItem) {
            // this.state.dataSource 太长了，缩写一下
            const ds = this.state.dataSource;
            const startIndex = this.touchCurItem.index;
            const endIndex = this.touchCurItem.moveToIndex;
            const startItem = ds[startIndex];
            if (!!this.props.onDragEnd) {
                this.props.onDragEnd(startIndex, endIndex);
            }
            // 放低滑动块
            Animated.timing(startItem.elevation, {
                toValue: ELEVATION_LOW,
                duration: 150,
            }).start();
            if (startIndex === endIndex) {
                this._moveTo(startItem, {
                    x: parseInt(startItem.originLeft + 0.5),
                    y: parseInt(startItem.originTop + 0.5)
                }, true);
                this.touchCurItem = null;
                return;
            }
            const bakItem = {...ds[startIndex]};
            bakItem.originLeft = ds[endIndex].originLeft;
            bakItem.originTop = ds[endIndex].originTop;
            if (startIndex < endIndex) {
                // 向后拖动 其间子项向前一位
                for (let index = endIndex; index > startIndex; index--) {
                    if (this._isFixedItem(index)) {
                        continue;
                    }
                    // 每个子项根据前一项的值配置自己的值, 最前面的一项(即起始项)不配置
                    const lastIndex = this._getLastIndex(index);
                    ds[index].originLeft = ds[lastIndex].originLeft;
                    ds[index].originTop = ds[lastIndex].originTop;
                }
                for (let index = startIndex; index < endIndex; index++) {
                    if (this._isFixedItem(index)) {
                        continue;
                    }
                    ds[index] = ds[this._getNextIndex(index)];
                }
                ds[endIndex] = bakItem;
            } else {
                // 向前拖动 其间子项向后一位
                for (let index = endIndex; index < startIndex; index++) {
                    if (this._isFixedItem(index)) {
                        continue;
                    }
                    // 每个子项根据后一项的值配置自己的值, 最后面的一项(即起始项)不配置
                    const nextIndex = this._getNextIndex(index);
                    ds[index].originLeft = ds[nextIndex].originLeft;
                    ds[index].originTop = ds[nextIndex].originTop;
                }
                for (let index = startIndex; index > endIndex; index--) {
                    if (this._isFixedItem(index)) {
                        continue;
                    }
                    ds[index] = ds[this._getLastIndex(index)];
                }
                ds[endIndex] = bakItem;
            }
            this.setState({
                dataSource: ds,
            }, () => {
                // TODO: 更新dataSource后发现触摸项存在小小的位置偏移，强制对齐到网格，后续提供更优解
                ds.forEach((item, index) => {
                    this._moveTo(item, {
                        x: parseInt(item.originLeft + 0.5),
                        y: parseInt(item.originTop + 0.5),
                    }, false);
                });
            });
            this.touchCurItem = null;
        }
    }

    _isFixedItem(index) {
        const fixedItems = this.props.fixedItems;
        return fixedItems.length > 0 && fixedItems.includes(index);
    }

    _getNextIndex(curIndex) {
        const fixedItems = this.props.fixedItems;
        let offset = 1; // 偏移值 = 1 + 区间固定项数
        // 跳过固定项
        while(fixedItems.includes(curIndex + offset)) {
            offset++;
        }
        return curIndex + offset;
    }

    _getLastIndex(curIndex) {
        const fixedItems = this.props.fixedItems;
        let offset = 1; // 偏移值 = 1 + 区间固定项数
        // 跳过固定项
        while(fixedItems.includes(curIndex - offset)) {
            offset++;
        }
        return curIndex - offset;
    }

    /**
     * 将data转换为带位置的item。其中，index可以不在当前ds范围内
     * @param {*} data 纯数据，不包含位置信息
     * @param {*} index 子项期望放置的索引
     */
    _data2Item(data, index) {
        const rowNum = this.rowNum;
        const marginLeft = this.marginLeft;
        const itemWidth = this.itemWidth;
        const itemHeight = this.itemHeight;

        // 左位置=(索引%每行个数)*item宽度
        const left = (index % rowNum) * itemWidth + marginLeft;
        // 上位置=(索引/每行个数)*item高度
        const top = parseInt((index / rowNum)) * itemHeight;

        const item = {};
        item.data = data;
        item.defaultKey = index;
        item.originLeft = left;
        item.originTop = top;
        item.position = new Animated.ValueXY({
            x: parseInt(left + 0.5), // +0.5 四舍五入
            y: parseInt(top + 0.5), // +0.5 四舍五入
        });
        item.elevation = new Animated.Value(ELEVATION_LOW);
        return item;
    }

    _reComplexDataSource(props) {
        let pureData;
        if (!!this.state) {
            pureData = [];
            this.state.dataSource.forEach((item, index) => {
                pureData.push(item.data);
            });
        } else {
            pureData = props.dataSource;
        }
        const dsLen = pureData.length;
        // 容器宽度
        const parentWidth = props.parentWidth || Dimensions.get('window').width;
        // 计算每行个数，个数=容器宽度/item宽度
        const rowNum = parseInt(parentWidth / this.itemWidth);
        // 整个网格布局应该居中，计算左间距
        const marginLeft = (parentWidth % this.itemWidth) / 2;
        // 容器高度 = 行数 * 子项高度
        const parentHeight = Math.ceil(dsLen / rowNum) * this.itemHeight; // Math.ceil 进一法

        this.rowNum = rowNum;
        this.marginLeft = marginLeft;

        // 将data转换为带位置值的item
        const dataSource = pureData.map((data, index) => {
            return this._data2Item(data, index);
        });

        if (!!this.state) {
            this.setState({
                dataSource: dataSource,
                parentHeight: parentHeight,
                parentWidth: parentWidth,
            }, () => {
                // TODO: 自测发现state更新后虽然触发了渲染，但存在部分子项消失的问题，这里重复对齐网格，确保子项正常显示
                dataSource.forEach((item, index) => {
                    this._moveTo(item, {
                        x: parseInt(item.originLeft + 0.5),
                        y: parseInt(item.originTop + 0.5),
                    }, false);
                });
            });
        } else {
            this.state = {
                dataSource: dataSource,
                parentHeight: parentHeight,
                parentWidth: parentWidth,
            };
        }
    }

    /**
     * 添加新项
     * 策略是: 1、原targetIndex及其后子项后移一位
     *        2、在targetIndex插入新项
     *        3、更新数据源
     * @param {*} data 新项数据
     * @param {*} targetIndex 期望添加到的索引
     */
    addItem(data, targetIndex) {
        // 如果当前的拖拽项还未做收尾处理 手动调用endSlide收尾
        if (!!this.touchCurItem) {
            this.endSlide(null);
        }
        // 不允许添加新项到固定项上
        if (this._isFixedItem(targetIndex)) {
            return;
        }

        // this.state.dataSource 太长了，缩写一下
        const ds = this.state.dataSource;

        // 动态移动原targetIndex及其后子项，注意跳过固定项
        ds.forEach((item, index) => {
            // 不处理targetIndex之前的子项和固定项
            if (this._isFixedItem(index) || index < targetIndex) {
                return;
            }
            const nextPosition = this._getNextIndex(index);
            if (nextPosition < ds.length) {
                // 除最后一项外，其余子项后移一位
                const toItemReadOnly = ds[nextPosition];
                Animated.timing(
                    item.position,
                    {
                        toValue: {
                            x: parseInt(toItemReadOnly.originLeft + 0.5),
                            y: parseInt(toItemReadOnly.originTop + 0.5)
                        },
                        duration: DURATION_SLIDE,
                        easing: Easing.out(Easing.quad),
                    }
                ).start();
                item.originLeft = toItemReadOnly.originLeft;
                item.originTop = toItemReadOnly.originTop;
            } else {
                // 这里生成的item仅仅是为了最后一项计算目标位置信息
                const itemForPosition = this._index2Position(ds.length);
                Animated.timing(
                    item.position,
                    {
                        toValue: {
                            x: itemForPosition.x,
                            y: itemForPosition.y
                        },
                        duration: DURATION_SLIDE,
                        easing: Easing.out(Easing.quad),
                    }
                ).start();
                item.originLeft = itemForPosition.x;
                item.originTop = itemForPosition.y;
            }
        });

        // 创建的item，默认defaultKey为索引值。为了避免重复，后期添加的item的defaultKey依次递增
        const newItem = this._data2Item(data, targetIndex);
        newItem.defaultKey = ds.length;
        // 插入新项
        for (let index = ds.length; index > targetIndex; index--) {
            if (this._isFixedItem(index)) {
                continue;
            }
            ds[index] = ds[this._getLastIndex(index)];
        }
        ds[targetIndex] = newItem;
        const parentHeight = Math.ceil(ds.length / this.rowNum) * this.itemHeight;
        // 更新数据
        this.setState({
            dataSource: ds,
            parentHeight: parentHeight,
        });
    }

    removeItem(targetIndex) {
        // 如果当前的拖拽项还未做收尾处理 手动调用endSlide收尾
        if (!!this.touchCurItem) {
            this.endSlide(null);
        }
        // 不允许删除固定项
        if (this._isFixedItem(targetIndex)) {
            return;
        }

        // this.state.dataSource 太长了，缩写一下
        const ds = this.state.dataSource;

        // 如果此次删除操作造成了最大索引小于固定项的最大索引，则不允许删除
        if (ds.length - 1 - 1 < this.maxIndexOfFixedItem) {
            return;
        }

        // 动态移动原targetIndex及其后子项，注意跳过固定项
        // 为了避免数据覆盖，这里采取逆序遍历的方式处理
        for (let index = ds.length - 1; index >= 0; index--) {
            const item = ds[index];
            // 不处理固定项、删除项及其前面的子项
            if (this._isFixedItem(index) || index <= targetIndex) {
                continue;
            }
            const lastPosition = this._getLastIndex(index);
            const toItem = ds[lastPosition];
            Animated.timing(
                item.position,
                {
                    toValue: {
                        x: parseInt(toItem.originLeft + 0.5),
                        y: parseInt(toItem.originTop + 0.5)
                    },
                    duration: DURATION_SLIDE,
                    easing: Easing.out(Easing.quad),
                }
            ).start();
            item.originLeft = toItem.originLeft;
            item.originTop = toItem.originTop;
        }
        // 删除项
        for (let index = targetIndex; index < ds.length; index++) {
            if (this._isFixedItem(index)) {
                continue;
            }
            ds[index] = ds[this._getNextIndex(index)];
        }
        ds.splice(ds.length - 1, 1);
        const parentHeight = Math.ceil(ds.length / this.rowNum) * this.itemHeight;
        this.setState({
            dataSource: ds,
            parentHeight: parentHeight,
        });
    }

    /**
     * 获取源数据，即dataSource中的data
     */
    getOriginalData () {
        return this.state.dataSource.map((item, index) => item.data);
    }

    render() {
        return (
            <View
                style={[styles.container, {
                    width: this.state.parentWidth,
                    height: this.state.parentHeight,
                }]}
                onLayout={(e) => {
                    this.topRelativeToScrollView = e.nativeEvent.layout.y;
                    console.log(`the distance between top of DraggableGridView and ScrollView is ${this.topRelativeToScrollView}`);
                }}>
                {this._renderItemView()}
            </View>
        )
    }

    _renderItemView = () => {
        const theme = this.props.theme.draggableGridView;
        const itemBgColor = theme.itemBgColor;
        const rippleColor = this.props.rippleColor || theme.itemRippleColor;
        return this.state.dataSource.map((item, index) => {
            const key = this.props.keyExtractor ? this.props.keyExtractor(item.data, index) : item.defaultKey;
            // 子项状态 传递给外层
            const itemState = {
                elevation: item.elevation
            };
            return (
                <Animated.View
                    key={key}
                    ref={(ref) => this.itemRefs.set(index, ref)}
                    {...this._panResponder.panHandlers}
                    style={[styles.item, {
                        marginTop: this.props.marginChildrenTop,
                        marginBottom: this.props.marginChildrenBottom,
                        marginLeft: this.props.marginChildrenLeft,
                        marginRight: this.props.marginChildrenRight,
                        left: item.position.x,
                        top: item.position.y,
                        // 设置重叠优先级，拖拽项位于最上层
                        zIndex: item.elevation,
                    }]}>
                    <Surface
                        style={{
                            elevation: item.elevation,
                            borderRadius: this.props.theme.roundness,
                            backgroundColor: itemBgColor,
                            // 覆盖Surface的干扰属性
                            borderWidth: 0,
                            padding: 0,
                        }}
                    >
                        <TouchableRipple
                            disabled={false}
                            onPress={() => {
                                if (!!this.props.onClickItem) {
                                    this.props.onClickItem(this.getOriginalData(), item.data, index);
                                }
                            }}
                            onLongPress={() => {
                                this.hasCalledOnSlide = false;
                                if (!!this.props.onLongPress) {
                                    this.props.onLongPress(this.getOriginalData(), item.data, index);
                                }
                                this.startSlide(index);
                            }}
                            onPressOut={() => {
                                // 如果存在拖拽项（执行过startSlide） 且 未做过移动 => 手动收尾
                                // 做过移动的，收尾处理由手势监听器触发
                                if (!!this.touchCurItem && !this.hasCalledOnSlide) {
                                    // onPressOut会在onSlide之前调用，所以需要定时任务辅助判断是否需要手动收尾
                                    // 按照预期 如果上次拖拽未作移动 那么新的拖拽事件触发之前 应该至少调用一次定时器
                                    // 因为我们设置的定时器执行周期小于长按响应时间 而在定时器中我们会执行其回收操作
                                    // 所以正常情况不应该进入下面这个分支
                                    if (!!this._timerForEndSlide) {
                                        console.warn('Interval for EndSlide has not been cleared.');
                                        this._clearIntervalForEndSlide();
                                    }
                                    this._timerForEndSlide = setInterval(() => {
                                        // 当已经调用了onLongPress(这是废话)和onPressOut(说明已经在拖动或者手指移开屏幕)
                                        // 但是拖动标志位还是false时(说明不在拖动中，是手指移开了屏幕) 执行结束拖拽方法
                                        if (!this.hasCalledOnSlide) {
                                            this.endSlide(null);
                                        }
                                    }, INTERVAL_ENDSLIDE);
                                }
                            }}
                            rippleColor={rippleColor}
                            style={{
                                width: '100%',
                                borderRadius: this.props.theme.roundness,
                            }}
                        >
                            <View>
                                {this.props.renderItem(item.data, index, itemState)}
                            </View>
                        </TouchableRipple>
                    </Surface>
                </Animated.View>
            )
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    item: {
        position: 'absolute',
    },
});

export default withTheme(DraggableGridView);
