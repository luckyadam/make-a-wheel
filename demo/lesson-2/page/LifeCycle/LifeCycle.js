/**
 * @author luckyadam
 * @date 2017-7-6
 * @desc 生命周期示例
 */

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'main'
    }
  }

  render () {
    return (
      <LifeCycle
        unmout={this.unmoutComponent}
        name={this.state.name}
        testComponentWillReceiveProps={this.changeState.bind(this)} />
    )
  }

  unmoutComponent () {
    // 这里卸载父组件也会导致卸载子组件
    ReactDOM.unmountComponentAtNode(document.getElementById('app'))
  }

  changeState () {
    this.setState({
      name: 'TriggerUpdateFromParent'
    })
  }
}

class LifeCycle extends React.Component {
  constructor (props) {
    super(props)
    console.log('~~ LifeCycle %c constructor ~~', 'color: blue;font-size: 24px;font-weight: bold;')
    this.state = {
      name:'LifeCycle'
    }
  }
  /**
   * 在挂载之前调用
   */
  componentWillMount () {
    console.log('~~ LifeCycle %c componentWillMout ~~', 'color: blue;font-size: 24px;font-weight: bold;')
  }

  render() {
    console.log('~~ LifeCycle %c render ~~', 'color: blue;font-size: 24px;font-weight: bold;')
    return (
      <div>
        <h1>LifeCycle Demo </h1>
        <p>name:{this.state.name}</p>
        <p><button onClick={this._setState.bind(this)}>setState</button></p>
        <p><button onClick={this._forceWithUpdate.bind(this)}>forceWithUpdate</button></p>
        <p><button onClick={this.parentChangeProps.bind(this)}>parentChangeProps</button></p>
        <p><button onClick={this._unmout.bind(this)}>unmout</button></p>
      </div>
    )
  }

  /**
   * 测试 ComponentWillReceiveProps 方法
   */
  parentChangeProps () {
    this.props.testComponentWillReceiveProps()
  }

  /**
   * 在挂载之后调用
   */
  componentDidMount(){
    console.log('~~ LifeCycle %c componentDidMout ~~', 'color: blue;font-size: 24px;font-weight: bold;')
  }

  /**
   * 组件挂载之后 当调用 setState() 的时候  如果此方法返回 true ，则会重新渲染，否则不会
   */
  shouldComponentUpdate (nextProps, nextState) {
    console.log('~~ LifeCycle %c shouldComponentUpdate ~~', 'color: blue;font-size: 24px;font-weight: bold;')
    console.log('LifeCycle shouldComponentUpdate nextState', nextState)
    return true
  }

  /**
   * props 改变的时候调用
   */
  componentWillReceiveProps (nextProps) {
    this.setState({
      name: nextProps.name
    })
    console.log('~~ LifeCycle %c componentWillReceiveProps ~~', 'color: blue;font-size: 24px;font-weight: bold;')
  }
  /**
   * shouldComponentUpdate 返回 true 的时候 将要更新
   */
  componentWillUpdate (nextProps, nextState) {
    console.log('~~ LifeCycle %c componentWillUpdate ~~', 'color: blue;font-size: 24px;font-weight: bold;')
    console.log('LifeCycle componentWillUpdate nextState', nextState)
  }

  /**
   * 组件已经更新
   */
  componentDidUpdate () {
    console.log('~~ LifeCycle %c componentDidUpdate ~~', 'color: blue;font-size: 24px;font-weight: bold;')
  }

  /**
   * 组件将要卸载
   */
  componentWillUnmount () {
    console.log('~~ LifeCycle %c componentWillUnmount ~~', 'color: blue;font-size: 24px;font-weight: bold;')
  }

  /**
   * 组件卸载的方法
   */
  _unmout () {
    this.props.unmout()
  }

  _forceWithUpdate () {
    this.forceUpdate()
  }

  /**
   * 修改 state 方法
   */
  _setState () {
    this.setState({
      name:'TriggerUpdate'
    })
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('app')
)
