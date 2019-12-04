import color from 'color';


//============================================色彩处理========================================

// 是否亮色
export function isLightColor(rgb) {
    // color.isLight()
    const R = (rgb >> 16) & 0xFF;
    const G = (rgb >> 8) & 0xFF;
    const B = rgb & 0xFF;
    const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
    return luminance < 0.5;
}

// 添加透明度
export function alpha(rgb, alpha) {
    return color(rgb)
        .alpha(alpha)
        .rgb()
        .string();
}

// 褪色
// eg. fade=0.5: rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
export function fade(rgb, fade) {
    return color(rgb)
        .fade(fade)
        .rgb()
        .string();
}

// 变暗
// eg. darken=0.5: rgb(107, 192, 64) -> rgb(54, 96, 32)
export function darken(rgb, darken) {
    return color(rgb)
        .darken(darken)
        .rgb()
        .string();
}

//============================================图标处理========================================

// 私有方法 图片资源是否为一个带uri的对象
function _isImageWithUri(source) {
    return typeof source === 'object'
        && source !== null
        && Object.prototype.hasOwnProperty.call(source, 'uri')
        && typeof source.uri === 'string';
}

// 私有方法 图片资源是否为一个模块 eg. require('image')
function _isImageModule(source) {
    return typeof source === 'number';
}

// 获取图标id
// 对于带uri的图片资源 返回uri
// 对于图片模块       返回模块id
// 对于图标          返回图标名
function _getIconId(source) {
    if (_isImageWithUri(source)) {
        return source.uri;
    }
    return source;
};

// 是否图片资源
export function isImageSource(source) {
    return _isImageWithUri(source)
        || _isImageModule(source);
}

// 是否图标资源
// 图标包括图片和Material图标 因此额外支持字符串形式
// source为null或undefined时返回false
export function isValidIcon(source) {
    return typeof source === 'string'
        || isImageSource(source);
}

// 图标是否相等
export function isEqualIcon(a, b) {
    return a === b
        || _getIconId(a) === _getIconId(b);    
}
