import { REACT_ELEMENT, REACT_FORWARD_REF,REACT_TEXT,CREATE,MOVE } from "./utils";
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
    VNodes.forEach((vnode,index) => {
        if(Array.isArray(vnode)){
            mountArray(vnode, containerDOM)
            return
        }
        vnode.index = index // dom diff 有用
        mount(vnode, containerDOM)
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
    // setTimeout(()=>{
    //     instance.setState({name: 'mini-react1'})
    // },3000)
    // setTimeout(()=>{
    //     instance.setState({name: 'mini-react2'})
    // },6000)
    // TODO: 需要删除的代码 end
    if(!renderVNode) return null
    const dom = createDOM(renderVNode)
    // 调用componentDidMount
    if(typeof instance.componentDidMount === 'function'){
        instance.componentDidMount()
    }
    return dom
}

// 根据虚拟dom找到dom
export function findDOMByVNode(VNode) {
    if(!VNode) return 
    if(VNode.dom) return VNode.dom
}

// 更新dom树
export function updateDOMTree(oldVNode, newVNode, oldDOM) {
    // 找到当前dom的父节点
    const parentNode = oldDOM && oldDOM.parentNode
    const typeMap = {
        noTyperate: !oldVNode && !newVNode,// 不做操作 - 新节点、旧节点都不存在
        add: !oldVNode && newVNode,// 添加 - 新节点存在，旧节点不存在
        delete: oldVNode && !newVNode,// 删除 - 旧节点存在，新节点不存在
        update: oldVNode && newVNode && oldVNode.type !== newVNode.type, // 更新 - 旧节点和新节点都存在，但是类型不一样
        // 其他情况 - 旧节点和新节点都存在，类型一样 --> 值得我们进行深入探究，dom diff算法
    }
    // 过滤出当前
    const updateType = Object.keys(typeMap).filter(key => typeMap[key])[0]
    switch(updateType){
        case 'noTyperate':
            break;
        case 'add':
            // 将新节点挂载到父节点上
            parentNode.appendChild(createDOM(newVNode))
            break;
        case 'delete':
            // 删除当前dom
            removeVNode(oldVNode)
            break;
        case 'update':
            // 删除当前dom
            removeVNode(oldVNode)
            // 将新节点挂载到父节点上
            parentNode.appendChild(createDOM(newVNode))
            break;
        default:
            // 其他情况 - 旧节点和新节点都存在，类型一样 --> 值得我们进行深入探究，dom diff算法
            deepDOMDiff(oldVNode, newVNode)
            break;
    }

}

// 删除虚拟dom
function removeVNode(VNode){
    const currentDOM = findDOMByVNode(VNode)
    currentDOM && currentDOM.remove()
    if(VNode.classInstance && typeof VNode.componentWillUnmount === 'function'){
        VNode.componentWillUnmount()
    }
}

// 旧节点和新节点都存在，类型一样 --> 值得我们进行深入探究，dom diff算法
function deepDOMDiff(oldVNode, newVNode){
    const diffTypeMap = {
        originNode: typeof oldVNode.type === 'string', // 原生节点
        classComponent: typeof oldVNode.type === 'function' && oldVNode.type.IS_CLASS_COMPONENT, // 类组件
        functionComponent: typeof oldVNode.type === 'function', // 函数组件
        text: oldVNode.type === REACT_TEXT // 文本节点
    }
    const diffType = Object.keys(diffTypeMap).filter(key => diffTypeMap[key])[0]
    switch(diffType){
        case 'originNode':
            // 无论是类组件还是函数组件，最终都会走到这里，因为类、函数组件本质都是原生节点
            // 1. 当前节点类型没有变化，直接复用旧节点，更新属性
            const currentDOM = newVNode.dom = findDOMByVNode(oldVNode)
            setPropsFromDOM(currentDOM, newVNode.props)
            // 2. 比对处理子节点
            updateChildren(currentDOM, oldVNode.props.children, newVNode.props.children)
            break;
        case 'classComponent': 
            updateClassComponent(oldVNode, newVNode)
            break;
        case 'functionComponent':
            updateFunctionComponent(oldVNode, newVNode)
            break;
        case 'text':
            // 文本节点没有变化，直接复用
            newVNode.dom = findDOMByVNode(oldVNode)
            newVNode.dom.textContent = newVNode.props.text
            break;
        default:
            break;
    }
}

function updateClassComponent(oldVNode, newVNode){
    // 找到类组件实例，执行更新。实现递归更新
    const classInstance = newVNode.classInstance = oldVNode.classInstance
    classInstance.updater.launchUpdate(newVNode.props)
}
            
function updateFunctionComponent(oldVNode, newVNode){
    const oldDOM = findDOMByVNode(oldVNode)
    const {type, props} = newVNode
    const newRenderVNode = type(props)
    updateDOMTree(oldVNode.oldRenderVNode, newRenderVNode, oldDOM)
    newVNode.oldRenderVNode = newRenderVNode
}

// 比对子节点 - dom diff算法核心
function updateChildren(currentDOM, oldChildren, newChildren){
    const oldVNodeChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren]
    const newVNodeChildren = Array.isArray(newChildren) ? newChildren : [newChildren]
    let lastNotChangeIndex = -1 // 当前 已遍历过的节点在旧节点中的index 中，最大的index
    // 存储旧节点的key-vnode对应关系，后面对比用
    const oldVNodeChildrenMap = {}
    oldVNodeChildren.forEach((vnode, index)=>{
        const key = vnode.key ? vnode.key : index
        oldVNodeChildrenMap[key] = vnode
    })
    // 遍历新虚拟dom，找到
    // 1. 可以复用但是需要移动的节点
    // 2. 需要重新创建的节点
    // 3. 需要删除的节点
    // 4. 剩下就是可以直接使用的节点
    const actions = [] // 存储动作（需要做处理的节点：创建、删除、移动）
    newVNodeChildren.forEach((newVNode, index)=>{
        newVNode.index = index
        const newKey = newVNode.key ? newVNode.key : index
        const oldVNode = oldVNodeChildrenMap[newKey]
        // 看当前新节点是否在旧节点中已存在
        if(oldVNode){
            // 存在，继续深度比对
            deepDOMDiff(oldVNode, newVNode)
            // 找到需要移动的节点，原理：如果当前新节点在旧节点中的index小于lastNotChangeIndex，那么就需要移动
            // 这里的index是在mountArray函数中记录的
            if(oldVNode.index < lastNotChangeIndex){
                actions.push({
                    type: MOVE,
                    oldVNode,
                    newVNode,
                    index
                })
            }
            delete oldVNodeChildrenMap[newKey]
            lastNotChangeIndex = Math.max(lastNotChangeIndex, oldVNode.index)
        }else {
            // 不存在，需要重新创建
            actions.push({
                type: CREATE,
                newVNode,
                oldVNode,
                index
            })
        }
    })

    // 找到需要删除的节点
    // 需要移动的节点，需要删除
    const VNodeToMove = actions.filter(action=>action.type === MOVE).map(action=>action.oldVNode)
    // 需要删除的节点（没有用到的节点），需要删除
    const VNodeToDelete = Object.values(oldVNodeChildrenMap)
    VNodeToMove.concat(VNodeToDelete).forEach(vnode=>{
        const currentDOM = findDOMByVNode(vnode)
        currentDOM && currentDOM.remove()
    })

    // 对记录的actions操作进行处理
    actions.forEach(action=>{
        const {type, oldVNode, newVNode, index} = action
        const childNodes = currentDOM.childNodes
        const currentChildNode = childNodes[index]
        function insertBeforeChild(){
            if(type === CREATE){
                return createDOM(newVNode)
            }
            if(type === MOVE){
                return findDOMByVNode(oldVNode)
            }
        }
        // 如果要插入dom的位置上已经有dom了，那么就需要插入到这个dom的前面
        if(currentChildNode){
            currentDOM.insertBefore(insertBeforeChild(), currentChildNode)
        }else{
            // 没有dom，直接插入
            currentDOM.appendChild(insertBeforeChild())
        }
    })
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
    if(type === REACT_TEXT){
        dom = document.createTextNode(props.text)
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