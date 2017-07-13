const Component = require('./component')
const VNode = require('./vnode')
import { mountVNode } from './lifecycle'

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
  createElement,
}
