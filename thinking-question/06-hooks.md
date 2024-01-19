## hooks

1. hooks 为什么存在

   1. 类组件难以重用存在状态的逻辑，需要使用 render props 和 HOC，可维护性差
   2. 类组件逻辑复杂时不容易理解，因为代码逻辑被生命周期钩子分散在各处
   3. Class 类本身存在一些缺陷，导致理解和创新上不容易处理。比如 this 指向问题，探索的提前编译的能力有阻碍

2. hooks 本质

   就是一个普通函数，只不过内部提供了一个全局变量用来存储所有的数据，以此对内部函数提供访问和修改数据的能力。部分函数像 useState，useEffect，useReducer,useLayoutEffect 还使用了闭包来做缓存

## 实现 useState

## 实现 useEffect 和 useLayoutEffect

两者区别：https://react.dev/reference/react/useLayoutEffect#examples
useEffect 放在宏任务中执行，页面绘制完之后再执行，优先级较低
useLayoutEffect 放在微任务中执行，会阻塞页面的重绘，页面绘制完之前执行，优先级较高

## useRef
