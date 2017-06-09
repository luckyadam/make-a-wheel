const createElement = require('./index.js').createElement;

const node = createElement(
  'div',
  { className: 'test' },
  createElement(
    'ul',
    { className: 'list' },
    createElement(
      'li',
      null,
      '1'
    ),
    createElement(
      'li',
      null,
      '2'
    ),
    createElement(
      'li',
      null,
      '3'
    )
  )
);

console.log(node);