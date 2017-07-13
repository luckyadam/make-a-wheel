class Component {
  constructor (props) {
    this.props = props
  }

  setState (state, callback) {
    // 产生组件更新
    // 调用一系列生命周期方法以及this.render()
  }
}

module.exports = Component
