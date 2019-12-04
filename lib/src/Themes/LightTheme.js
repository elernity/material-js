import {
    black,
    white,
    blue500,
    teal500,
    grey50,
    red900,
} from '../Library/resource/colors';
import {
    alpha,
    darken,
} from '../Library/util';
import fonts from '../Library/resource/fonts';

function generateTheme() {
    const common = {
        roundness: 4,
        colors: {
            primary: blue500,
            accent: teal500,
            background: grey50,
            text: black,
            innerText: white,
            placeholder: alpha(black, 0.54),
            error: red900,
            disabledText: alpha(black, 0.32),
            disabledComponent: alpha(black, 0.26),
            disabledBackground: alpha(black, 0.12),
        }
    };
    return {
        ...common,
        // 普通文本
        textPlain: {
            fontSize: 14,
            color: common.colors.text,
            fontFamily: fonts.regular,
        },
        // 图片标题
        textCaption: {
            fontSize: 12,
            color: alpha(common.colors.text, 0.54),
            fontFamily: fonts.regular,
        },
        // 新闻标题
        textHeadline: {
            fontSize: 24,
            color: alpha(common.colors.text, 0.87),
            fontFamily: fonts.regular,
        },
        // 段落
        textParagraph: {
            fontSize: 14,
            color: alpha(common.colors.text, 0.87),
            fontFamily: fonts.regular,
        },
        // 副标题
        textSubheading: {
            fontSize: 16,
            color: alpha(common.colors.text, 0.87),
            fontFamily: fonts.regular,
        },
        // 标题
        textTitle: {
            fontSize: 20,
            color: alpha(common.colors.text, 0.87),
            fontFamily: fonts.medium
        },
        // 普通按钮
        button: {
            containerBgColor: common.colors.accent,
            titleColor: common.colors.innerText,
            titleSize: 14,
            titleFontFamily: fonts.medium,
        },
        // 图标按钮
        iconButton: {
            color: common.colors.accent,
        },
        // 悬浮按钮
        fab: {
            foregroundColor: common.colors.innerText,
            backgroundColor: common.colors.accent,
            titleFontFamily: fonts.medium,
        },
        // 输入框
        textInputFlat: {
            bgColor: darken(common.colors.background, 0.06),
            textColor: common.colors.text,
            placeholderColor: common.colors.placeholder,
            componentColor: common.colors.accent,
            textFontFamily: fonts.regular,
        },
        // 复选框
        checkbox: {
            activeColor: common.colors.accent,
            inactiveColor: alpha(black, 0.54),
        },
        // 列表
        list: {
            subheadingSize: 16,
            subheadingColor: alpha(common.colors.text, 0.54),
            subheadingFontFamily: fonts.medium,
            accordionExpandedColor: common.colors.accent,
            accordionTitleFontSize: 16,
            accordionTitleColor: alpha(common.colors.text, 0.87),
            accordionTitleFontFamily: fonts.regular,
            accordionDescriptionFontSize: 14,
            accordionDescriptionColor: alpha(common.colors.text, 0.54),
            accordionDescriptionFontFamily: fonts.regular,
            itemTitleFontSize: 16,
            itemTitleColor: alpha(common.colors.text, 0.87),
            itemTitleFontFamily: fonts.regular,
            itemDescriptionFontSize: 14,
            itemDescriptionColor: alpha(common.colors.text, 0.54),
            itemDescriptionFontFamily: fonts.regular,
        },
        // 导航栏
        appbar: {
            bgColor: common.colors.primary,
            titleColor: common.colors.innerText,
            titleFontFamily: fonts.medium,
            subtitleFontFamily: fonts.regular,
            actionItemColor: common.colors.innerText,
            fabColor: common.colors.innerText,
            fabBgColor: common.colors.accent,
        },
        // 弹出式菜单
        popupWindow: {
            bgColor: white,
            textFontSize: 14,
            textColor: common.colors.text,
            textFontFamily: fonts.regular,
        },
        // 可拖拽网格
        draggableGridView: {
            itemBgColor: white,
            itemRippleColor: alpha(black, 0.32),
        },
        fonts,
    };
}

export default generateTheme();
