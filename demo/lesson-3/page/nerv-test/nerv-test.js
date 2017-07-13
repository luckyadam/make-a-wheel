/**
 * @author luckyadam
 * @date 2017-7-12
 * @desc nerv测试
 */

import Component from '../../static/js/component'
import { render, createElement } from '../../static/js/lib'

class Sub extends Component {
  constructor () {
    super(...arguments)
    this.state = {
    }
  }

  render () {
    return (
      <div className='sub'>
        {this.props.text}
      </div>
    )
  }
}

class NervTest extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      name: 'sub',
      listData: [1, 2, 3, 4, 5]
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        name: 'change',
        listData: [1, 2, 3]
      })
    }, 3000)
  }

  render () {
    return (
      <div className='nerv_test'>
        <ul className='list'>
          {this.state.listData.map(item => <li className='list_item'>{item}</li>)}
        </ul>
        <Sub text={this.state.name} />
      </div>
    )
  }
}

render(<NervTest />, document.getElementById('app'))
