/**
 * @author luckyadam
 * @date 2017-7-5
 * @desc 样例2
 */

import Component from '../../static/js/component'
import { render, createElement } from '../../static/js/lib1'

class ListItem extends Component {
  constructor () {
    super(...arguments)
    this.state = {
    }
  }

  render () {
    return <li>{this.props.value}</li>
  }
}

class List extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      title: '<span>哈哈哈</span>',
      listData: [1, 2, 3, 4, 5]
    }
    this.items = []
  }

  componentDidMount () {
    console.log(this)
  }

  render () {
    return (
      <div className='list'>
        <h1 dangerousSetInnerHTML={{__html: this.state.title}}></h1>
        <ul ref={(node) => this.ul = node}>
          {this.state.listData.map(item => {
            return <ListItem ref={(instance) => this.items.push(instance)} value={item} />
          })}
        </ul>
      </div>
    )
  }
}
render(<List />, document.getElementById('app'))
