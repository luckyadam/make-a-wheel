const diff = require('./diff')
const patch = require('./patch')

function mountVNode (vnode) {
  return createDOMNode(vnode)
}

function createDOMNode (vnode) {
  if (typeof vnode.render === 'function') {
    return mountComponent(vnode)
  }
  const tagName = vnode.tagName
  const props = vnode.props
  const namespace = props ? props.namespace : null
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode)
  }
  const domNode = namespace ?
    document.createElementNS(namespace, tagName) :
    document.createElement(tagName)
  setProps(domNode, props)
  const children = vnode.children
  if (children.length) {
    children.forEach(child => domNode.appendChild(mountVNode(child)))
  }
  return domNode
}

function mountComponent (component) {
  if (component.componentWillMount) {
    component.componentWillMount()
    component.state = component.getState()
  }
  const rendered = component.render()
  component._rendered = rendered
  const dom = mountVNode(rendered)
  component.dom = dom
  const ref = component.props.ref
  if (typeof ref === 'function') {
    ref(component)
  }
  if (component.componentDidMount) {
    component.componentDidMount()
  }
  return dom
}

function setProps (domNode, props) {
  for (let propName in props) {
    let propValue = props[propName]
    if (propName === 'style') {
      for (let s in propValue) {
        let styleValue = propValue[s]
        if (styleValue !== undefined) {
          domNode[propName][s] = styleValue
        }
      }
    } else if (propName === 'ref' && typeof propValue === 'function') {
      propValue(domNode)
    } else if (propName === 'dangerousSetInnerHTML') {
      domNode.innerHTML = propValue.__html || ''
    } else if (/^on/.test(propName)) {
      // domNode[propName.toLowerCase()] = propValue
      let eventStore = domNode.eventStore || (domNode.eventStore = {})
      eventStore[eventType] = propValue
      const eventName = propName.toLowerCase().substr(2)
      document.addEventListener(eventName, function (event) {

      }, false)
    } else if (propName in domNode && propValue) {
      domNode[propName] = propValue
    } else if (domNode.setAttribute) {
      domNode.setAttribute(propName, propValue)
    }
  }
}

function updateComponent (component) {
  const lastDom = component.dom
  // const state = component.state
  const state = component.state = component.getState()
  const props = component.props
  if (component.shouldComponentUpdate
    && component.shouldComponentUpdate(props, state) === false) {
    return
  }
  if (component.componentWillUpdate) {
    component.componentWillUpdate(props, state)
  }
  const lastRendered = component._rendered
  const rendered = component.render()
  const patches = diff(lastRendered, rendered)
  component.dom = patch(lastDom, patches)
  if (component.componentDidUpdate) {
    component.componentDidUpdate(props, state, context)
  }
}

function reRenderComponent (prev, curr) {
  const nextProps = curr.props
  if (prev.componentWillReceiveProps) {
    prev.componentWillReceiveProps(nextProps)
  }
  prev.props = nextProps
  updateComponent(prev)
  return prev.dom
}

module.exports = {
  updateComponent,
  reRenderComponent,
  mountVNode
}
