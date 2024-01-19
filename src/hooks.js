import {emitUpdateForHooks} from './react-dom'

let states = []; // 用来存储hooks的变量
let hookIndex = 0; // 用来标记hooks变量的位置

export function resetHookIndex(){
    hookIndex = 0
}

export function useState(initialState){
    // 初始化赋值
    states[hookIndex] = states[hookIndex] || initialState
    // 记录当前hook的位置
    const currentIndex = hookIndex
    // 创建一个setState函数，更新state
    function setState(newState){
        // 这里用到了闭包，缓存了hook的位置
        states[currentIndex] = newState
        emitUpdateForHooks()
    }
    return [states[hookIndex++], setState]
}

export function useReducer(reducer, initialState){
    states[hookIndex] = states[hookIndex] || initialState
    const currentIndex = hookIndex
    function dispatch(action){
        // 跟useState唯一的不同就是这里
        states[currentIndex] = reducer(states[currentIndex], action)
        emitUpdateForHooks()
    }
    return [states[hookIndex++], dispatch]
}

export function useEffect(effectFunction, deps = []){
    const currentIndex = hookIndex
    const [destroyFunction, preDeps] = states[currentIndex] || [null, null]
    // 浅比较当前的依赖和上一次的依赖，如果有变化就更新并执行上一次的销毁函数
    if(!states[currentIndex] || deps.some((dep, index) => dep !== preDeps[index])){
        // 宏任务
        setTimeout(()=>{
            destroyFunction?.()
            states[currentIndex] = [effectFunction(), deps]
        })
    }
    hookIndex++
}
export function useLayoutEffect(effectFunction, deps = []){
    const currentIndex = hookIndex
    const [destroyFunction, preDeps] = states[currentIndex] || [null, null]
    // 浅比较当前的依赖和上一次的依赖，如果有变化就更新并执行上一次的销毁函数
    if(!states[currentIndex] || deps.some((dep, index) => dep !== preDeps[index])){
        // 微任务
        queueMicrotask(()=>{
            destroyFunction?.()
            states[currentIndex] = [effectFunction(), deps]
        })
    }
    hookIndex++
}

export function useRef(initialState){
    // 因为这里只是初始化时调用了一次，没有后续的回调，所以没有用到闭包 
    states[hookIndex] = states[hookIndex] || {current: initialState}
    return states[hookIndex++]
}

export function useImperativeHandle(ref, dataFactory){
    // 给ref.current赋值，目的是只允许父组件调用子组件抛出去的方法
    ref.current = dataFactory()
}

export function useMemo(dataFactory, deps){
    let [preData, preDeps] = states[hookIndex] || [null, null]
    if(!states[hookIndex] || deps.some((dep, index) => dep !== preDeps[index])){
        const newData = dataFactory()
        states[hookIndex++] = [newData, deps]
        return newData
    }
    hookIndex++
    return preData
}
export function useCallback(callback, deps){
    let [preCallback, preDeps] = states[hookIndex] || [null, null]
    if(!states[hookIndex] || deps.some((dep, index) => dep !== preDeps[index])){
        const newCallback = callback()
        states[hookIndex++] = [newCallback, deps]
        return newCallback
    }
    hookIndex++
    return preCallback
}