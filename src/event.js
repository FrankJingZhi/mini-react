import {UpdaterQueue,flushUpdaterQueue} from './Component'

// 添加事件
export function addEvent(dom, eventName, bindFunction) {
    // 将事件类型和回调函数绑定
    dom.attach = dom.attach || {}
    dom.attach[eventName] = bindFunction
    // 事件委托机制的核心点一：将事件委托给document
    if(document[eventName]) return
    document[eventName] = dispatchEvent
}

// nativeEvent：原始的事件对象
function dispatchEvent(nativeEvent){
    // 开启setState队列批量更新开关
    UpdaterQueue.isBatch = true
    // 事件委托机制的核心点二：屏蔽浏览器之间的差异
    let syntheticEvent = createsyntheticEvent(nativeEvent)    
    let target = nativeEvent.target
    // 从最内层的子元素一层层往上遍历，如果当前遍历的元素中包含attach对象，说明该元素有事件绑定，执行它
    while(target){
        // 这是什么意思？因为最终执行bindFunction时需要用到
        syntheticEvent.currentTarget = target
        // 找到绑定的事件，执行它
        const eventName = `on${nativeEvent.type}`
        const bindFunction = target.attach && target.attach[eventName]
        bindFunction && bindFunction(syntheticEvent)
        // 如果当前元素阻止了冒泡，就跳出循环
        if(syntheticEvent.isProPagationStopped){
            break
        }
        target = target.parentNode
    }
    // 执行setState队列批量更新
    flushUpdaterQueue()
}

function createsyntheticEvent(nativeEvent){
    let nativeEventKeyValues = {}
    // 这里目前看来用for...in和Object.keys结果是一样的
    for(const key in nativeEvent){
        nativeEventKeyValues[key] = typeof nativeEvent[key] === 'function' 
        ? nativeEvent[key].bind(nativeEvent)
        : nativeEvent[key]
    }
    // let nativeEventKeyValues2 = {}
    // Object.keys(nativeEventKeyValues).forEach(key => {
    //     nativeEventKeyValues2[key] = nativeEventKeyValues[key]
    // })
    // console.log('nativeEventKeyValues',nativeEventKeyValues, nativeEventKeyValues2)
    const syntheticEvent = Object.assign(nativeEventKeyValues, {
        nativeEvent,
        isDefaultPrevented: false,
        isPropPagationStopped: false,
        preventDefault(){
            this.isDefaultPrevented = true
            if(this.nativeEvent.preventDefault){
                this.nativeEvent.isPreventDefault()
            }else{
                this.nativeEvent.returnValue = false
            }
        },
        stopPropagation(){
            this.isPropPagationStopped = true
            if(this.nativeEvent.stopPropagation){
                this.nativeEvent.stopPropagation()
            }else{
                this.nativeEvent.cancelBubble = true
            }
        }
    })
    return syntheticEvent
}