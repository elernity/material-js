import * as React from 'react';
import deepmerge from 'deepmerge';
import hoistNonReactStatics from 'hoist-non-react-statics';

/**
 * React组件基类携带的方法
 * 这些方法将被过滤 不会复制到样式化的组件上
 */
import {
    REACT_METHODS
} from './constant';

/**
 * 判断是否是React组件
 */
const isClassComponent = (Component) =>
    Boolean(Component.prototype && Component.prototype.isReactComponent);

/**
 * 将对外提供的组件中的自定义公共方法提取出来 方便外界调用
 * 只对React组件有效
 */
function copyRefs(TargetComponent, SourceComponent) {
    if (!SourceComponent.prototype) {
        return TargetComponent;
    }

    Object.getOwnPropertyNames(SourceComponent.prototype)
        .filter(prop =>
            !(
                REACT_METHODS.includes(prop) || // React specific methods and properties
                prop in React.Component.prototype || // Properties from React's prototype such as `setState`
                prop in TargetComponent.prototype || // Properties from enhanced component's prototype
                prop.startsWith('_') // Private methods
            )
        )
        .forEach(prop => {
            if (typeof SourceComponent.prototype[prop] === 'function') {
                TargetComponent.prototype[prop] = function(...args) {
                    // Make sure the function is called with correct context
                    return SourceComponent.prototype[prop].apply(
                        this.getWrappedInstance(),
                        args
                    );
                };
            } else {
                // Copy properties as getters and setters
                // This make sure dynamic properties always stay up-to-date
                Object.defineProperty(TargetComponent.prototype, prop, {
                    get() {
                        return this.getWrappedInstance()[prop];
                    },
                    set(value) {
                        this.getWrappedInstance()[prop] = value;
                    },
                });
            }
        });
    return TargetComponent;
}

export default function createWithTheme(ThemeProvider, ThemeContext) {
    return function withTheme(Comp) {
        class ThemedComponent extends React.Component {
            previous = {};
            _root = null;

            merge = (a, b) => {
                const p = this.previous;
                if (p && p.a === a && p.b === b) {
                    return p.result;
                }
                const result = a && b ? deepmerge(a, b) : a || b;
                this.previous = {a, b, result};
                return result;
            }

            render() {
                return (
                    <ThemeContext.Consumer>
                        {theme => {
                            // theme: 最近的Provider值/创建Context传入的值
                            // this.props.theme: 配置在标签上的项, 如<Surface theme={{dark: true}}>
                            const merged = this.merge(theme, this.props.theme);
                            let element;
                            if (isClassComponent(Comp)) {
                                // Only add refs for class components as function components don't support them
                                // It's needed to support use cases which need access to the underlying node
                                element = (
                                    <Comp
                                        {...this.props}
                                        ref={c => {this._root = c;}}
                                        theme={merged}
                                    />
                                );
                            } else {
                                element = <Comp {...this.props} theme={merged} />;
                            }

                            if (merged !== this.props.theme) {
                                // If a theme prop was passed, expose it to the children
                                return <ThemeProvider theme={merged}>{element}</ThemeProvider>;
                            }
                            return element;
                        }}
                    </ThemeContext.Consumer>
                )
            }
        }

        if (isClassComponent(Comp)) {
            // getWrappedInstance is exposed by some HOCs like react-redux's connect
            // Use it to get the ref to the underlying element
            // Also expose it to access the underlying element after wrapping
            ThemedComponent.prototype.getWrappedInstance = function getWrappedInstance() {
                return this._root && this._root.getWrappedInstance
                    ? this._root.getWrappedInstance()
                    : this._root;
            };
            ThemedComponent = copyRefs(ThemedComponent, Comp);
        }
        hoistNonReactStatics(ThemedComponent, Comp);
        return ThemedComponent;
    }
}
