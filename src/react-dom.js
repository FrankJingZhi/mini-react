import { REACT_ELEMENT, REACT_FORWARD_REF } from "./utils";
import {addEvent} from './event.js'

function render(VNode, containerDOM) {
    // 将虚拟DOM转换成真实DOM
    // 将虚拟DOM挂在到容器上
    mount(VNode, containerDOM)
}

function mount(VNode, containerDOM) {
    // 将虚拟DOM转换成真实DOM
    let newDOM = createDOM(VNode)
    // 将虚拟DOM挂在到容器上
    newDOM && containerDOM.appendChild(newDOM)
}

function mountArray(VNodes, containerDOM) {
    if(!Array.isArray(VNodes)) return 
    VNodes.forEach(vnode => {
        if(typeof vnode === 'string'){
            containerDOM.appendChild(document.createTextNode(vnode))
        }else {
            mount(vnode, containerDOM)
        }
    })
}

// 处理属性
function setPropsFromDOM(dom, VNodeProps = {}) {
    if(!VNodeProps) return
    for(let key in VNodeProps){
        if(key === 'children') continue
        if(key === 'style'){
            for(let styleKey in VNodeProps.style){
                dom.style[styleKey] = VNodeProps.style[styleKey]
            }
        }else if(/^on[A-Z].*/.test(key)){
            addEvent(dom, key.toLowerCase(), VNodeProps[key])            
        }else {
            dom[key] = VNodeProps[key]
        }
    }
}

// 处理函数式组件，将参数传入，执行该组件，最终返回虚拟dom
function getFunctionalDOM(VNode){
    const {type, props} = VNode
    const renderVNode = type(props)
    if(!renderVNode) return null
    return createDOM(renderVNode)
}

// 处理类组件
function getClassDOM(VNode){
    const {type, props, ref} = VNode
    const instance = new type(props)
    const renderVNode = instance.render()
    // 将虚拟dom保存到类组件实例上，方便后续更新
    instance.oldVNode = renderVNode
    // 将ref和dom绑定
    ref && (ref.current = instance)
    // TODO: 需要删除的代码 start
    setTimeout(()=>{
        instance.setState({name: 'mini-react1'})
    },3000)
    setTimeout(()=>{
        instance.setState({name: 'mini-react2'})
    },6000)
    // TODO: 需要删除的代码 end
    if(!renderVNode) return null
    return createDOM(renderVNode)
}

// 根据虚拟dom找到dom
export function findDOMByVNode(VNode) {
    if(!VNode) return 
    if(VNode.dom) return VNode.dom
}

// 更新dom树
export function updateDOMTree(oldDOM, newVNode) {
    // 找到当前dom的父节点
    const parentNode = oldDOM && oldDOM.parentNode
    // 移除掉旧的dom
    parentNode.removeChild(oldDOM)
    // 挂载新的dom
    parentNode.appendChild(createDOM(newVNode))
}

// 生成forwardRef的dom
function getForwardRefDOM(VNode){
    const {type, props, ref} = VNode
    const renderVNode = type.render(props, ref)
    if(!renderVNode) return null
    return createDOM(renderVNode)
}

function createDOM(VNode) {
    if(!VNode) return
    const {type, props, ref} = VNode;
    let dom;

    // 处理forwardRef
    if(type && type.$$typeof === REACT_FORWARD_REF){
        return getForwardRefDOM(VNode)
    }

    // 处理类组件
    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT){
        return getClassDOM(VNode)
    }
    // 处理函数式组件
    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT){
        return getFunctionalDOM(VNode)
    }
    // 创建元素
    if(type && VNode.$$typeof === REACT_ELEMENT){
        dom = document.createElement(type)
    }
    // 处理子元素
    if(props){
        if(typeof props.children === 'object' && props.children.type){
            mount(props.children, dom)
        }else if(Array.isArray(props.children)){
            mountArray(props.children, dom)
        }else if(typeof props.children === 'string'){
            dom.appendChild(document.createTextNode(props.children))
        }
    }
    // 处理属性值
    setPropsFromDOM(dom, props)
    // 将虚拟dom和dom绑定
    VNode.dom = dom
    // 将dom和ref绑定
    ref && (ref.current = dom)
    return dom
}

const ReactDOM = {
    render
}
export default ReactDOM;