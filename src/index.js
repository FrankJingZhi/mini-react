import ReactDOM from './react-dom';
import React from './react'

console.log(<div>hello, react!<span>xxx1</span><span>xxx2</span></div>)

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<div>hello, react!</div>);

ReactDOM.render(<div>hello, react!<span>xxx1</span><span>xxx2</span></div>, document.getElementById('root'))