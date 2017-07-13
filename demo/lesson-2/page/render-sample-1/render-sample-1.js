/**
 * @author luckyadam
 * @date 2017-7-5
 * @desc 样例1
 */

import { render, createElement } from '../../static/js/sample-lib-1'

// const node = createElement('div', { className: 'container' },
//   createElement('ul', { className: 'list' },
//     createElement('li', { className: 'list_item' }, 1),
//     createElement('li', { className: 'list_item' }, 2),
//     createElement('li', { className: 'list_item' }, 3),
//     createElement('li', { className: 'list_item' }, 4),
//     createElement('li', { className: 'list_item' }, 5)
//   )
// )

const node = (
  <div className='container'>
    <ul className='list'>
      {[1, 2, 3, 4, 5].map(item => <li className='list_item'>{item}</li>)}
    </ul>
  </div>
)

render(node, document.getElementById('app'))
