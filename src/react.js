import {REACT_ELEMENT} from './utils'
import {Component} from './Component'

function createElement(type, properties, children){
    let key = properties.key || null;
    let ref = properties.ref || null;
    ['__self', '__source', 'key', 'ref'].forEach(key => delete properties[key])
    let props = {...properties}
    if(arguments.length > 3){
        props.children = Array.prototype.slice.call(arguments, 2)
    }else{
        props.children = [children]
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

const React = {
    createElement,
    Component,
    createRef
}

export default React;