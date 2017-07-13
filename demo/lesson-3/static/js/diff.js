import Component from './component'

function diff (a, b) {
  let patches = { old: a }
  walk(a, b, patches, 0)
  return patches
}

function walk (a, b, patches, index) {
  if (a === b) {
    return
  }
  let apply = patches[index]
  if (!b) {
    apply = appendPatch(apply, {type: 'remove', patch: null, old: null})
  } else if (isText(b)) {
    if (!isText(a)) {
      apply = appendPatch(apply, {type: 'text', patch: b, old: a})
    } else if (a !== b) {
      apply = appendPatch(apply, {type: 'text', patch: b, old: a})
    }
  } else if (isVNode(b)) {
    if (!isVNode(a)) {
      apply = appendPatch(apply, {type: 'replace', patch: b, old: a})
    } else if (a.tagName === b.tagName) {
      const propsPatch = diffProps(a.props, b.props)
      if (propsPatch) {
        apply = appendPatch(apply, {type: 'props', patch: propsPatch, old: a})
      }
      apply = diffChildren(a, b, apply, patches, index)
    } else {
      apply = appendPatch(apply, {type: 'replace', patch: b, old: a})
    }
  } else if (isComponent(b)) {
    apply = appendPatch(apply, {type: 'component', patch: b, old: a})
  }
  if (apply) {
    patches[index] = apply
  }
}

function diffProps (propsA, propsB) {
  let diff = null
  for (let key in propsA) {
    if (!propsB.hasOwnProperty(key)) {
      diff = diff || {}
      diff[key] = undefined
    }
    let aValue = propsA[key]
    let bValue = propsB[key]
    if (aValue === bValue) {
      continue
    } else if (typeof aValue === 'object' && typeof bValue === 'object' ) {
      if (Object.getPrototypeOf((aValue) !== Object.getPrototypeOf(bValue))) {
        diff = diff || {}
        diff[key] = bValue
      } else {
        let objDiff = diffProps(aValue, bValue)
        if (objDiff) {
          diff = diff || {}
          diff[key] = objDiff
        }
      }
    } else {
      diff = diff || {}
      diff[key] = bValue
    }
  }
  for (let key in propsB) {
    if (!propsA.hasOwnProperty(key)) {
      diff = diff || {}
      diff[key] = propsB[key]
    }
  }
  return diff
}

function diffChildren (a, b, apply, patches, index) {
  const aChildren = a.children
  const diffSet = reorder(aChildren, b.children)
  let bChildren = diffSet.children
  let len = Math.max(aChildren.length, bChildren.length)
  for (let i = 0; i < len; i++) {
    let leftNode = aChildren[i]
    let rightNode = bChildren[i]
    index += 1
    if (!leftNode) {
      if (rightNode) {
        apply = appendPatch(apply, {type: 'insert', patch: rightNode, old: null})
      }
    } else {
      walk(leftNode, rightNode, patches, index)
    }
    if (isVNode(leftNode) && leftNode.count) {
      index += leftNode.count
    }
  }
  if (diffSet.moves) {
    apply = appendPatch(apply, {type: 'order', patch: diffSet.moves, old: a})
  }
  return apply
}

function isVNode (a) {
  return typeof a.tagName === 'string'
}

function isText (a) {
  return typeof a === 'string' || typeof a === 'number'
}

function isComponent (a) {
  return typeof a.render === 'function'
}

