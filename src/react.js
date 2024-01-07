import {REACT_ELEMENT} from './utils'
function createElement(type, properties, children){
    ['__self', '__source', 'key', 'ref'].forEach(key => delete properties[key])
    let props = {...properties}
    if(arguments.length > 3){
        props.children = Array.prototype.slice.call(arguments, 2)
    }else{
        props.children = children
    }
    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
    }
}

const React = {
    createElement
}

export default React;