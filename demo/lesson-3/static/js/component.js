import { updateComponent } from './lifecycle'

class Component {
  constructor (props) {
    this.props = props
  }

  // setState (state, callback) {
  //   // 产生组件更新
  //   // 调用一系列生命周期方法以及this.render()
  //   if (typeof state === 'function') {
  //     this.state = state.call(this, this.state, this.props)
  //   } else {
  //     this.state = Object.assign(this.state, state)
  //   }
  //   if (callback) {
  //     callback.call(this)
  //   }
  //   updateComponent(this)
  // }

  setState (state, callback) {
    if (state) {
      (this._pendingStates = (this._pendingStates || [])).push(state)
    }
    if (typeof callback === 'function') {
      (this._pendingCallbacks = (this._pendingCallbacks || [])).push(callback)
    }
    setTimeout(() => {
      updateComponent(this)
    }, 0)
  }

  getState () {
    const { _pendingStates = [], state, props } = this
    if (!_pendingStates.length) {
      return state
    }
    const stateClone = Object.assign({}, state)
    const queue = _pendingStates.concat()
    this._pendingStates.length = 0
    queue.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState.call(this, state, props)
      }
      Object.assign(stateClone, nextState)
    })
    return stateClone
  }
}

module.exports = Component
