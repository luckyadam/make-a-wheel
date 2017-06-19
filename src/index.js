exports.createElement = function (tagName, props, ...children) {
  return { tagName, props, children }
}

exports.createDomNode = function (vnode) {
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
    children.forEach(child => domNode.appendChild(createDomNode(child)))
  }
  return domNode
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
    } else if (propName in domNode && propValue) {
      domNode[propName] = propValue
    } else if (domNode.setAttribute) {
      domNode.setAttribute(propName, propValue)
    }
  }
}
