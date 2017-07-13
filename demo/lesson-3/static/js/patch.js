import Component from './component'
import { createDOMNode, reRenderComponent } from './lifecycle'

function patch (rootNode, patches) {
  let patchIndices = getPatchIndices(patches)
  if (patchIndices.length === 0) {
    return rootNode
  }
  let oldTree = patches.old
  let nodes = domIndex(rootNode, oldTree, patchIndices)
  patchIndices.forEach(index => {
    rootNode = applyPatch(rootNode, nodes[index], patches[index])
  })
  return rootNode
}

function applyPatch (rootNode, domNode, patch) {
  if (!domNode) {
    return rootNode
  }
  let newNode
  if (!Array.isArray(patch)) {
    patch = [patch]
  }
  patch.forEach(patchItem => {
    newNode = patchSingle(domNode, patchItem)
    if (domNode === rootNode) {
      rootNode = newNode
    }
  })
  return rootNode
}

function patchSingle (domNode, vpatch) {
  let type = vpatch.type
  let oldVNode = vpatch.old
  let patchObj = vpatch.patch

  switch (type) {
    case 'text':
      return patchVText(domNode, patchObj)
    case 'replace':
      return patchVNode(domNode, patchObj)
    case 'insert':
      return patchInsert(domNode, patchObj)
    case 'props':
      return patchProps(domNode, patchObj, oldVNode.props)
    case 'order':
      return patchOrder(domNode, patchObj)
    case 'remove':
      return patchRemove(domNode, oldVNode)
    case 'component':
      return patchComponent(domNode, oldVNode, patchObj)
    default:
      return domNode
  }
}

function patchVText (domNode, patch) {
  if (domNode === null) {
    return createDOMNode(patch)
  }
  if (domNode.nodeType === 3) {
    if (domNode.textContent) {
      domNode.textContent = patch
    } else {
      domNode.nodeValue = patch
    }
    return domNode
  }
  let parentNode = domNode.parentNode
  let newNode = createDOMNode(patch)
  if (parentNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  return newNode
}

function patchVNode (domNode, patch) {
  if (domNode === null) {
    return createDOMNode(patch)
  }
  let parentNode = domNode.parentNode
  let newNode = createDOMNode(patch)
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  return newNode
}

function patchInsert (parentNode, vnode) {
  let newNode = createDOMNode(vnode)
  if (parentNode && newNode) {
    parentNode.appendChild(newNode)
  }
  return parentNode
}

function patchProps (domNode, patch, previousProps) {
  for (let propName in patch) {
    let propValue = patch[propName]
    let previousValue = previousProps[propName]
    if (propValue === undefined) {
      if (propName === 'attributes') {
        for (let attrName in previousValue) {
          if (domNode.removeAttribute) {
            domNode.removeAttribute(attrName)
          }
        }
      } else if (propName === 'style') {
        for (let styleName in previousValue) {
          domNode.style[styleName] = ''
        }
      } else if (typeof previousValue === 'string') {
        domNode[propName] = ''
      } else {
        domNode[propName] = null
      }
      if (propValue && propValue.hook) {
        propValue.hook(domNode, propName, previousValue)
      }
    } else if (propName === 'attributes') {
      for (let attrName in propValue) {
        let attrValue = propValue[attrName]
        if (attrValue === undefined && domNode.removeAttribute) {
          domNode.removeAttribute(attrName)
        } else if (domNode.setAttribute) {
          domNode.setAttribute(attrName, attrValue)
        }
      }
    } else if (propName === 'style') {
      for (let styleName in propValue) {
        let styleValue = propValue[styleName]
        if (styleValue !== undefined) {
          try {
            domNode[propName][styleName] = styleValue
          } catch (err) {}
        }
      }
    } else if (typeof propValue === 'object') {
      if (previousValue && typeof previousValue === 'object' &&
        Object.getPrototypeOf(previousValue) !== Object.getPrototypeOf(propValue)) {
        domNode[propName] = propValue
      }
    } else {
      domNode[propName] = propValue
    }
  }
  return domNode
}

function patchOrder (domNode, patch) {
  let removes = patch.removes
  let inserts = patch.inserts
  let childNodes = domNode.childNodes
  let keyMap = {}
  let node
  let remove
  let insert
  for (let i = 0; i < removes.length; i++) {
    remove = removes[i]
    node = childNodes[remove.from]
    if (remove.key) {
      keyMap[remove.key] = node
    }
    domNode.removeChild(node)
  }

  let length = childNodes.length
  for (let j = 0; j < inserts.length; j++) {
    insert = inserts[j]
    node = keyMap[insert.key]
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
  }
  return domNode
}

function patchRemove (domNode, vnode) {
  let parentNode = domNode.parentNode
  if (parentNode) {
    parentNode.removeChild(domNode)
  }
  return null
}

function patchComponent (domNode, oldNode, newNode) {
  let newDom
  // 判断是否是对Component进行更新
  if (isComponent(oldNode) && oldNode.constructor.name === newNode.constructor.name) {
    newDom = reRenderComponent(oldNode, newNode)
  } else {
    newDom = createDOMNode(newNode)
  }
  const parentNode = domNode.parentNode
  if (parentNode && domNode !== newDom) {
    parentNode.replaceChild(newDom, domNode)
  }
  return newDom
}

function isComponent (a) {
  return typeof a.render === 'function'
}

function getPatchIndices (patches) {
  let indices = []
  if (patches) {
    for (let i in patches) {
      if (i !== 'old' && patches.hasOwnProperty(i)) {
        indices.push(Number(i))
      }
    }
  }
  return indices
}

function domIndex (rootNode, tree, patchIndices, nodes) {
  if (!patchIndices || patchIndices.length === 0) {
    return {}
  }
  patchIndices.sort((v1, v2) => v1 - v2)
  return recurse(rootNode, tree, patchIndices, nodes, 0)
}

function recurse (rootNode, tree, patchIndices, nodes, index) {
  nodes = nodes || {}
  if (rootNode) {
    if (indexInRange(patchIndices, index, index)) {
      nodes[index] = rootNode
    }
    let vChildren = tree.children
    if (vChildren) {
      let childNodes = rootNode.childNodes
      vChildren.forEach((vChild, i) => {
        index++
        vChild = vChild || {}
        let nextIndex = index + (vChild.count || 0)
        if (indexInRange(patchIndices, index, nextIndex)) {
          recurse(childNodes[i], vChild, patchIndices, nodes, index)
        }
        index = nextIndex
      })
    }
  }
  return nodes
}

function indexInRange (indices, left, right) {
  if (indices.length === 0) {
    return false
  }
  let minIndex = 0
  let maxIndex = indices.length - 1
  let currentIndex
  let currentItem
  while (minIndex <= maxIndex) {
    currentIndex = ((maxIndex + minIndex) / 2) >> 0
    currentItem = indices[currentIndex]
    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right
    }
    if (currentItem < left) {
      minIndex = currentIndex + 1
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1
    } else {
      return true
    }
  }
  return false
}

module.exports = patch
