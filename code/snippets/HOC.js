/**
 * 地址：https://juejin.im/post/5bd177e3e51d457ab36d00a7
 * es7的Decorator模式
 * react的高阶组件
 * 传入一个组件作为参数并返回一个增强的组件
 * @param description 
 */

export default function (description) {
    return function (WrappedComponent) {
        return class HOC extends Component{
            render() {
                return <div>
                    <div className="geek-description">
                        {description?description:' '}
                    </div>
                    <WrappedComponent{...this.props}/>
                </div>
            }
        }
    }
}

// @withDescription('aaa')
// export default class Geek extends Component{
//     render() {
//         return (
//             //...
//         );
//     }
// }
