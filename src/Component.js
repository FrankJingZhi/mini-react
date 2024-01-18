import { findDOMByVNode, updateDOMTree } from "./react-dom";

// 批量更新队列 - 管理Updater
export let UpdaterQueue = {
    isBatch: false,
    updaters: new Set()
}
// 执行更新队列
export function flushUpdaterQueue(){
    // 遍历更新队列，执行更新
    UpdaterQueue.updaters.forEach((updater)=>{
        updater.launchUpdate()
    })
    // 清空队列
    UpdaterQueue.updaters.clear()
    // 关闭批量更新
    UpdaterQueue.isBatch = false
}
// 管理状态
class Updater{
    constructor(classComponentInstance){
        // 需要更新的组件实例
        this.classComponentInstance = classComponentInstance;
        // 存储需要更新的状态
        this.pendingStates = [];
    }
    addState(partialState){
        // 将需要更新的状态存储起来
        this.pendingStates.push(partialState)
        // 预处理更新
        this.preHandleForUpdate()
    }
    preHandleForUpdate(){
        if(UpdaterQueue.isBatch){
            // 批量更新
            UpdaterQueue.updaters.add(this)
        }else{
            // 单个更新
            this.launchUpdate()
        }
    }
    launchUpdate(nextProps){
        const {classComponentInstance, pendingStates} = this
        // 判断是否需要更新
        let isShouldUpdate = true
        // 如果没有需要更新的状态 && 没有新的props，则直接返回
        if(pendingStates.length === 0 && !nextProps) return 
        // 合并状态数据
        const nextState = pendingStates.reduce((preStates, newState)=>{
            return {...preStates, ...newState}
        }, classComponentInstance.state)
        classComponentInstance.state = nextState
        if(nextProps) classComponentInstance.props = nextProps
        // 清空状态
        this.pendingStates.length = 0
        if(classComponentInstance.shouldComponentUpdate && 
            !classComponentInstance.shouldComponentUpdate(classComponentInstance.props, classComponentInstance.state)
        ) {
            isShouldUpdate = false
        }
        // 更新组件
        if(isShouldUpdate) classComponentInstance.update()
    }
}

// 类组件
export class Component {
    // 注明这是一个类组件，区别于函数组件
    static IS_CLASS_COMPONENT = true;
    constructor(props){
        this.props = props
        this.updater = new Updater(this)
        this.state = {}
    }
    setState(partialState){
        // 合并数据
        // 重新渲染进行更新
        this.updater.addState(partialState)
    }
    update(){
        // 获取旧的虚拟dom和新的虚拟dom
        // 将旧的dom删除
        // 将新的dom挂载到容器上
        let oldVNode = this.oldVNode; // 让类组件拥有一个oldVNode属性保存类组件实例对应的虚拟dom
        let oldDOM = findDOMByVNode(oldVNode); // 让真实dom保存到oldVNode上
        let newVNode = this.render() 
        updateDOMTree(oldVNode, newVNode, oldDOM)
        this.oldVNode = newVNode
        // 执行componentDidUpdate
        if(this.componentDidUpdate) this.componentDidUpdate(this.props, this.state)
    }
}

