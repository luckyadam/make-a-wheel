const createElement = require('./index.js').createElement

const node = (
  <div className='test'>
    <ul className='list'>
      <li className='list_item' style={{color: 'red'}}>1</li>
      <li className='list_item'>2</li>
      <li className='list_item'>3</li>
      <li className='list_item'>4</li>
      <li className='list_item'>5</li>
    </ul>
  </div>
)

console.log(node)