function reorder(aChildren, bChildren) {
  var bChildIndex = keyIndex(bChildren)
  var bKeys = bChildIndex.keys
  var bFree = bChildIndex.free

  if (bFree.length === bChildren.length) {
    return {
      children: bChildren,
      moves: null
    }
  }

  // O(N) time, O(N) memory
  var aChildIndex = keyIndex(aChildren)
  var aKeys = aChildIndex.keys
  var aFree = aChildIndex.free

  if (aFree.length === aChildren.length) {
    return {
      children: bChildren,
      moves: null
    }
  }

  // O(MAX(N, M)) memory
  var newChildren = []

  var freeIndex = 0
  var freeCount = bFree.length
  var deletedItems = 0

  // Iterate through a and match a node in b
  // O(N) time,
  for (var i = 0; i < aChildren.length; i++) {
    var aItem = aChildren[i]
    var itemIndex

    if (aItem.key) {
      if (bKeys.hasOwnProperty(aItem.key)) {
        // Match up the old keys
        itemIndex = bKeys[aItem.key]
        newChildren.push(bChildren[itemIndex])

      } else {
        // Remove old keyed items
        itemIndex = i - deletedItems++
        newChildren.push(null)
      }
    } else {
      // Match the item in a with the next free item in b
      if (freeIndex < freeCount) {
        itemIndex = bFree[freeIndex++]
        newChildren.push(bChildren[itemIndex])
      } else {
        // There are no free items in b to match with
        // the free items in a, so the extra free nodes
        // are deleted.
        itemIndex = i - deletedItems++
        newChildren.push(null)
      }
    }
  }

  var lastFreeIndex = freeIndex >= bFree.length ?
    bChildren.length :
    bFree[freeIndex]

  // Iterate through b and append any new keys
  // O(M) time
  for (var j = 0; j < bChildren.length; j++) {
    var newItem = bChildren[j]

    if (newItem.key) {
      if (!aKeys.hasOwnProperty(newItem.key)) {
        // Add any new keyed items
        // We are adding new items to the end and then sorting them
        // in place. In future we should insert new items in place.
        newChildren.push(newItem)
      }
    } else if (j >= lastFreeIndex) {
      // Add any leftover non-keyed items
      newChildren.push(newItem)
    }
  }

  var simulate = newChildren.slice()
  var simulateIndex = 0
  var removes = []
  var inserts = []
  var simulateItem

  for (var k = 0; k < bChildren.length;) {
    var wantedItem = bChildren[k]
    simulateItem = simulate[simulateIndex]

    // remove items
    while (simulateItem === null && simulate.length) {
      removes.push(remove(simulate, simulateIndex, null))
      simulateItem = simulate[simulateIndex]
    }

    if (!simulateItem || simulateItem.key !== wantedItem.key) {
      // if we need a key in this position...
      if (wantedItem.key) {
        if (simulateItem && simulateItem.key) {
          // if an insert doesn't put this key in place, it needs to move
          if (bKeys[simulateItem.key] !== k + 1) {
            removes.push(remove(simulate, simulateIndex, simulateItem.key))
            simulateItem = simulate[simulateIndex]
            // if the remove didn't put the wanted item in place, we need to insert it
            if (!simulateItem || simulateItem.key !== wantedItem.key) {
              inserts.push({ key: wantedItem.key, to: k })
            }
            // items are matching, so skip ahead
            else {
              simulateIndex++
            }
          }
          else {
            inserts.push({ key: wantedItem.key, to: k })
          }
        }
        else {
          inserts.push({ key: wantedItem.key, to: k })
        }
        k++
      }
      // a key in simulate has no matching wanted key, remove it
      else if (simulateItem && simulateItem.key) {
        removes.push(remove(simulate, simulateIndex, simulateItem.key))
      }
    }
    else {
      simulateIndex++
      k++
    }
  }

  // remove all the remaining nodes from simulate
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex]
    removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
  }

  // If the only moves we have are deletes then we can just
  // let the delete patch remove these items.
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: newChildren,
      moves: null
    }
  }

  return {
    children: newChildren,
    moves: {
      removes: removes,
      inserts: inserts
    }
  }
}

function remove(arr, index, key) {
  arr.splice(index, 1)
  return {
    from: index,
    key
  }
}

function keyIndex(children) {
  var keys = {}
  var free = []
  var length = children.length

  for (var i = 0; i < length; i++) {
    var child = children[i]

    if (child.key) {
      keys[child.key] = i
    } else {
      free.push(i)
    }
  }
  return {
    keys: keys,     // A hash of key name to index
    free: free      // An array of unkeyed item indices
  }
}

function appendPatch (apply, patch) {
  if (apply) {
    if (Array.isArray(apply)) {
      apply.push(patch)
    } else {
      apply = [apply, patch]
    }
    return apply
  }
  return [patch]
}

module.exports = diff
