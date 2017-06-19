const createElement = require('./index.js').createElement;
const createDomNode = require('./index.js').createDomNode;

function updateComponent(component) {
  const vnode = component.render();
  const oldDom = component.dom;
  const dom = createDomNode(vnode);
  component.dom = dom;
  if (oldDom) {
    component.container.replaceChild(dom, oldDom);
  } else {
    component.container.appendChild(dom);
  }
}

function mountComponent(component) {
  const vnode = component.render();
  const dom = createDomNode(vnode);
  component.dom = dom;
  if (component.componentDidMount) {
    component.componentDidMount();
  }
}

function render(component, container) {
  component.container = container;
  mountComponent(component);
  container.appendChild(component.dom);
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState(newState) {
    Object.assign(this.state, newState);
    updateComponent(this);
  }
}

class Counter extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 1
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        count: ++this.state.count
      });
    }, 1000);
  }

  render() {
    return createElement(
      'div',
      null,
      this.state.count
    );
  }
}