const React = {
    //Creating Virtual DOM
    createElement: (tag, props, ...children) => {
        if (typeof tag == 'function') {
            console.log("Function ", props);
            return tag(props);
        }

        var element = {tag, props: {...props, children}};
        console.log(element);
        return element;
    },
};

const App = () => (
<div className="react-2020" id="app">
    <h1>Hello, thambi!</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab facere necessitatibus vel nemo provident perspiciatis, pariatur repellat temporibus mollitia vero ea delectus voluptatum fugiat officiis laboriosam, deserunt, iure nam! Error.</p>
</div>);

/**Renderring Means Mapping the Virtual DOM element to Actual DOM Element */
const render = (reactElement, container) => {
    const actualDomElement = document.createElement(reactElement.tag);
    if (reactElement.props) {
        Object.keys(reactElement.props).filter(p => {
            console.log(p);
            return p !== 'children'
        }).forEach(p => actualDomElement[p] = reactElement[p])
    }
}

render(<App />, document.querySelector('#app'));