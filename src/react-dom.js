import { REACT_ELEMENT } from "./utils";

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
            // TODO: 事件绑定 
        }else {
            dom[key] = VNodeProps[key]
        }
    }
}

function createDOM(VNode) {
    const {type, props} = VNode;
    let dom;
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
    return dom
}

const ReactDOM = {
    render
}
export default ReactDOM;