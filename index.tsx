const React = {
    //Creating Virtual DOM
    createElement: (tag, props, ...children) => {
        if (typeof tag == 'function') {
            try {
                return tag(props);
            } catch ({ promise, key}) {
                promise.then(data => {
                    promiseCache.set(key, data);
                    rerender();
                })
                return {tag: 'h1', props: {children:['I AM LOADING']}}
            }
        }

        var element = {tag, props: {...props, children}};
        return element;
    },
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
    const FROZENCURSOR = stateCursor;
    states[FROZENCURSOR] = states[FROZENCURSOR] || initialState;
    
    const setState = (newState) => {
        states[FROZENCURSOR] = newState;
        rerender();
    };

    stateCursor++;
    return [states[FROZENCURSOR], setState];
}

const promiseCache = new Map();
const createResource = (func, key) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key);
    }

    throw { promise: func(), key };
}

const App = () => {
    const [name, setName] = useState("person");
    const [count, setCount] = useState(0);
    const dogPhotoURL = createResource(() => fetch('https://dog.ceo/api/breeds/image/random').then(r => r.json()).then(payload => payload.message), 'dogPhoto'); 

    return (
        <div className="react-2020" id="app">
            <h1>Hello, {name}!</h1>
            <input type="text" placeholder="name" value={name} onchange={e => setName(e.target.value)} />
            <h2>The count is {count}</h2>
            <img src={dogPhotoURL} alt="DOG PHOTO"/>
            <button onclick={() => setCount(count + 1)}>+</button>
            <button onclick={() => setCount(count - 1)}>-</button>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab facere necessitatibus vel nemo provident perspiciatis, pariatur repellat temporibus mollitia vero ea delectus voluptatum fugiat officiis laboriosam, deserunt, iure nam! Error.</p>
        </div>)
};

/**Renderring Means Mapping the Virtual DOM element to Actual DOM Element */
const render = (reactElementOrStringOrNumber, container) => {
    if (['string', 'number'].includes(typeof reactElementOrStringOrNumber)) {
        container.appendChild(document.createTextNode(String(reactElementOrStringOrNumber)));
        return;
    }

    // Creating the TAG Element
    const actualDomElement = document.createElement(reactElementOrStringOrNumber.tag);

    // Assign Props from React Element to Actual DOM Element
    if (reactElementOrStringOrNumber.props) {
        Object.keys(reactElementOrStringOrNumber.props).filter(p => {
            return p !== 'children'
        }).forEach(p => actualDomElement[p] = reactElementOrStringOrNumber.props[p])
    }

    if (reactElementOrStringOrNumber.props.children) {
        reactElementOrStringOrNumber.props.children.forEach(child => render(child, actualDomElement));
    }

    container.appendChild(actualDomElement);
}

const rerender = () => {
    stateCursor = 0;
    document.querySelector('#app').firstChild.remove();
    render(<App />, document.querySelector('#app'));
}

render(<App />, document.querySelector('#app'));