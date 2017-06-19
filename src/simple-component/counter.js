const Component = require('./component')

class Counter extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      count: 1
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({
        count: ++this.state.count
      })
    }, 1000)
  }

  render () {
    return <div>{this.state.count}</div>
  }
}

module.exports = Counter
