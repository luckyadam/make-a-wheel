/**
 * @author luckyadam
 * @date 2017-7-12
 * @desc setState样例
 */

class SetStateSample extends React.Component {
  constructor () {
    super()
    this.state = {
      count: 0
    }
  }

  componentDidMount () {
    this.setState({ count: this.state.count + 1 })

    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count)
  }

  componentWillUpdate () {
    console.log('componentWillUpdate')
  }

  // componentWillMount () {
  //   this.setState({ count: this.state.count + 1 })
  //   console.log(this.state.count)
  // }

  render () {
    return <div>{this.state.count}</div>
  }
}

ReactDOM.render(<SetStateSample />, document.getElementById('app'))
