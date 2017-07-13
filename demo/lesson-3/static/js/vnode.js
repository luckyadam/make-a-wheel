class VNode {
  constructor (tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children

    let descendants = 0
    let count = children.length || 0
    if (count) {
      children.forEach((child) => {
        if (isVNode(child)) {
          descendants += child.count || 0
        }
      })
    }
    count = count + descendants
    this.count = count
  }
}

function isVNode (a) {
  return typeof a.tagName === 'string'
}

module.exports = VNode
