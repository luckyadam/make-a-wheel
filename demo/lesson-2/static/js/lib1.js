const Component = require('./component')
const VNode = require('./vnode')

const EMPTY_CHILDREN = []

function createVNode (tagName, props, children) {
  return new VNode(tagName, props, children)
}

function createComponent (tagName, props, children) {
  props = props || {}
  props.children = children
  return new tagName(props)
}

function createElement (tagName, props) {
  let children = EMPTY_CHILDREN
  for (let i = 2, len = arguments.length; i < len; i++) {
    const argumentsItem = arguments[i]
    if (Array.isArray(argumentsItem)) {
      argumentsItem.forEach(item => {
        if (children === EMPTY_CHILDREN) {
          children = [item]
        } else {
          children.push(item)
        }
      })
    } else if (children === EMPTY_CHILDREN) {
      children = [argumentsItem]
    } else {
      children.push(argumentsItem)
    }
  }
  if (typeof tagName === 'string') {
    return createVNode(tagName, props, children)
  } else if (typeof tagName === 'function') {
    return createComponent(tagName, props, children)
  }
}

function mountVNode (vnode) {
  if (vnode instanceof Component && typeof vnode.render === 'function') {
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
      domNode[propName.toLowerCase()] = propValue
    } else if (propName in domNode && propValue) {
      domNode[propName] = propValue
    } else if (domNode.setAttribute) {
      domNode.setAttribute(propName, propValue)
    }
  }
}

function render (vnode, container, callback) {
  const dom = mountVNode(vnode)
  if (container) {
    container.appendChild(dom)
  }

  if (callback) {
    callback()
  }
}

module.exports = {
  render,
  createElement
}
