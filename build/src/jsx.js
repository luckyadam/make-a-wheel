const createElement = require('./index.js').createElement;

const node = createElement(
  'div',
  { className: 'test' },
  createElement(
    'ul',
    { className: 'list' },
    createElement(
      'li',
      { className: 'list_item', style: { color: 'red' } },
      '1'
    ),
    createElement(
      'li',
      { className: 'list_item' },
      '2'
    ),
    createElement(
      'li',
      { className: 'list_item' },
      '3'
    ),
    createElement(
      'li',
      { className: 'list_item' },
      '4'
    ),
    createElement(
      'li',
      { className: 'list_item' },
      '5'
    )
  )
);

console.log(node);