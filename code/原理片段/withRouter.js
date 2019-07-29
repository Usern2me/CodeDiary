import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import Route from "./Route";

/**
 * A public higher-order component to access the imperative API
 * 使用场景：
 *    1.在使用redux的connnet函数之后，由于此函数是个高阶函数，增加了
 *    shouldComponentUpdate相关的判断，导致只有在props更新的时候才
 *    会进行组件的更新，因此有些时候会发现组件没有更新的问题。
 *      |import { withRouter } from 'react-router-dom'
 *      |export default withRouter(connect(mapStateToProps)(Something))
 *    2.使用history时使用函数式跳转，需要加withRouter.
 *      |this.props.history.push("/some/Path");
 *      |export default withRouter(MyComponent);
 * match，location，history
 */
const withRouter = Component => {
    const C = props => {
        const {
            wrappedComponentRef,
            ...remainingProps
        } = props;
        return ( <
            Route children = {
                routeComponentProps => ( <
                    Component { ...remainingProps
                    } { ...routeComponentProps
                    }
                    ref = {
                        wrappedComponentRef
                    }
                    />
                )
            }
            />
        );
    };

    C.displayName = `withRouter(${Component.displayName || Component.name})`;
    C.WrappedComponent = Component;
    C.propTypes = {
        wrappedComponentRef: PropTypes.func
    };

    return hoistStatics(C, Component);
};

export default withRouter;
