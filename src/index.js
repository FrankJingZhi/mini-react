import ReactDOM from './react-dom';
import React from './react';

// 函数组件
// function MyComponent(props){
//     return <div id='box' className='box' style={{color: 'red'}}>hello, react!<span>xxx1</span><span>xxx2</span></div>
// }

// 类组件
class MyComponent extends React.Component{
    counter = 0
    constructor(props){
        super(props)
        this.state = {
            // name: 'child1',
            count: '0'
        }
    }

    updateText(value){
        this.setState({
            count: value.toString() // TODO：这里必须是string，不能是其他类型。源码里也是这么实现的吗？
        })
    }

    render(){
        return <div>
            <p style={{
                padding: '5px',
                border: '1px solid red',
                color: 'red',
                borderRadius: '4px'
            }}
                onClick={() => this.updateText(++this.counter)}
            >
                count is: {this.state.count}
            </p>
            {/* <p>
                name is: {this.state.name}
            </p> */}
        </div>
    }
}

ReactDOM.render(<MyComponent name='child1'/>, document.getElementById('root'))


  