import ReactDOM from './react-dom';
import React from './react';

// 函数组件
// function MyComponent(props){
//     return <div id='box' className='box' style={{color: 'red'}}>hello, react!<span>xxx1</span><span>xxx2</span></div>
// }

class MyChildComponent extends React.Component{
    render(){
        return <p>MyChildComponent</p>
    }
}

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
class MyDomDiffComponent extends React.Component{
    isReset = false
    oldValue = ['A','B','C','D','E']
    newValue = ['C','B','E','F','A']
    constructor(props){
        super(props)
        this.state = {
            value: this.oldValue
        }
    }
    updateValue(){
        this.setState({
            value: this.isReset ? this.oldValue : this.newValue
        })
    }
    render(){
        return <div>
            <p style={{
                padding: '5px',
                border: '1px solid red',
                color: 'red',
                borderRadius: '4px',
                width: '200px',
                cursor: 'pointer'
            }}
                onClick={() => this.updateValue()}
            >
                updateValue
            </p>
            <p>
                {this.state.value.map(item => <span key={item}>{item}</span>)}
            </p>
        </div>
    }
}
ReactDOM.render(<MyDomDiffComponent />, document.getElementById('root'))


  