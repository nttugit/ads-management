// functions.js

function add(a, b) {
    return a + b;
  }
  
  module.exports = add;

  // __tests__/functions.test.js

const add = require('../functions');

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
