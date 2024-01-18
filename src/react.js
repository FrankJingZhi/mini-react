import {REACT_ELEMENT,REACT_FORWARD_REF, toVNode, shallowEqual} from './utils'
import {Component} from './Component'

function createElement(type, properties, children){
    let key = properties.key || null;
    let ref = properties.ref || null;
    ['__self', '__source', 'key', 'ref'].forEach(key => delete properties[key])
    let props = {...properties}
    if(arguments.length > 3){
        props.children = Array.prototype.slice.call(arguments, 2).map(toVNode)
    }else{
        props.children = toVNode(children)
    }
    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
        key,
        ref
    }
}

// 创建ref
function createRef(){
    // 初始化
    return {
        current: null
    }
}

function forwardRef(render){
    debugger
    return {
        $$typeof: REACT_FORWARD_REF,
        render
    }
}

export class PureComponent extends Component{
    shouldComponentUpdate(nextProps, nextState){
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
    }
}

const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    PureComponent
}

export default React;