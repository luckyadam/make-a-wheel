exports.createElement = function (tagName, properties, ...children) {
  return { tagName, properties, children }
}

exports.createDomNode = function (vnode) {
  const tagName = vnode.tagName
  const properties = vnode.properties
  const namespace = properties ? properties.namespace : null
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode)
  }
  const domNode = namespace ?
    document.createElementNS(namespace, tagName) :
    document.createElement(tagName)
  setProperties(domNode, properties)
  const children = vnode.children
  if (children.length) {
    children.forEach(child => domNode.appendChild(createDomNode(child)))
  }
  return domNode
}

function setProperties (domNode, properties) {
  for (let propName in properties) {
    let propValue = properties[propName]
    if (typeof propValue === 'object') {
      if (propName === 'attributes') {
        for (let k in propValue) {
          let attrValue = propValue[k]
          if (attrValue !== undefined) {
            domNode.setAttribute(k, attrValue)
          }
        }
      } else if (propName === 'style') {
        for (let s in propValue) {
          let styleValue = propValue[s]
          if (styleValue !== undefined) {
            try {
              domNode[p][s] = styleValue
            } catch (err) {}
          }
        }
      }
    } else {
      domNode[propName] = propValue
    }
  }
}
