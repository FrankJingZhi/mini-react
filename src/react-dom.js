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

function createDOM(VNode) {
    // 创建元素
    // 处理子元素
    // 处理属性值
    const {type, props} = VNode;
    let dom;
    if(type && VNode.$$typeof === REACT_ELEMENT){
        dom = document.createElement(type)
    }
    if(props){
        if(typeof props.children === 'object' && props.children.type){
            mount(props.children, dom)
        }else if(Array.isArray(props.children)){
            mountArray(props.children, dom)
        }else if(typeof props.children === 'string'){
            dom.appendChild(document.createTextNode(props.children))
        }
    }
    return dom
}

const ReactDOM = {
    render
}
export default ReactDOM;