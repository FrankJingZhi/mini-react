import ReactDOM from './react-dom';
import React, {useState, useReducer, useEffect, useRef} from './react';

// 函数组件
// function MyComponent(props){
//     return <div id='box' className='box' style={{color: 'red'}}>hello, react!<span>xxx1</span><span>xxx2</span></div>
// }

// class MyChildComponent extends React.Component{
//     render(){
//         return <p>MyChildComponent</p>
//     }
// }

// 类组件
// class MyComponent extends React.Component{
//     counter = 0
//     constructor(props){
//         super(props)
//         this.state = {
//             // name: 'child1',
//             count: '0'
//         }
//     }

//     updateText(value){
//         this.setState({
//             count: value.toString() // TODO：这里必须是string，不能是其他类型。源码里也是这么实现的吗？
//         })
//     }

//     render(){
//         return <div>
//             <p style={{
//                 padding: '5px',
//                 border: '1px solid red',
//                 color: 'red',
//                 borderRadius: '4px'
//             }}
//                 onClick={() => this.updateText(++this.counter)}
//             >
//                 count is: {this.state.count}
//             </p>
//             <MyChildComponent/>
//             {/* <p>
//                 name is: {this.state.name}
//             </p> */}
//         </div>
//     }
// }

// // 官网ref使用示例
// class CustomTextInput extends React.Component {
//     constructor(props) {
//       super(props);
//       // create a ref to store the textInput DOM element
//       this.textInput = React.createRef();
//       this.focusTextInput = this.focusTextInput.bind(this);
//     }
  
//     focusTextInput() {
//       // Explicitly focus the text input using the raw DOM API
//       // Note: we're accessing "current" to get the DOM node
//       this.textInput.current.focus();
//     }
  
//     render() {
//       // tell React that we want to associate the <input> ref
//       // with the `textInput` that we created in the constructor
//       return (
//         <div>
//           <input
//             type="text"
//             ref={this.textInput} />
//           <input
//             type="button"
//             value="Focus the text input"
//             onClick={this.focusTextInput}
//           />
//         </div>
//       );
//     }
//   }

// class MyRefComponent extends React.Component{
//     constructor(props){
//         super(props)
//         // this.textInput = React.createRef();
//         // this.focusTextInput = this.focusTextInput.bind(this);
//         this.myComponentRef = React.createRef();
//     }
//     show100(){
//         this.myComponentRef.current.updateText(100)
//     }
//     render(){
//         return <div>
//             <div onClick={()=>this.show100()}>show100</div>
//             <MyComponent ref={this.myComponentRef} />
//         </div>
//     }
// }

// const MyForwardRefComponent = React.forwardRef((props, ref) => {
//     return <div ref={ref}>MyForwardRefComponent</div>
// })
// console.log('MyForwardRefComponent', MyForwardRefComponent)

// class MyComponent extends React.Component {
//     constructor(props){
//         super(props)
//         this.state = {
//             name: 'React'
//         }
//     }
//     render() {
//         return <div>Hello, {this.state.name}!</div>
//     }
//   }

// dom diff调试案例
// class MyDomDiffComponent extends React.Component{
//     isReset = false
//     oldValue = ['A','B','C','D','E']
//     newValue = ['C','B','E','F','A']
//     constructor(props){
//         super(props)
//         this.state = {
//             value: this.oldValue
//         }
//     }
//     updateValue(){
//         this.setState({
//             value: this.isReset ? this.oldValue : this.newValue
//         })
//     }
//     render(){
//         return <div>
//             <p style={{
//                 padding: '5px',
//                 border: '1px solid red',
//                 color: 'red',
//                 borderRadius: '4px',
//                 width: '200px',
//                 cursor: 'pointer'
//             }}
//                 onClick={() => this.updateValue()}
//             >
//                 updateValue
//             </p>
//             <p>
//                 {this.state.value.map(item => <span key={item}>{item}</span>)}
//             </p>
//         </div>
//     }
// }
// ReactDOM.render(<MyDomDiffComponent />, document.getElementById('root'))


// 生命周期case
// class MyLifeCycleComponent extends React.Component{
//     constructor(props){
//         super(props)
//         this.state = {
//             time: new Date()
//         }
//     }
//     componentDidMount(){
//         console.log('componentDidMount')
//         this.timer = setInterval(() => {
//             this.setState({
//                 time: new Date()
//             })
//         }, 1000)
//     }
//     componentWillUnmount(){
//         clearInterval(this.timer)
//     }
//     shouldComponentUpdate(){
//         console.log('shouldComponentUpdate')
//         return false
//     }
//     componentDidUpdate(prevProps, prevState, snapshot){
//         console.log('componentDidUpdate')
//     }
//     render(){
//         console.log('render')
//         return <div>
//             <p>{this.state.time.toLocaleTimeString()}</p>
//         </div>
//     }
// }


// useState hooks case
// function MyUseStateCounter() {
//     const [count, setCount] = useState(0)
//     return (
//         <div>
//             <p>You clicked {count} times</p>
//             <button onClick={() => setCount(count + 1)}>
//                 Click me
//             </button>
//         </div>
//     )
// }

// useReducer hooks case
// function MyUseReducerCounter(){
//     const reducer = (state, action) => {
//         switch(action.type){
//             case 'increment':
//                 return state + 1
//             case 'decrement':
//                 return state - 1
//             default:
//                 throw new Error()
//         }
//     }
//     const [count, dispatch] = useReducer(reducer, 0)
//     return (
//         <div>
//             <p>You clicked {count} times</p>
//             <button onClick={() => dispatch({type: 'increment'})}>
//                 Click me
//             </button>
//             <button onClick={() => dispatch({type: 'decrement'})}>
//                 Click me
//             </button>
//         </div>
//     )
// }

// useEffect
// function createConnection(serverUrl, roomId) {
//     // A real implementation would actually connect to the server
//     return {
//       connect() {
//         console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
//       },
//       disconnect() {
//         console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
//       }
//     };
//   }

// function ChatRoom({ roomId }) {
//     const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
//     useEffect(() => {
//       const connection = createConnection(serverUrl, roomId);
//       connection.connect();
//       return () => {
//         connection.disconnect();
//       };
//     }, [roomId, serverUrl]);
  
//     return (
//       <div>
//         <label>
//           Server URL:{' '}
//           <input
//             value={serverUrl}
//             onInput={e => setServerUrl(e.target.value)}
//           />
//         </label>
//         <h1>Welcome to the {roomId} room!</h1>
//       </div>
//     );
//   }
  
//   function App() {
//     const [roomId, setRoomId] = useState('general');
//     const [show, setShow] = useState(false);
//     return (
//       <div>
//         <label>
//           Choose the chat room:{' '}
//           <select
//             value={roomId}
//             onInput={e => setRoomId(e.target.value)}
//           >
//             <option value="general">general</option>
//             <option value="travel">travel</option>
//             <option value="music">music</option>
//           </select>
//         </label>
//         <button onClick={() => setShow(!show)}>
//           {show ? 'Close chat' : 'Open chat'}
//         </button>
//         {show && <hr />}
//         {show && <ChatRoom roomId={roomId} />}
//       </div>
//     );
//   }


// useRef
function Counter() {
    let ref = useRef(0);
  
    function handleClick() {
      ref.current = ref.current + 1;
      alert('You clicked ' + ref.current + ' times!');
    }

    const [count, setCount] = useState(0)
  
    return (
        <div>
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    useState click
                </button>
            </div>
            <button onClick={handleClick}>
                useRef Click
            </button>
        </div>
    );
  }
ReactDOM.render(<Counter />, document.getElementById('root'))
