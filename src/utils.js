export const REACT_ELEMENT = Symbol('react.element')
export const REACT_FORWARD_REF = Symbol('react.forward_ref')
export const CREATE = Symbol('react.dom.diff.create')
export const MOVE = Symbol('react.dom.diff.move')
export const REACT_TEXT = Symbol('react.text')
export const toVNode = (node) => {
    return typeof node === 'string' || typeof node ==='number' ? {
        type: REACT_TEXT,
        props: {
            text: node
        }
    }: node
}
export function shallowEqual(obj1, obj2){
    if(obj1 === obj2) return true
    if(typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if(keys1.length !== keys.length) return false
    for(const key in obj1){
        if(obj1[key] !== obj2[key]) return false
    }
    return true
}